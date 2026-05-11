import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isQualifiedRevenue,
  MONTHLY_REVENUE_OPTIONS,
  revenueLabel,
} from "@/constants/growth-system-offer";
import { recordInquirySubmit } from "@/lib/analytics/record-inquiry";
import {
  sendGrowthSystemUnqualifiedAutoReply,
  sendInquiryNotification,
} from "@/lib/email";

const intakeIps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

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

const ALLOWED_REVENUE = new Set<string>(MONTHLY_REVENUE_OPTIONS.map((o) => o.value));

/**
 * POST /api/growthsystem-intake — public qualifying form for `/growthsystem`.
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

    const name = String(body.name ?? "").trim();
    const businessName = String(body.businessName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const monthlyRevenue = String(body.monthlyRevenue ?? "").trim();
    const consent = body.consent === true;
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
    if (!businessName || businessName.length > 200) {
      return NextResponse.json({ error: "Please enter your business name." }, { status: 400 });
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
    if (!ALLOWED_REVENUE.has(monthlyRevenue)) {
      return NextResponse.json({ error: "Please select monthly revenue." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json(
        { error: "Please confirm we may contact you before submitting." },
        { status: 400 }
      );
    }

    consumeRateLimit(ip);

    const qualified = isQualifiedRevenue(monthlyRevenue);
    const companyId = process.env.DEFAULT_COMPANY_ID;
    const nowIso = new Date().toISOString();
    const fullName = name || email || phone || "Unknown Lead";
    const revenueDisplay = revenueLabel(monthlyRevenue);

    const details: Record<string, unknown> = {
      business_name: businessName,
      monthly_revenue: monthlyRevenue,
      monthly_revenue_label: revenueDisplay,
      growth_system_qualified: qualified,
      source_page: "/growthsystem",
      consent_marketing_contact: true,
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
        source: "growth_system_funnel",
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
          source: "growth_system_funnel",
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
          console.warn("Growth system lead insert attempt failed:", error.message);
        }
      }

      if (!leadId) {
        console.error("Growth system lead insert exhausted attempts:", lastErrorMessage);
        return NextResponse.json(
          { error: "Could not save your submission. Please try again." },
          { status: 500 }
        );
      }
    } catch (e) {
      console.error("Growth system Supabase error:", e);
      return NextResponse.json(
        { error: "Could not save your submission. Please try again." },
        { status: 500 }
      );
    }

    const message = [
      "Growth System funnel intake",
      "",
      `Business: ${businessName}`,
      `Monthly revenue (self-reported): ${revenueDisplay}`,
      `Qualified for instant booking link: ${qualified ? "yes" : "no"}`,
      "",
      "Submitted from: /growthsystem",
    ].join("\n");

    try {
      await sendInquiryNotification({
        id: leadId,
        name,
        email,
        company: businessName,
        phone,
        message,
        planInterest: "3 Step Scale System",
        budget: revenueDisplay,
        sourcePage: "/growthsystem",
      });
      if (!qualified) {
        await sendGrowthSystemUnqualifiedAutoReply({ name, email });
      }
    } catch (e) {
      console.error("Growth system email error:", e);
    }

    void recordInquirySubmit({
      companyId,
      path: "/growthsystem",
      sessionId,
      visitorId,
      metadata: {
        lead_id: leadId ?? null,
        funnel: "growth_system",
        monthly_revenue: monthlyRevenue,
        qualified,
      },
    });

    return NextResponse.json({ success: true, leadId: leadId ?? null, qualified });
  } catch (err) {
    console.error("Growth system intake error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
