import type { OsLeadRow } from "@/lib/os/leads-types";

export type FollowUpDayKey = "today" | "tomorrow" | "dayAfter";

export type FollowUpScheduleDay = {
  key: FollowUpDayKey;
  label: string;
  date: Date;
};

function getPart(parts: Intl.DateTimeFormatPart[], type: string): string {
  return parts.find((p) => p.type === type)?.value ?? "";
}

export function getZonedComponents(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  return {
    year: Number(getPart(parts, "year")),
    month: Number(getPart(parts, "month")),
    day: Number(getPart(parts, "day")),
    hour: Number(getPart(parts, "hour")),
    minute: Number(getPart(parts, "minute")),
  };
}

/** UTC instant for a wall-clock time in an IANA timezone. */
export function zonedDateTimeToUtc(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  let guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  for (let i = 0; i < 4; i++) {
    const z = getZonedComponents(guess, timeZone);
    const targetMinutes = hour * 60 + minute;
    const actualMinutes = z.hour * 60 + z.minute;
    const dayDiff =
      (Date.UTC(z.year, z.month - 1, z.day) - Date.UTC(year, month - 1, day)) / 86400000;
    const deltaMin = dayDiff * 1440 + (actualMinutes - targetMinutes);
    if (deltaMin === 0) break;
    guess = new Date(guess.getTime() - deltaMin * 60000);
  }
  return guess;
}

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

/** Default follow-up time for leads with no schedule: today 5pm org TZ (keeps them on today's list). */
export function todayDefaultFollowUpAt(timeZone: string, now = new Date()): Date {
  const z = getZonedComponents(now, timeZone);
  const endOfDayPrompt = zonedDateTimeToUtc(timeZone, z.year, z.month, z.day, 17, 0);
  if (endOfDayPrompt.getTime() > now.getTime()) return endOfDayPrompt;
  return now;
}

/** Next calendar day in org TZ at the original follow-up clock time. */
export function bumpedFollowUpToTomorrow(original: Date, timeZone: string, now = new Date()): Date {
  const zNow = getZonedComponents(now, timeZone);
  const zOrig = getZonedComponents(original, timeZone);
  const nextDayProbe = new Date(Date.UTC(zNow.year, zNow.month - 1, zNow.day + 1));
  const zNext = getZonedComponents(nextDayProbe, timeZone);
  return zonedDateTimeToUtc(timeZone, zNext.year, zNext.month, zNext.day, zOrig.hour, zOrig.minute);
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

/** Follow-up is past due and no outreach was logged on or after the due time. */
export function isFollowUpIncomplete(
  nextFollowUpAt: string | null | undefined,
  lastTouchAt: string | null | undefined,
  now = new Date()
): boolean {
  if (!nextFollowUpAt) return false;
  const due = new Date(nextFollowUpAt);
  if (Number.isNaN(due.getTime()) || due.getTime() >= now.getTime()) return false;
  if (!lastTouchAt) return true;
  const touch = new Date(lastTouchAt);
  if (Number.isNaN(touch.getTime())) return true;
  return touch.getTime() < due.getTime();
}

/**
 * Bucket leads into today / tomorrow / day-after columns.
 * Unscheduled active leads appear under today. Incomplete overdue follow-ups appear under tomorrow.
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
    if (isTerminalLeadStage(lead.status)) continue;

    if (!lead.next_follow_up_at) {
      buckets.get("today")!.push(lead);
      continue;
    }

    const at = new Date(lead.next_follow_up_at);
    if (Number.isNaN(at.getTime())) {
      buckets.get("today")!.push(lead);
      continue;
    }

    let key: FollowUpDayKey | null = null;

    if (isFollowUpIncomplete(lead.next_follow_up_at, lead.last_touch_at, now)) {
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
