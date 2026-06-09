import {
  bucketLeadsForFollowUpSchedule,
  type FollowUpDayKey,
  getZonedComponents,
  startOfZonedDay,
  zonedDateTimeToUtc,
  zonedDayKey,
} from "@/lib/os/follow-up-schedule";
import { defaultNextFollowUpAt } from "@/lib/os/lead-workflow";
import type { OsLeadRow } from "@/lib/os/leads-types";
import type { OsEventRow } from "@/lib/os/os-entity-types";

export const LEADS_FOLLOW_UP_EVENT_TITLE_PREFIX = "Leads follow-up";
export const LEADS_FOLLOW_UP_EVENT_TYPE = "Follow-up";
export const LEADS_FOLLOW_UP_MINUTES_PER_LEAD = 10;

export type LeadsFollowUpPeriod = "morning" | "afternoon" | "evening";

export const LEADS_FOLLOW_UP_PERIOD_START: Record<LeadsFollowUpPeriod, { hour: number; minute: number; label: string }> = {
  morning: { hour: 9, minute: 0, label: "Morning · 9:00 AM" },
  afternoon: { hour: 13, minute: 0, label: "Afternoon · 1:00 PM" },
  evening: { hour: 17, minute: 0, label: "Late afternoon · 5:00 PM" },
};

export function leadsFollowUpBlockTitle(leadCount: number): string {
  return `${LEADS_FOLLOW_UP_EVENT_TITLE_PREFIX} · ${leadCount} lead${leadCount === 1 ? "" : "s"}`;
}

export function isLeadsFollowUpBatchEvent(ev: Pick<OsEventRow, "title" | "event_type" | "related_lead_id">): boolean {
  return (
    ev.event_type === LEADS_FOLLOW_UP_EVENT_TYPE &&
    ev.title.startsWith(LEADS_FOLLOW_UP_EVENT_TITLE_PREFIX) &&
    !ev.related_lead_id
  );
}

export function countLeadsInScheduleBucket(
  leads: OsLeadRow[],
  bucket: FollowUpDayKey,
  timeZone: string,
  now = new Date()
): number {
  return (bucketLeadsForFollowUpSchedule(leads, { timeZone, now }).get(bucket) ?? []).length;
}

export function computeLeadsFollowUpBlock(
  leadCount: number,
  dayYmd: string,
  timeZone: string,
  period: LeadsFollowUpPeriod
): { date_start: string; date_end: string; title: string } | null {
  if (leadCount <= 0) return null;

  const parts = dayYmd.split("-").map((x) => parseInt(x, 10));
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  if (!year || !month || !day) return null;

  const { hour, minute } = LEADS_FOLLOW_UP_PERIOD_START[period];
  const start = zonedDateTimeToUtc(timeZone, year, month, day, hour, minute);
  const end = new Date(start.getTime() + leadCount * LEADS_FOLLOW_UP_MINUTES_PER_LEAD * 60_000);

  return {
    date_start: start.toISOString(),
    date_end: end.toISOString(),
    title: leadsFollowUpBlockTitle(leadCount),
  };
}

/** Default next follow-up instant for a chosen calendar day (morning queue). */
export function followUpAtFromDateOnly(dayYmd: string, timeZone: string): string {
  const parts = dayYmd.split("-").map((x) => parseInt(x, 10));
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  return zonedDateTimeToUtc(timeZone, year, month, day, 9, 0).toISOString();
}

export function defaultNextFollowUpDateValue(
  temperature: string,
  timeZone: string,
  from = new Date()
): string {
  return zonedDayKey(timeZone, new Date(defaultNextFollowUpAt(temperature, from)));
}

export function dayBoundsUtc(dayYmd: string, timeZone: string): { start: string; end: string } {
  const parts = dayYmd.split("-").map((x) => parseInt(x, 10));
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const start = startOfZonedDay(timeZone, year, month, day);
  const z = getZonedComponents(start, timeZone);
  const next = zonedDateTimeToUtc(timeZone, z.year, z.month, z.day + 1, 0, 0);
  return { start: start.toISOString(), end: next.toISOString() };
}

export function eventOnCalendarDay(ev: Pick<OsEventRow, "date_start">, dayYmd: string, timeZone: string): boolean {
  return zonedDayKey(timeZone, new Date(ev.date_start)) === dayYmd;
}
