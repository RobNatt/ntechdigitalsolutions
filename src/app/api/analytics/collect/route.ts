import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_BODY = 12_000;

function corsHeaders(origin: string | null) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", origin || "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

type CollectBody = {
  writeKey?: string;
  path?: string;
  referrer?: string | null;
  sessionId?: string;
  visitorId?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  eventType?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Public ingest for first-party analytics (N-Tech site + client embeds).
 * Validates write_key against analytics_site_keys; stores denormalized company_id for fast queries.
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  let body: CollectBody;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) {
      return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413, headers });
    }
    body = JSON.parse(raw) as CollectBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400, headers });
  }

  const writeKey = typeof body.writeKey === "string" ? body.writeKey.trim() : "";
  if (!writeKey) {
    return NextResponse.json({ ok: false, error: "writeKey required" }, { status: 400, headers });
  }

  const path =
    typeof body.path === "string" && body.path.length > 0
      ? body.path.slice(0, 2048)
      : "/";
  const referrer =
    typeof body.referrer === "string" ? body.referrer.slice(0, 2048) : null;
  const sessionId =
    typeof body.sessionId === "string" && body.sessionId.length > 0
      ? body.sessionId.slice(0, 128)
      : "";
  const visitorId =
    typeof body.visitorId === "string" && body.visitorId.length > 0
      ? body.visitorId.slice(0, 128)
      : "";
  if (!sessionId || !visitorId) {
    return NextResponse.json(
      { ok: false, error: "sessionId and visitorId required" },
      { status: 400, headers }
    );
  }

  const eventType =
    typeof body.eventType === "string" && body.eventType.length > 0
      ? body.eventType.slice(0, 64)
      : "pageview";

  try {
    const admin = createAdminClient();
    const { data: keyRow, error: keyError } = await admin
      .from("analytics_site_keys")
      .select("id, company_id")
      .eq("write_key", writeKey)
      .maybeSingle();

    if (keyError || !keyRow?.id || !keyRow.company_id) {
      return NextResponse.json({ ok: false, error: "Invalid write key" }, { status: 401, headers });
    }

    const { error: insertError } = await admin.from("analytics_events").insert({
      site_key_id: keyRow.id,
      company_id: keyRow.company_id,
      path,
      referrer,
      utm_source: body.utmSource?.slice(0, 512) ?? null,
      utm_medium: body.utmMedium?.slice(0, 512) ?? null,
      utm_campaign: body.utmCampaign?.slice(0, 512) ?? null,
      session_id: sessionId,
      visitor_id: visitorId,
      event_type: eventType,
      metadata:
        body.metadata && typeof body.metadata === "object" ? body.metadata : {},
    });

    if (insertError) {
      console.error("analytics collect insert:", insertError);
      return NextResponse.json({ ok: false, error: "Failed to record" }, { status: 500, headers });
    }

    return NextResponse.json({ ok: true }, { headers });
  } catch (e) {
    console.error("analytics collect:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500, headers });
  }
}
