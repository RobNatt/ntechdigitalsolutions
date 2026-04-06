import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendLeadNotification } from "@/lib/email";

/** GET /api/leads/submit — health check (env + Supabase connection) */
export async function GET() {
  const ok = { supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY };
  if (!ok.supabaseUrl || !ok.serviceRoleKey) {
    return NextResponse.json({ ok: false, error: "Missing env vars", ...ok }, { status: 500 });
  }
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("leads").select("id").limit(1).maybeSingle();
    if (error) {
      return NextResponse.json({ ok: false, error: "Supabase error", hint: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, message: "Supabase connected, leads table accessible" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: "Connection failed", hint: msg }, { status: 500 });
  }
}

// Simple rate limit: max 5 submissions per IP per minute (in-memory, resets on cold start)
const submittedIps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = submittedIps.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  submittedIps.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();
    const leadType = String(body.leadType || "").trim();

    if (!name || !phone || !address || !leadType) {
      return NextResponse.json(
        { error: "Name, phone, address, and lead type are required." },
        { status: 400 }
      );
    }

    if (phone.length < 10) {
      return NextResponse.json({ error: "Valid phone number required." }, { status: 400 });
    }

    const rawSource = String(body.source || "unknown").trim().slice(0, 64);
    const validSource = rawSource.length > 0 ? rawSource : "unknown";

    const details: Record<string, unknown> = {};
    const skipKeys = ["name", "phone", "address", "leadType", "source", "verificationCode", "email"];
    for (const [k, v] of Object.entries(body)) {
      if (skipKeys.includes(k) || v === undefined) continue;
      try {
        details[k] = typeof v === "object" && v !== null ? JSON.parse(JSON.stringify(v)) : v;
      } catch {
        details[k] = String(v);
      }
    }

    let supabase;
    try {
      supabase = createAdminClient();
    } catch (e) {
      console.error("Supabase client error (check SUPABASE_SERVICE_ROLE_KEY):", e);
      return NextResponse.json(
        { error: "Service configuration error. Please try again later." },
        { status: 500 }
      );
    }

    const emailVal = body.email;
    const email = typeof emailVal === "string" ? emailVal.trim() || null : null;

    // Include company_id only when DEFAULT_COMPANY_ID is set (after 006). Otherwise omit — requires 007 (nullable).
    const companyId = process.env.DEFAULT_COMPANY_ID;
    const nowIso = new Date().toISOString();

    const insertPayload: Record<string, unknown> = {
      ...(companyId && { company_id: companyId }),
      stage: "submitted",
      stage_updated_at: nowIso,
      source: validSource,
      lead_type: leadType,
      name,
      full_name: name,
      phone,
      phone_number: phone,
      address,
      email,
      details,
    };

    const { data: inserted, error } = await supabase
      .from("leads")
      .insert(insertPayload)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Leads insert error:", error.message, error.details, error.hint);
      return NextResponse.json(
        {
          error: "Failed to save lead. Please try again.",
          hint: error.message,
        },
        { status: 500 }
      );
    }

    // Important: await so the serverless function reliably performs the outgoing Resend request
    // (otherwise the runtime may return before the async fetch finishes).
    try {
      await sendLeadNotification({
        id: inserted?.id,
        name,
        phone,
        address,
        leadType,
        source: validSource,
        details,
      });
    } catch (e) {
      console.error("Email notification failed:", e);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Leads submit error:", message, err);
    return NextResponse.json(
      { error: "Failed to process submission. Please try again.", hint: message },
      { status: 500 }
    );
  }
}
