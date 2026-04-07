import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { NTECH_COMPANY_ID } from "@/constants/analytics";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type LeadLite = {
  id: string;
  name: string | null;
  stage: string | null;
  lead_temperature: string | null;
  created_at: string | null;
  updated_at: string | null;
  stage_updated_at: string | null;
};

function hoursSince(iso: string | null | undefined): number {
  if (!iso) return Number.POSITIVE_INFINITY;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
  return (Date.now() - t) / 3_600_000;
}

function maxIso(...values: Array<string | null | undefined>): string | null {
  const valid = values
    .map((v) => (v ? new Date(v).getTime() : Number.NaN))
    .filter((n) => Number.isFinite(n));
  if (valid.length === 0) return null;
  return new Date(Math.max(...valid)).toISOString();
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildTrafficMilestones(summary: Record<string, unknown>) {
  const totalPageviews = Number(summary.totalPageviews ?? 0);
  const inquiries = Number(summary.inquirySubmissions ?? 0);
  const uniqueVisitors = Number(summary.uniqueVisitors ?? 0);
  const conversion = totalPageviews > 0 ? (inquiries / totalPageviews) * 100 : 0;
  const thresholds = [100, 250, 500, 1000, 2500, 5000, 10000];

  const highestPv = [...thresholds].reverse().find((n) => totalPageviews >= n) ?? 0;
  const nextPv = thresholds.find((n) => totalPageviews < n) ?? null;
  const highestVisitors = [...thresholds].reverse().find((n) => uniqueVisitors >= n) ?? 0;
  const nextVisitors = thresholds.find((n) => uniqueVisitors < n) ?? null;

  return {
    totalPageviews,
    inquiries,
    uniqueVisitors,
    conversionRate: Number(conversion.toFixed(2)),
    reached: {
      pageviews: highestPv,
      visitors: highestVisitors,
    },
    next: {
      pageviews: nextPv,
      visitors: nextVisitors,
    },
  };
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const now = new Date();
    const today = dayKey(now);
    const yesterdayDate = new Date(now);
    yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
    const yesterday = dayKey(yesterdayDate);
    const tomorrowDate = new Date(now);
    tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
    const tomorrow = dayKey(tomorrowDate);

    const [{ data: leadsData, error: leadsError }, { data: calData, error: calError }] =
      await Promise.all([
        admin
          .from("leads")
          .select(
            "id,name,stage,lead_temperature,created_at,updated_at,stage_updated_at"
          )
          .order("created_at", { ascending: false })
          .limit(300),
        admin
          .from("calendar_events")
          .select("id,title,date,event_type")
          .gte("date", today)
          .lte("date", tomorrow),
      ]);

    if (leadsError) {
      return NextResponse.json({ error: "Failed to load leads context." }, { status: 500 });
    }
    if (calError) {
      return NextResponse.json({ error: "Failed to load calendar context." }, { status: 500 });
    }

    const leads = (leadsData ?? []) as LeadLite[];
    const openLeads = leads.filter(
      (l) => l.stage !== "closed_won" && l.stage !== "closed_lost"
    );

    const staleLeads = openLeads
      .map((lead) => {
        const touchedAt = maxIso(lead.updated_at, lead.stage_updated_at, lead.created_at);
        return { ...lead, touchedAt, untouchedHours: hoursSince(touchedAt) };
      })
      .filter((lead) => {
        const temp = (lead.lead_temperature ?? "warm").toLowerCase();
        if (temp === "hot") return lead.untouchedHours >= 24;
        return lead.untouchedHours >= 48;
      })
      .sort((a, b) => b.untouchedHours - a.untouchedHours)
      .slice(0, 7);

    const newUncontacted = openLeads.filter((lead) => {
      const createdH = hoursSince(lead.created_at);
      const touchedAt = maxIso(lead.updated_at, lead.stage_updated_at);
      const touchedH = hoursSince(touchedAt);
      return (lead.stage ?? "submitted") === "submitted" && createdH >= 24 && touchedH >= 24;
    });

    const leadsCreatedYesterday = leads.filter((lead) =>
      String(lead.created_at ?? "").startsWith(yesterday)
    ).length;
    const leadsCreatedToday = leads.filter((lead) =>
      String(lead.created_at ?? "").startsWith(today)
    ).length;

    const stageCounts = openLeads.reduce<Record<string, number>>((acc, lead) => {
      const key = lead.stage ?? "submitted";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    const upcomingFollowUps = (calData ?? []).filter((e) =>
      ["lead_follow_up", "client_follow_up"].includes(String((e as { event_type?: string }).event_type ?? ""))
    ).length;

    const { data: analyticsSummary, error: analyticsError } = await admin.rpc(
      "analytics_get_summary",
      {
        p_company_id: NTECH_COMPANY_ID,
        p_since: new Date(Date.now() - 7 * 24 * 3_600_000).toISOString(),
      }
    );
    if (analyticsError) {
      return NextResponse.json({ error: "Failed to load analytics context." }, { status: 500 });
    }

    const traffic = buildTrafficMilestones(
      (analyticsSummary as Record<string, unknown> | null) ?? {}
    );

    const snapshot = {
      generatedAt: now.toISOString(),
      day: { today, yesterday, tomorrow },
      leads: {
        openCount: openLeads.length,
        createdToday: leadsCreatedToday,
        createdYesterday: leadsCreatedYesterday,
        stageCounts,
        staleCount: staleLeads.length,
        staleLeads: staleLeads.map((l) => ({
          id: l.id,
          name: l.name ?? "Unknown",
          stage: l.stage ?? "submitted",
          temperature: l.lead_temperature ?? "warm",
          untouchedHours: Math.round(l.untouchedHours),
        })),
        uncontactedOver24h: newUncontacted.length,
      },
      calendar: {
        followUpsNext48h: upcomingFollowUps,
      },
      traffic,
    };

    const hashPayload = JSON.stringify({
      day: snapshot.day,
      leads: snapshot.leads,
      calendar: snapshot.calendar,
      traffic: snapshot.traffic,
    });
    const hash = createHash("sha256").update(hashPayload).digest("hex").slice(0, 16);

    return NextResponse.json({ hash, snapshot });
  } catch (err) {
    console.error("dashboard assistant context:", err);
    return NextResponse.json({ error: "Failed to load assistant context." }, { status: 500 });
  }
}
