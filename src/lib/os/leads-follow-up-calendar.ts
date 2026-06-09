import {
  bucketLeadsForFollowUpSchedule,
  type FollowUpDayKey,
  getZonedComponents,
  isTerminalLeadStage,
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
export const DEFAULT_LEADS_FOLLOW_UP_START_TIME = "09:00";

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

export function parseTimeHHmm(value: string): { hour: number; minute: number } | null {
  const m = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function timeInputFromIso(iso: string, timeZone: string): string {
  const z = getZonedComponents(new Date(iso), timeZone);
  return `${String(z.hour).padStart(2, "0")}:${String(z.minute).padStart(2, "0")}`;
}

export function countLeadsInScheduleBucket(
  leads: OsLeadRow[],
  bucket: FollowUpDayKey,
  timeZone: string,
  now = new Date()
): number {
  return (bucketLeadsForFollowUpSchedule(leads, { timeZone, now }).get(bucket) ?? []).length;
}

/** Leads due on a specific calendar day (today bucket for today; direct date match for other days). */
export function countLeadsScheduledOnDay(
  leads: OsLeadRow[],
  dayYmd: string,
  timeZone: string,
  now = new Date()
): number {
  const todayKey = zonedDayKey(timeZone, now);
  if (dayYmd === todayKey) {
    return countLeadsInScheduleBucket(leads, "today", timeZone, now);
  }

  let count = 0;
  for (const lead of leads) {
    if (isTerminalLeadStage(lead.status)) continue;
    if (!lead.next_follow_up_at) continue;
    const due = new Date(lead.next_follow_up_at);
    if (Number.isNaN(due.getTime())) continue;
    if (zonedDayKey(timeZone, due) === dayYmd) count += 1;
  }
  return count;
}

export function computeLeadsFollowUpBlockAtTime(
  leadCount: number,
  dayYmd: string,
  timeZone: string,
  hour: number,
  minute: number
): { date_start: string; date_end: string; title: string } | null {
  if (leadCount <= 0) return null;

  const parts = dayYmd.split("-").map((x) => parseInt(x, 10));
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  if (!year || !month || !day) return null;

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
  const parsed = parseTimeHHmm(DEFAULT_LEADS_FOLLOW_UP_START_TIME)!;
  return zonedDateTimeToUtc(timeZone, year, month, day, parsed.hour, parsed.minute).toISOString();
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
