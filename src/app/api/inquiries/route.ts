import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendInquiryAutoReply,
  sendInquiryNotification,
  sendInquirySmsFollowUp,
} from "@/lib/email";
import { recordInquirySubmit } from "@/lib/analytics/record-inquiry";
import { scoreInquiryLead } from "@/lib/inquiries/lead-qualifier";

const inquiryIps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function recentTimestamps(ip: string): number[] {
  const now = Date.now();
  const timestamps = inquiryIps.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  inquiryIps.set(ip, recent);
  return recent;
}

function isRateLimited(ip: string): boolean {
  return recentTimestamps(ip).length >= RATE_LIMIT_MAX;
}

function retryAfterSeconds(ip: string): number {
  const recent = recentTimestamps(ip);
  if (recent.length === 0) return 1;
  const oldestMs = Math.min(...recent);
  const elapsed = Date.now() - oldestMs;
  const remaining = Math.ceil((RATE_LIMIT_WINDOW_MS - elapsed) / 1000);
  return Math.max(1, remaining);
}

function consumeRateLimit(ip: string): void {
  const recent = recentTimestamps(ip);
  recent.push(Date.now());
  inquiryIps.set(ip, recent);
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
      const retryAfter = retryAfterSeconds(ip);
      return NextResponse.json(
        {
          error: "Too many submissions. Please try again shortly.",
          retryAfterSeconds: retryAfter,
          hint: `Please wait about ${retryAfter}s before trying again.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
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
    const budget =
      typeof body.budget === "string" && body.budget.trim()
        ? body.budget.trim().slice(0, 120)
        : null;
    const sourcePage =
      typeof body.sourcePage === "string" && body.sourcePage.trim()
        ? body.sourcePage.trim().slice(0, 500)
        : null;
    const sessionId =
      typeof body.sessionId === "string" && body.sessionId.trim()
        ? body.sessionId.trim().slice(0, 128)
        : null;
    const visitorId =
      typeof body.visitorId === "string" && body.visitorId.trim()
        ? body.visitorId.trim().slice(0, 128)
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

    // Count only validated submissions to avoid punishing users for malformed retries.
    consumeRateLimit(ip);

    const companyId = process.env.DEFAULT_COMPANY_ID;
    const nowIso = new Date().toISOString();
    const fullName = name || email || phone || "Unknown Lead";
    const leadScore = scoreInquiryLead({
      phone,
      company,
      planInterest,
      budget,
      message,
      sourcePage,
    });
    const details: Record<string, unknown> = {
      message,
      ...(company ? { company } : {}),
      ...(planInterest ? { plan_interest: planInterest } : {}),
      ...(budget ? { budget_range: budget } : {}),
      ...(sourcePage ? { source_page: sourcePage } : {}),
      lead_score: leadScore.score,
      lead_temperature: leadScore.temperature,
    };

    let leadId: string | undefined;
    try {
      const supabase = createAdminClient();
      const { data: owner } = await supabase
        .from("profiles")
        .select("id, role")
        .in("role", ["ceo", "admin"])
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      const commonPayload: Record<string, unknown> = {
        ...(companyId ? { company_id: companyId } : {}),
        ...(owner?.id ? { user_id: owner.id } : {}),
        source: "website_inquiry",
        name,
        full_name: fullName,
        email,
        phone: phone || "",
        phone_number: phone || "",
        address: "N/A",
        details,
        stage: "submitted",
        stage_updated_at: nowIso,
        updated_at: nowIso,
      };

      const attempts: Record<string, unknown>[] = [
        { ...commonPayload, lead_type: "inquiry" },
        { ...commonPayload, lead_type: "homeowner" },
        {
          ...(companyId ? { company_id: companyId } : {}),
          source: "website_inquiry",
          lead_type: "homeowner",
          name,
          full_name: fullName,
          email,
          phone: phone || "",
          phone_number: phone || "",
          address: "N/A",
          details,
        },
      ];

      let lastErrorMessage = "Unknown lead insert error.";
      for (const insertPayload of attempts) {
        const { data: inserted, error } = await supabase
          .from("leads")
          .insert(insertPayload)
          .select("id")
          .maybeSingle();
        if (!error && inserted?.id) {
          leadId = inserted.id;
          break;
        }
        if (error) {
          lastErrorMessage = error.message;
          console.warn("Inquiry lead insert attempt failed:", error.message);
        }
      }

      if (!leadId) {
        console.error("Inquiry lead insert exhausted attempts:", lastErrorMessage);
        return NextResponse.json(
          { error: "Could not save your inquiry lead. Please try again." },
          { status: 500 }
        );
      }
    } catch (e) {
      console.error("Inquiry Supabase error:", e);
      return NextResponse.json(
        { error: "Could not save your inquiry lead. Please try again." },
        { status: 500 }
      );
    }
    if (!leadId) {
      return NextResponse.json(
        { error: "Could not save your inquiry lead. Please try again." },
        { status: 500 }
      );
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
        budget,
        sourcePage,
      });
      await sendInquiryAutoReply({
        name,
        email,
        sourcePage,
        planInterest,
      });
      if (phone) {
        await sendInquirySmsFollowUp({ name, phone });
      }
    } catch (e) {
      console.error("Inquiry email error:", e);
      // Do not block lead capture success on downstream email/SMS failures.
    }

    void recordInquirySubmit({
      companyId,
      path: sourcePage || "/contact",
      sessionId,
      visitorId,
      metadata: {
        lead_id: leadId ?? null,
        plan_interest: planInterest,
        budget_range: budget,
        lead_score: leadScore.score,
        lead_temperature: leadScore.temperature,
      },
    });

    return NextResponse.json({ success: true, leadId: leadId ?? null });
  } catch (err) {
    console.error("Inquiries POST error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
