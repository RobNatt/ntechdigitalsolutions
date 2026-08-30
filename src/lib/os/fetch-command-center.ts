import { NTECH_COMPANY_ID } from "@/constants/analytics";
import { findLeadsFollowUpBlockForDay } from "@/app/dashboard/leads/follow-up-calendar-actions";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CommandCenterGoalsConfig, CommandCenterSnapshot } from "@/lib/os/command-center-types";
import { DEFAULT_OS_SETTINGS } from "@/lib/os/default-settings";
import { fetchOsLeadsList } from "@/lib/os/fetch-os-leads-list";
import {
  bucketLeadsForFollowUpSchedule,
  isFollowUpIncomplete,
  isTerminalLeadStage,
} from "@/lib/os/follow-up-schedule";
import { formatOsCurrency } from "@/lib/os/format-os-currency";
import type { OsSession } from "@/lib/os/get-os-settings";
import { mapOsEventRow } from "@/lib/os/os-entity-types";
import {
  currentWallYmdParts,
  formatYmdInTimeZone,
  getMonthRangeYmd,
  getYearRangeYmd,
} from "@/lib/os/os-revenue-range";
import type { OsLeadRow } from "@/lib/os/leads-types";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_GOALS: CommandCenterGoalsConfig = {
  short_term: [
    { key: "leads_new_month", label: "New leads this month", target: 15, metric: "leads_new_month" },
    { key: "leads_won_month", label: "Deals won this month", target: 3, metric: "leads_won_month" },
    {
      key: "revenue_month",
      label: "Revenue this month",
      target: 15000,
      metric: "revenue_month",
      unit: "currency",
    },
    { key: "followups_today", label: "Follow-ups completed today", target: 8, metric: "followups_done_today" },
  ],
  long_term: [
    {
      key: "revenue_year",
      label: "Revenue this year",
      target: 180000,
      metric: "revenue_year",
      unit: "currency",
    },
    { key: "active_clients", label: "Active clients", target: 25, metric: "clients_count" },
    { key: "pipeline_active", label: "Active pipeline leads", target: 40, metric: "leads_active" },
    { key: "monthly_visitors", label: "Monthly unique visitors", target: 500, metric: "visitors_30d" },
  ],
};

function goalsFromSettings(): CommandCenterGoalsConfig {
  return DEFAULT_GOALS;
}

function parseAnalyticsRows<T>(arr: unknown, map: (x: Record<string, unknown>) => T): T[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => map(x as Record<string, unknown>));
}

function countLeadsNewSince(leads: OsLeadRow[], sinceIso: string): number {
  const t = new Date(sinceIso).getTime();
  return leads.filter((l) => l.created_at && new Date(l.created_at).getTime() >= t).length;
}

function countLeadsWonSince(leads: OsLeadRow[], sinceIso: string): number {
  const t = new Date(sinceIso).getTime();
  return leads.filter((l) => {
    if (!isTerminalLeadStage(l.status) || l.status.toLowerCase() !== "won") return false;
    return l.updated_at && new Date(l.updated_at).getTime() >= t;
  }).length;
}

function countActivePipeline(leads: OsLeadRow[]): number {
  return leads.filter((l) => !isTerminalLeadStage(l.status)).length;
}

function countOverdueToday(leads: OsLeadRow[], now: Date): number {
  let n = 0;
  for (const l of leads) {
    if (isTerminalLeadStage(l.status) || !l.next_follow_up_at) continue;
    if (isFollowUpIncomplete(l.next_follow_up_at, l.last_touch_at, now)) n += 1;
  }
  return n;
}

function countFollowUpsDoneToday(leads: OsLeadRow[], todayYmd: string, timeZone: string): number {
  let n = 0;
  for (const l of leads) {
    if (!l.last_touch_at) continue;
    const touchDay = formatYmdInTimeZone(new Date(l.last_touch_at), timeZone);
    if (touchDay === todayYmd) n += 1;
  }
  return n;
}

export async function fetchCommandCenterSnapshot(
  supabase: SupabaseClient,
  session: OsSession
): Promise<CommandCenterSnapshot> {
  const { settings, isInternal } = session;
  const timeZone = settings.timezone;
  const now = new Date();
  const todayYmd = formatYmdInTimeZone(now, timeZone);
  const { y, m } = currentWallYmdParts(timeZone);
  const monthRange = getMonthRangeYmd(y, m);
  const yearRange = getYearRangeYmd(y);
  const daysInMonth = new Date(y, m, 0).getDate();
  const dayOfMonth = currentWallYmdParts(timeZone).d;

  const goalsConfig = goalsFromSettings();
  const leadStages =
    settings.enum_defaults?.lead_stages ?? DEFAULT_OS_SETTINGS.enum_defaults!.lead_stages;
  const uncontacted = settings.uncontacted_stage ?? "New";

  const leadsFetch = await fetchOsLeadsList(supabase, { limit: 1000 });
  const leads = leadsFetch.leads;

  const since7d = new Date(now);
  since7d.setDate(since7d.getDate() - 7);
  const since30d = new Date(now);
  since30d.setDate(since30d.getDate() - 30);
  const monthStartIso = `${monthRange.from}T00:00:00.000Z`;

  const prevMonth = m === 1 ? { y: y - 1, m: 12 } : { y, m: m - 1 };
  const prevMonthRange = getMonthRangeYmd(prevMonth.y, prevMonth.m);

  const [
    paymentsMonthRes,
    paymentsPrevRes,
    paymentsYearRes,
    clientsCountRes,
    projectsRes,
    eventsRes,
    activityRes,
    followUpBlock,
  ] = await Promise.all([
    supabase
      .from("os_payments")
      .select("amount")
      .gte("date", monthRange.from)
      .lte("date", monthRange.to),
    supabase
      .from("os_payments")
      .select("amount")
      .gte("date", prevMonthRange.from)
      .lte("date", prevMonthRange.to),
    supabase.from("os_payments").select("amount").gte("date", yearRange.from).lte("date", yearRange.to),
    supabase.from("os_clients").select("id", { count: "exact", head: true }),
    supabase.from("os_projects").select("status"),
    supabase
      .from("os_events")
      .select("*")
      .gte("date_start", `${todayYmd}T00:00:00.000Z`)
      .lte("date_start", `${todayYmd}T23:59:59.999Z`)
      .order("date_start", { ascending: true })
      .limit(20),
    isInternal
      ? supabase
          .from("os_activity_log")
          .select("id, action, message, created_at, entity_type")
          .order("created_at", { ascending: false })
          .limit(12)
      : Promise.resolve({ data: [], error: null }),
    isInternal
      ? findLeadsFollowUpBlockForDay(supabase, timeZone, todayYmd)
      : Promise.resolve(null),
  ]);

  const revenueMonth = (paymentsMonthRes.data ?? []).reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const revenuePrev = (paymentsPrevRes.data ?? []).reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const revenueYear = (paymentsYearRes.data ?? []).reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const clientsCount = clientsCountRes.count ?? 0;

  const projectStages = settings.enum_defaults?.project_stages ?? DEFAULT_OS_SETTINGS.enum_defaults!.project_stages;
  const projectByStage = new Map<string, number>();
  for (const s of projectStages) projectByStage.set(s, 0);
  for (const p of projectsRes.data ?? []) {
    const st = String((p as { status?: string }).status ?? projectStages[0]);
    projectByStage.set(st, (projectByStage.get(st) ?? 0) + 1);
  }

  const followUpByDay = bucketLeadsForFollowUpSchedule(leads, { timeZone, now });
  const todayCount = followUpByDay.get("today")?.length ?? 0;
  const tomorrowCount = followUpByDay.get("tomorrow")?.length ?? 0;
  const overdueCount = countOverdueToday(leads, now);
  const new7d = countLeadsNewSince(leads, since7d.toISOString());
  const newMonth = countLeadsNewSince(leads, monthStartIso);
  const wonMonth = countLeadsWonSince(leads, monthStartIso);
  const activePipeline = countActivePipeline(leads);
  const followupsDoneToday = countFollowUpsDoneToday(leads, todayYmd, timeZone);
  const uncontactedCount = leads.filter((l) => l.status === uncontacted).length;

  const pipeline: { stage: string; count: number }[] = [];
  const stageCounts = new Map<string, number>();
  for (const s of leadStages) stageCounts.set(s, 0);
  for (const l of leads) {
    const st = leadStages.includes(l.status) ? l.status : leadStages[0] ?? "New";
    stageCounts.set(st, (stageCounts.get(st) ?? 0) + 1);
  }
  for (const s of leadStages) {
    const c = stageCounts.get(s) ?? 0;
    if (c > 0) pipeline.push({ stage: s, count: c });
  }

  let traffic: CommandCenterSnapshot["traffic"] = {
    enabled: false,
    periodDays: 30,
    pageviews: 0,
    visitors: 0,
    sessions: 0,
    inquiries: 0,
    conversionRate: 0,
    topPaths: [],
    topReferrers: [],
    topUtmSources: [],
    customEvents: [],
    dailyPageviews: [],
    pageviewsPrevPeriod: 0,
  };

  if (isInternal && settings.enable_analytics) {
    try {
      const admin = createAdminClient();
      const until = new Date(`${todayYmd}T23:59:59.999Z`);
      const since30 = new Date(until);
      since30.setDate(since30.getDate() - 29);
      const sincePrev = new Date(since30);
      sincePrev.setDate(sincePrev.getDate() - 30);

      const [cur, prev] = await Promise.all([
        admin.rpc("analytics_get_summary", {
          p_company_id: NTECH_COMPANY_ID,
          p_since: since30.toISOString(),
          p_until: until.toISOString(),
        }),
        admin.rpc("analytics_get_summary", {
          p_company_id: NTECH_COMPANY_ID,
          p_since: sincePrev.toISOString(),
          p_until: since30.toISOString(),
        }),
      ]);

      const s = (cur.data as Record<string, unknown>) ?? {};
      const pv = Number(s.totalPageviews ?? 0);
      const inq = Number(s.inquirySubmissions ?? 0);
      traffic = {
        enabled: true,
        periodDays: 30,
        pageviews: pv,
        visitors: Number(s.uniqueVisitors ?? 0),
        sessions: Number(s.uniqueSessions ?? 0),
        inquiries: inq,
        conversionRate: pv > 0 ? Number(((inq / pv) * 100).toFixed(1)) : 0,
        topPaths: parseAnalyticsRows(s.topPaths, (x) => ({
          path: String(x.path ?? "/"),
          count: Number(x.count ?? 0),
        })),
        topReferrers: parseAnalyticsRows(s.topReferrers, (x) => ({
          referrer: String(x.referrer ?? "(direct)"),
          count: Number(x.count ?? 0),
        })),
        topUtmSources: parseAnalyticsRows(s.topUtmSources, (x) => ({
          source: String(x.source ?? "(none)"),
          count: Number(x.count ?? 0),
        })),
        customEvents: parseAnalyticsRows(s.customEventCounts, (x) => ({
          eventType: String(x.eventType ?? ""),
          count: Number(x.count ?? 0),
        })),
        dailyPageviews: parseAnalyticsRows(s.dailyPageviews, (x) => ({
          day: String(x.day ?? ""),
          count: Number(x.count ?? 0),
        })),
        pageviewsPrevPeriod: Number((prev.data as Record<string, unknown>)?.totalPageviews ?? 0),
      };
    } catch {
      traffic.enabled = false;
    }
  }

  const metricValues: Record<string, number> = {
    leads_new_month: newMonth,
    leads_won_month: wonMonth,
    revenue_month: revenueMonth,
    followups_done_today: followupsDoneToday,
    revenue_year: revenueYear,
    clients_count: clientsCount,
    leads_active: activePipeline,
    visitors_30d: traffic.visitors,
  };

  function goalProgress(def: (typeof goalsConfig.short_term)[0]) {
    const current = metricValues[def.metric] ?? 0;
    const progress = def.target > 0 ? Math.min(100, Math.round((current / def.target) * 100)) : 0;
    return { ...def, current, progress };
  }

  const revenueDelta =
    revenuePrev > 0 ? Math.round(((revenueMonth - revenuePrev) / revenuePrev) * 100) : null;

  const kpis: CommandCenterSnapshot["kpis"] = [
    {
      key: "revenue",
      label: "Revenue (MTD)",
      value: formatOsCurrency(revenueMonth, settings.currency),
      delta: revenueDelta != null ? `${revenueDelta >= 0 ? "+" : ""}${revenueDelta}% vs last month` : undefined,
      deltaUp: revenueDelta != null ? revenueDelta >= 0 : undefined,
      href: "/dashboard/revenue",
    },
    {
      key: "leads_today",
      label: "Follow-ups today",
      value: String(todayCount),
      hint: overdueCount > 0 ? `${overdueCount} overdue` : undefined,
      href: "/dashboard/leads",
    },
    {
      key: "pipeline",
      label: "Active pipeline",
      value: String(activePipeline),
      href: "/dashboard/leads",
    },
    {
      key: "new7",
      label: "New leads (7d)",
      value: String(new7d),
      href: "/dashboard/leads",
    },
    {
      key: "won",
      label: "Won (month)",
      value: String(wonMonth),
      href: "/dashboard/leads",
    },
    {
      key: "clients",
      label: "Clients",
      value: String(clientsCount),
      href: "/dashboard/clients",
    },
    {
      key: "projects",
      label: "Projects",
      value: String((projectsRes.data ?? []).length),
      href: "/dashboard/projects",
    },
  ];

  if (traffic.enabled) {
    kpis.push({
      key: "traffic",
      label: "Visitors (30d)",
      value: String(traffic.visitors),
      delta:
        traffic.pageviewsPrevPeriod > 0
          ? `${Math.round(((traffic.pageviews - traffic.pageviewsPrevPeriod) / traffic.pageviewsPrevPeriod) * 100) >= 0 ? "+" : ""}${Math.round(((traffic.pageviews - traffic.pageviewsPrevPeriod) / traffic.pageviewsPrevPeriod) * 100)}% pageviews`
          : undefined,
      href: "/dashboard/analytics",
    });
  }

  const todayActions: CommandCenterSnapshot["todayActions"] = [];
  if (todayCount > 0) {
    todayActions.push({
      label: "Run lead follow-ups",
      detail: `${todayCount} lead${todayCount === 1 ? "" : "s"} on today's schedule`,
      href: "/dashboard/leads",
      urgent: overdueCount > 0,
    });
  }
  if (followUpBlock) {
    todayActions.push({
      label: "Leads follow-up block",
      detail: followUpBlock.title,
      href: "/dashboard/calendar",
    });
  }
  const meetings = (eventsRes.data ?? []).map((r) => mapOsEventRow(r as Record<string, unknown>));
  if (meetings.length > 0) {
    todayActions.push({
      label: "Meetings today",
      detail: `${meetings.length} on calendar`,
      href: "/dashboard/calendar",
    });
  }
  if (uncontactedCount > 0) {
    todayActions.push({
      label: `Contact new leads`,
      detail: `${uncontactedCount} in ${uncontacted}`,
      href: "/dashboard/leads",
    });
  }
  if (tomorrowCount > 0) {
    todayActions.push({
      label: "Prep tomorrow",
      detail: `${tomorrowCount} follow-ups scheduled`,
      href: "/dashboard/leads",
    });
  }
  if (todayActions.length === 0) {
    todayActions.push({
      label: "Review pipeline",
      detail: "No urgent items — stay ahead on leads and delivery",
      href: "/dashboard/leads",
    });
  }

  let healthLabel: CommandCenterSnapshot["healthLabel"] = "Strong";
  let healthSummary = "Core metrics look healthy. Keep today's follow-up rhythm.";
  if (overdueCount >= 3 || (dayOfMonth > daysInMonth / 2 && revenueMonth < revenuePrev * 0.5)) {
    healthLabel = "Needs attention";
    healthSummary =
      overdueCount >= 3
        ? `${overdueCount} overdue follow-ups — clear today's queue first.`
        : "Revenue is trailing last month mid-cycle — focus pipeline and collections.";
  } else if (overdueCount > 0 || uncontactedCount > 5) {
    healthLabel = "Steady";
    healthSummary = "On track with a few items to clear: follow-ups or uncontacted leads.";
  }

  const todayMeetings = meetings.map((ev) => ({
    title: ev.title || "Event",
    time: new Date(ev.date_start).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    }),
    href: "/dashboard/calendar",
  }));

  return {
    todayYmd,
    timeZone,
    brandColor: settings.brand_color,
    currency: settings.currency,
    isInternal,
    healthLabel,
    healthSummary,
    todayActions,
    kpis,
    shortTermGoals: goalsConfig.short_term.map(goalProgress),
    longTermGoals: goalsConfig.long_term.map(goalProgress),
    traffic,
    pipeline,
    projectStages: projectStages.map((stage) => ({
      stage,
      count: projectByStage.get(stage) ?? 0,
    })),
    followUpBlock: followUpBlock
      ? {
          title: followUpBlock.title,
          date_start: followUpBlock.date_start,
          date_end: followUpBlock.date_end,
        }
      : null,
    todayMeetings,
    recentActivity: (activityRes.data ?? []).map((r) => ({
      id: String(r.id),
      action: String(r.action),
      message: r.message != null ? String(r.message) : null,
      created_at: String(r.created_at),
      entity_type: String(r.entity_type),
    })),
  };
}
