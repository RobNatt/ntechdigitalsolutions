import { NextResponse } from "next/server";
import {
  STRATEGY_MONTHLY_REVENUE_OPTIONS,
  isStrategySessionQualified,
  strategyMonthlyRevenueLabel,
} from "@/constants/strategy-call-offer";
import { GROWTH_SYSTEM_CALENDLY_EVENT_URL } from "@/constants/growth-system-offer";
import { recordInquirySubmit } from "@/lib/analytics/record-inquiry";
import { buildCalendlyPrefillUrl } from "@/lib/growth-system/build-calendly-prefill-url";
import { sendInquiryNotification } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

const intakeIps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const SOURCE_PAGE = "/strategy-call";

const ALLOWED_REVENUE = new Set<string>(STRATEGY_MONTHLY_REVENUE_OPTIONS.map((o) => o.value));

function recentTimestamps(ip: string): number[] {
  const now = Date.now();
  const timestamps = intakeIps.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  intakeIps.set(ip, recent);
  return recent;
}

function isRateLimited(ip: string): boolean {
  return recentTimestamps(ip).length >= RATE_LIMIT_MAX;
}

function retryAfterSeconds(ip: string): number {
  const recent = recentTimestamps(ip);
  if (recent.length === 0) return 1;
  const oldestMs = Math.min(...recent);
  const remaining = Math.ceil((RATE_LIMIT_WINDOW_MS - (Date.now() - oldestMs)) / 1000);
  return Math.max(1, remaining);
}

function consumeRateLimit(ip: string): void {
  const recent = recentTimestamps(ip);
  recent.push(Date.now());
  intakeIps.set(ip, recent);
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * POST /api/strategy-qualification — homepage strategy-call prequalification.
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

    const name = String(body.fullName ?? body.name ?? "").trim();
    const businessName = String(body.businessName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const monthlyRevenue = String(body.monthlyRevenue ?? "").trim();
    const sessionId =
      typeof body.sessionId === "string" && body.sessionId.trim()
        ? body.sessionId.trim().slice(0, 128)
        : null;
    const visitorId =
      typeof body.visitorId === "string" && body.visitorId.trim()
        ? body.visitorId.trim().slice(0, 128)
        : null;

    if (!name || name.length > 200) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!email || !isValidEmail(email) || email.length > 320) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number (at least 10 digits)." },
        { status: 400 }
      );
    }
    if (businessName.length > 200) {
      return NextResponse.json({ error: "Business name is too long." }, { status: 400 });
    }
    if (!ALLOWED_REVENUE.has(monthlyRevenue)) {
      return NextResponse.json({ error: "Please select monthly revenue." }, { status: 400 });
    }

    consumeRateLimit(ip);

    const qualified = isStrategySessionQualified(monthlyRevenue);
    const companyId = process.env.DEFAULT_COMPANY_ID;
    const nowIso = new Date().toISOString();
    const fullName = name || email || phone || "Unknown Lead";
    const revenueDisplay = strategyMonthlyRevenueLabel(monthlyRevenue);

    const details: Record<string, unknown> = {
      business_name: businessName || null,
      monthly_revenue: monthlyRevenue,
      monthly_revenue_label: revenueDisplay,
      strategy_call_qualified: qualified,
      source_page: SOURCE_PAGE,
      funnel: "strategy_call",
      /** CRM-ready snapshot of the full intake payload */
      crm_payload: {
        full_name: name,
        email,
        phone,
        business_name: businessName || null,
        monthly_revenue: monthlyRevenue,
        monthly_revenue_label: revenueDisplay,
        qualified,
        submitted_at: nowIso,
      },
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
        source: "strategy_call_funnel",
        name,
        full_name: fullName,
        email,
        phone,
        phone_number: phone,
        address: "N/A",
        details,
        stage: qualified ? "qualified" : "submitted",
        stage_updated_at: nowIso,
        updated_at: nowIso,
      };

      const attempts: Record<string, unknown>[] = [
        { ...commonPayload, lead_type: "business_owner" },
        { ...commonPayload, lead_type: "inquiry" },
        {
          ...(companyId ? { company_id: companyId } : {}),
          source: "strategy_call_funnel",
          lead_type: "business_owner",
          name,
          full_name: fullName,
          email,
          phone,
          phone_number: phone,
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
          console.warn("Strategy qualification lead insert attempt failed:", error.message);
        }
      }

      if (!leadId) {
        console.error("Strategy qualification lead insert exhausted attempts:", lastErrorMessage);
        return NextResponse.json(
          { error: "Could not save your submission. Please try again." },
          { status: 500 }
        );
      }
    } catch (e) {
      console.error("Strategy qualification Supabase error:", e);
      return NextResponse.json(
        { error: "Could not save your submission. Please try again." },
        { status: 500 }
      );
    }

    const message = [
      "Strategy call qualification funnel",
      "",
      `Name: ${name}`,
      businessName ? `Business: ${businessName}` : "Business: (not provided)",
      `Monthly revenue (self-reported): ${revenueDisplay}`,
      `Qualified for instant scheduler: ${qualified ? "yes" : "no"}`,
      "",
      `Submitted from: ${SOURCE_PAGE}`,
    ].join("\n");

    try {
      await sendInquiryNotification({
        id: leadId,
        name,
        email,
        company: businessName || null,
        phone,
        message,
        planInterest: "Strategy session",
        budget: revenueDisplay,
        sourcePage: SOURCE_PAGE,
      });
    } catch (e) {
      console.error("Strategy qualification email error:", e);
    }

    void recordInquirySubmit({
      companyId,
      path: SOURCE_PAGE,
      sessionId,
      visitorId,
      metadata: {
        lead_id: leadId ?? null,
        funnel: "strategy_call",
        monthly_revenue: monthlyRevenue,
        qualified,
      },
    });

    const calendlyUrl = qualified
      ? buildCalendlyPrefillUrl({
          fullName: name,
          email,
          baseUrl: GROWTH_SYSTEM_CALENDLY_EVENT_URL,
        })
      : undefined;

    return NextResponse.json({
      success: true,
      leadId: leadId ?? null,
      qualified,
      calendlyUrl: calendlyUrl ?? null,
    });
  } catch (err) {
    console.error("Strategy qualification error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
