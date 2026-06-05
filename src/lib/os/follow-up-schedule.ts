import type { OsLeadRow } from "@/lib/os/leads-types";

export type FollowUpDayKey = "today" | "tomorrow" | "dayAfter";

export type FollowUpScheduleDay = {
  key: FollowUpDayKey;
  label: string;
  date: Date;
};

export function startOfLocalDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

export function addLocalDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Tomorrow at the same local clock time as the original follow-up. */
export function bumpedFollowUpToTomorrow(original: Date, now = new Date()): Date {
  const tomorrow = startOfLocalDay(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(original.getHours(), original.getMinutes(), 0, 0);
  return tomorrow;
}

export function buildFollowUpScheduleDays(now = new Date()): FollowUpScheduleDay[] {
  const today = startOfLocalDay(now);
  const tomorrow = addLocalDays(today, 1);
  const dayAfter = addLocalDays(today, 2);

  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

  return [
    { key: "today", label: `Today · ${fmt(today)}`, date: today },
    { key: "tomorrow", label: `Tomorrow · ${fmt(tomorrow)}`, date: tomorrow },
    { key: "dayAfter", label: fmt(dayAfter), date: dayAfter },
  ];
}

const TERMINAL_STAGES = new Set(["won", "lost"]);

export function isTerminalLeadStage(status: string): boolean {
  return TERMINAL_STAGES.has(status.trim().toLowerCase());
}

/**
 * Bucket leads with a follow-up into today / tomorrow / day-after columns.
 * Missed (overdue) follow-ups appear under tomorrow for the schedule view.
 */
export function bucketLeadsForFollowUpSchedule(
  leads: OsLeadRow[],
  now = new Date()
): Map<FollowUpDayKey, OsLeadRow[]> {
  const buckets = new Map<FollowUpDayKey, OsLeadRow[]>([
    ["today", []],
    ["tomorrow", []],
    ["dayAfter", []],
  ]);

  const todayStart = startOfLocalDay(now);
  const tomorrowStart = addLocalDays(todayStart, 1);
  const dayAfterStart = addLocalDays(todayStart, 2);
  const windowEnd = addLocalDays(todayStart, 3);

  for (const lead of leads) {
    if (!lead.next_follow_up_at || isTerminalLeadStage(lead.status)) continue;

    const at = new Date(lead.next_follow_up_at);
    if (Number.isNaN(at.getTime())) continue;

    let key: FollowUpDayKey | null = null;

    if (at.getTime() < now.getTime()) {
      key = "tomorrow";
    } else if (at >= todayStart && at < tomorrowStart) {
      key = "today";
    } else if (at >= tomorrowStart && at < dayAfterStart) {
      key = "tomorrow";
    } else if (at >= dayAfterStart && at < windowEnd) {
      key = "dayAfter";
    }

    if (key) buckets.get(key)!.push(lead);
  }

  for (const list of buckets.values()) {
    list.sort((a, b) => {
      const ta = a.next_follow_up_at ? new Date(a.next_follow_up_at).getTime() : 0;
      const tb = b.next_follow_up_at ? new Date(b.next_follow_up_at).getTime() : 0;
      return ta - tb;
    });
  }

  return buckets;
}

/** True when follow-up was scheduled for today and is now overdue. */
export function isMissedFollowUpToday(nextFollowUpAt: string, now = new Date()): boolean {
  const at = new Date(nextFollowUpAt);
  if (Number.isNaN(at.getTime())) return false;
  return isSameLocalDay(at, now) && at.getTime() < now.getTime();
}
