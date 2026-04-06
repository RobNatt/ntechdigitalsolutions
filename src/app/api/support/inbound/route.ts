import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSupportInboxNotification } from "@/lib/email";

export const runtime = "nodejs";

const MAX_BODY = 512_000;

function safeEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

type InboundBody = {
  from: string;
  fromName?: string | null;
  to?: string | null;
  subject?: string | null;
  text?: string | null;
  html?: string | null;
  clientId?: string | null;
  companyId?: string | null;
  raw?: Record<string, unknown>;
};

/**
 * POST /api/support/inbound
 * Server-to-server: email provider / automation POSTs parsed mail here.
 * Header: Authorization: Bearer <SUPPORT_INBOUND_WEBHOOK_SECRET>
 */
export async function POST(request: Request) {
  const secret = process.env.SUPPORT_INBOUND_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "SUPPORT_INBOUND_WEBHOOK_SECRET is not configured." },
      { status: 500 }
    );
  }

  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!safeEqual(token, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: InboundBody;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
    body = JSON.parse(raw) as InboundBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const from = typeof body.from === "string" ? body.from.trim().toLowerCase() : "";
  if (!from || !isValidEmail(from)) {
    return NextResponse.json({ error: "Valid from email required" }, { status: 400 });
  }

  const fromName =
    typeof body.fromName === "string" && body.fromName.trim()
      ? body.fromName.trim().slice(0, 200)
      : null;
  const toEmail =
    typeof body.to === "string" && body.to.trim()
      ? body.to.trim().slice(0, 320)
      : "hello@ntechdigital.solutions";
  const subject =
    typeof body.subject === "string" ? body.subject.slice(0, 998) : "(no subject)";
  const bodyText =
    typeof body.text === "string" && body.text.length > 0
      ? body.text.slice(0, 100_000)
      : null;
  const bodyHtml =
    typeof body.html === "string" && body.html.length > 0
      ? body.html.slice(0, 200_000)
      : null;

  const admin = createAdminClient();

  let clientId: string | null =
    typeof body.clientId === "string" && body.clientId.trim() ? body.clientId.trim() : null;
  let companyId: string | null =
    typeof body.companyId === "string" && body.companyId.trim() ? body.companyId.trim() : null;

  if (!clientId) {
    const { data: match } = await admin
      .from("clients")
      .select("id, company_id")
      .ilike("email", from)
      .limit(1)
      .maybeSingle();
    if (match?.id) {
      clientId = match.id;
      companyId = companyId ?? match.company_id ?? null;
    }
  } else {
    const { data: c } = await admin
      .from("clients")
      .select("company_id")
      .eq("id", clientId)
      .maybeSingle();
    if (c?.company_id) companyId = companyId ?? c.company_id;
  }

  const rawPayload =
    body.raw && typeof body.raw === "object" ? body.raw : {};

  const { data: inserted, error } = await admin
    .from("support_inbound_messages")
    .insert({
      client_id: clientId,
      company_id: companyId,
      from_email: from,
      from_name: fromName,
      to_email: toEmail,
      subject,
      body_text: bodyText,
      body_html: bodyHtml,
      raw: rawPayload,
    })
    .select("id")
    .single();

  if (error || !inserted?.id) {
    console.error("support inbound insert:", error);
    return NextResponse.json({ error: "Failed to store message" }, { status: 500 });
  }

  try {
    await sendSupportInboxNotification({
      id: inserted.id,
      fromEmail: from,
      fromName,
      subject,
      preview: bodyText?.slice(0, 500) ?? "",
    });
  } catch (e) {
    console.error("support inbox notify:", e);
  }

  return NextResponse.json({ ok: true, id: inserted.id });
}
