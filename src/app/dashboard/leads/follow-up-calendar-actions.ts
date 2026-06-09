"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchOsLeadsList } from "@/lib/os/fetch-os-leads-list";
import { getZonedComponents, zonedDayKey } from "@/lib/os/follow-up-schedule";
import { getOsSession } from "@/lib/os/get-os-settings";
import { logOsActivity } from "@/lib/os/log-os-activity";
import {
  computeLeadsFollowUpBlock,
  countLeadsInScheduleBucket,
  dayBoundsUtc,
  isLeadsFollowUpBatchEvent,
  LEADS_FOLLOW_UP_EVENT_TYPE,
  LEADS_FOLLOW_UP_EVENT_TITLE_PREFIX,
  type LeadsFollowUpPeriod,
} from "@/lib/os/leads-follow-up-calendar";
import { formatYmdInTimeZone } from "@/lib/os/os-revenue-range";
import type { ActionResult } from "./actions";

export type LeadsFollowUpBlockSnapshot = {
  id: string;
  title: string;
  date_start: string;
  date_end: string;
  lead_count: number;
} | null;

export async function findLeadsFollowUpBlockForDay(
  supabase: Awaited<ReturnType<typeof createClient>>,
  timeZone: string,
  dayYmd: string
): Promise<LeadsFollowUpBlockSnapshot> {
  const bounds = dayBoundsUtc(dayYmd, timeZone);
  const { data, error } = await supabase
    .from("os_events")
    .select("id, title, date_start, date_end, event_type, related_lead_id")
    .eq("event_type", LEADS_FOLLOW_UP_EVENT_TYPE)
    .ilike("title", `${LEADS_FOLLOW_UP_EVENT_TITLE_PREFIX}%`)
    .gte("date_start", bounds.start)
    .lt("date_start", bounds.end)
    .order("date_start", { ascending: true })
    .limit(5);

  if (error || !data?.length) return null;

  const row = data.find((r) =>
    isLeadsFollowUpBatchEvent({
      title: String(r.title),
      event_type: String(r.event_type),
      related_lead_id: r.related_lead_id != null ? String(r.related_lead_id) : null,
    })
  );
  if (!row) return null;

  const match = String(row.title).match(/·\s*(\d+)\s+lead/);
  const lead_count = match ? Number(match[1]) : 0;

  return {
    id: String(row.id),
    title: String(row.title),
    date_start: String(row.date_start),
    date_end: String(row.date_end),
    lead_count: Number.isFinite(lead_count) ? lead_count : 0,
  };
}

export async function syncLeadsFollowUpBlockAction(payload: {
  period: LeadsFollowUpPeriod;
  dayYmd?: string;
}): Promise<ActionResult<LeadsFollowUpBlockSnapshot>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can sync follow-up blocks." };

  const timeZone = session.settings.timezone;
  const dayYmd = payload.dayYmd?.trim() || formatYmdInTimeZone(new Date(), timeZone);
  const supabase = await createClient();

  const leadsFetch = await fetchOsLeadsList(supabase);
  if (leadsFetch.error) return { ok: false, error: leadsFetch.error };

  const leadCount = countLeadsInScheduleBucket(leadsFetch.leads, "today", timeZone);
  const block = computeLeadsFollowUpBlock(leadCount, dayYmd, timeZone, payload.period);
  if (!block) {
    return { ok: false, error: "No leads scheduled for follow-up on that day." };
  }

  const existing = await findLeadsFollowUpBlockForDay(supabase, timeZone, dayYmd);

  if (existing?.id) {
    const { error } = await supabase
      .from("os_events")
      .update({
        title: block.title,
        date_start: block.date_start,
        date_end: block.date_end,
        status: "Confirmed",
      })
      .eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
    await logOsActivity(supabase, "os_event", existing.id, "updated", block.title);
    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard/leads");
    return {
      ok: true,
      data: {
        id: existing.id,
        title: block.title,
        date_start: block.date_start,
        date_end: block.date_end,
        lead_count: leadCount,
      },
    };
  }

  const { data, error } = await supabase
    .from("os_events")
    .insert({
      title: block.title,
      date_start: block.date_start,
      date_end: block.date_end,
      event_type: LEADS_FOLLOW_UP_EVENT_TYPE,
      status: "Confirmed",
      meeting_link: null,
      related_lead_id: null,
      related_client_id: null,
      created_by_user_id: session.userId,
    })
    .select("id")
    .single();

  if (error || !data?.id) return { ok: false, error: error?.message ?? "Could not create calendar block." };

  const id = String(data.id);
  await logOsActivity(supabase, "os_event", id, "created", block.title);
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard/leads");
  return {
    ok: true,
    data: {
      id,
      title: block.title,
      date_start: block.date_start,
      date_end: block.date_end,
      lead_count: leadCount,
    },
  };
}

/** Refresh duration on an existing today's block when lead count changes. */
export async function refreshLeadsFollowUpBlockIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  timeZone: string,
  leads: { status: string; next_follow_up_at: string | null; last_touch_at: string | null }[]
): Promise<void> {
  const dayYmd = formatYmdInTimeZone(new Date(), timeZone);
  const existing = await findLeadsFollowUpBlockForDay(supabase, timeZone, dayYmd);
  if (!existing) return;

  const leadCount = countLeadsInScheduleBucket(leads as import("@/lib/os/leads-types").OsLeadRow[], "today", timeZone);
  if (leadCount <= 0) return;

  const start = new Date(existing.date_start);
  const dayYmdForBlock = zonedDayKey(timeZone, start);
  const { hour } = getZonedComponents(start, timeZone);
  let period: LeadsFollowUpPeriod = "morning";
  if (hour >= 16) period = "evening";
  else if (hour >= 12) period = "afternoon";

  const block = computeLeadsFollowUpBlock(leadCount, dayYmdForBlock, timeZone, period);
  if (!block) return;

  await supabase
    .from("os_events")
    .update({
      title: block.title,
      date_start: block.date_start,
      date_end: block.date_end,
    })
    .eq("id", existing.id);
}
