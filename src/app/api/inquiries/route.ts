import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInquiryNotification } from "@/lib/email";

const inquiryIps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = inquiryIps.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  inquiryIps.set(ip, recent);
  return false;
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * POST /api/inquiries — marketing contact / pricing CTAs (JSON body).
 * Emails LEAD_NOTIFICATION_EMAIL via Resend and stores a lead row when possible.
 */
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

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const company = String(body.company || "").trim() || null;
    const phone = String(body.phone || "").trim() || null;
    const message = String(body.message || "").trim();
    const planInterest =
      typeof body.plan === "string" && body.plan.trim() ? body.plan.trim().slice(0, 80) : null;
    const sourcePage =
      typeof body.sourcePage === "string" && body.sourcePage.trim()
        ? body.sourcePage.trim().slice(0, 500)
        : null;

    if (!name || name.length > 200) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!email || !isValidEmail(email) || email.length > 320) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (message.length < 10 || message.length > 8000) {
      return NextResponse.json(
        { error: "Please enter a message (at least 10 characters)." },
        { status: 400 }
      );
    }
    if (phone && phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "If you include a phone number, use a valid one." }, { status: 400 });
    }
    if (company && company.length > 200) {
      return NextResponse.json({ error: "Company name is too long." }, { status: 400 });
    }

    const companyId = process.env.DEFAULT_COMPANY_ID;
    const nowIso = new Date().toISOString();
    const details: Record<string, unknown> = {
      message,
      ...(company ? { company } : {}),
      ...(planInterest ? { plan_interest: planInterest } : {}),
      ...(sourcePage ? { source_page: sourcePage } : {}),
    };

    let leadId: string | undefined;
    try {
      const supabase = createAdminClient();
      const insertPayload: Record<string, unknown> = {
        ...(companyId ? { company_id: companyId } : {}),
        source: "website_inquiry",
        lead_type: "inquiry",
        name,
        full_name: name,
        email,
        phone,
        phone_number: phone,
        address: null,
        details,
        stage: "submitted",
        stage_updated_at: nowIso,
        updated_at: nowIso,
      };

      const { data: inserted, error } = await supabase
        .from("leads")
        .insert(insertPayload)
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("Inquiry lead insert error:", error.message);
      } else if (inserted?.id) {
        leadId = inserted.id;
      }
    } catch (e) {
      console.error("Inquiry Supabase error:", e);
    }

    try {
      await sendInquiryNotification({
        id: leadId,
        name,
        email,
        company,
        phone,
        message,
        planInterest,
        sourcePage,
      });
    } catch (e) {
      console.error("Inquiry email error:", e);
      return NextResponse.json(
        {
          error: "We could not send your message right now. Please email us directly or try again shortly.",
          hint: e instanceof Error ? e.message : String(e),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, leadId: leadId ?? null });
  } catch (err) {
    console.error("Inquiries POST error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
