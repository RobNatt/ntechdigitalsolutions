import { NextResponse } from "next/server";
import { RANKVAULT_MONTHLY_REVENUE_OPTIONS } from "@/constants/rankvault";
import { sendRankVaultLeadNotification } from "@/lib/email";
import { mirrorFunnelLeadToOsLeads } from "@/lib/os/mirror-funnel-lead";
import { createAdminClient } from "@/lib/supabase/admin";

const rankVaultIps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const SOURCE_PAGE = "/rankvault";
const MIN_FORM_FILL_MS = 1200;

const ALLOWED_REVENUE = new Set<string>(RANKVAULT_MONTHLY_REVENUE_OPTIONS);

function recentTimestamps(ip: string): number[] {
  const now = Date.now();
  const timestamps = rankVaultIps.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rankVaultIps.set(ip, recent);
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
  rankVaultIps.set(ip, recent);
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      const retryAfter = retryAfterSeconds(ip);
      return NextResponse.json(
        { error: "Too many submissions. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
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
    const industry = String(body.industry ?? "").trim();
    const monthlyRevenue = String(body.monthlyRevenue ?? "").trim();
    const message = String(body.message ?? "").trim();
    const website = String(body.website ?? "").trim();
    const startedAt = Number(body.startedAt ?? 0);

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json({ error: "Submission rejected. Please try again." }, { status: 400 });
    }

    if (!name || name.length > 200) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!email || !isValidEmail(email) || email.length > 320) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (!industry || industry.length > 120) {
      return NextResponse.json({ error: "Please select your industry." }, { status: 400 });
    }
    if (!ALLOWED_REVENUE.has(monthlyRevenue)) {
      return NextResponse.json({ error: "Please select monthly revenue." }, { status: 400 });
    }
    if (!message || message.length < 10 || message.length > 4000) {
      return NextResponse.json({ error: "Please add a short message (at least 10 characters)." }, { status: 400 });
    }
    if (businessName.length > 200) {
      return NextResponse.json({ error: "Business name is too long." }, { status: 400 });
    }

    consumeRateLimit(ip);

    const companyId = process.env.DEFAULT_COMPANY_ID;
    const nowIso = new Date().toISOString();
    const fullName = name || email || phone || "Unknown Lead";

    const details: Record<string, unknown> = {
      source_page: SOURCE_PAGE,
      funnel: "rankvault",
      industry,
      monthly_revenue: monthlyRevenue,
      message,
      business_name: businessName || null,
      crm_payload: {
        name,
        business_name: businessName || null,
        email,
        phone,
        industry,
        monthly_revenue: monthlyRevenue,
        message,
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
        source: "rankvault_landing",
        lead_type: "business_owner",
        name,
        full_name: fullName,
        email,
        phone,
        phone_number: phone,
        address: "N/A",
        details,
        stage: "submitted",
        stage_updated_at: nowIso,
        updated_at: nowIso,
      };

      const { data: inserted, error } = await supabase
        .from("leads")
        .insert(commonPayload)
        .select("id")
        .maybeSingle();

      if (error || !inserted?.id) {
        console.error("RankVault lead insert failed:", error?.message);
        return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
      }
      leadId = inserted.id;

      await mirrorFunnelLeadToOsLeads(supabase, {
        name,
        businessName,
        email,
        phone,
        source: "rankvault_landing",
        assignedUserId: owner?.id ?? null,
        temperature: "Warm",
        tags: ["Funnel", "RankVault"],
      });
    } catch (e) {
      console.error("RankVault lead save error:", e);
      return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
    }

    try {
      await sendRankVaultLeadNotification({
        name,
        businessName: businessName || null,
        email,
        phone,
        industry,
        monthlyRevenue,
        message,
        leadId: leadId || null,
      });
    } catch (e) {
      console.error("RankVault lead notification error:", e);
    }

    return NextResponse.json({ success: true, leadId: leadId ?? null });
  } catch (err) {
    console.error("RankVault lead error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
