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

/** `YYYY-MM-DD` calendar day for an instant in org TZ. */
export function zonedDayKey(timeZone: string, date: Date): string {
  const z = getZonedComponents(date, timeZone);
  return `${z.year}-${String(z.month).padStart(2, "0")}-${String(z.day).padStart(2, "0")}`;
}

/** Add calendar days in org TZ (noon anchor avoids DST midnight edge cases). */
export function addZonedCalendarDays(timeZone: string, year: number, month: number, day: number, add: number) {
  const instant = zonedDateTimeToUtc(timeZone, year, month, day + add, 12, 0);
  return getZonedComponents(instant, timeZone);
}

export function formatZonedDayLabel(timeZone: string, year: number, month: number, day: number): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone,
  }).format(zonedDateTimeToUtc(timeZone, year, month, day, 12, 0));
}

function zonedDayKeyFromParts(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Start of a calendar day in org TZ (as UTC instant). */
export function startOfZonedDay(timeZone: string, year: number, month: number, day: number): Date {
  return zonedDateTimeToUtc(timeZone, year, month, day, 0, 0);
}

/** Follow-up due date is strictly before today's calendar day in org TZ. */
export function isFollowUpDueBeforeToday(
  nextFollowUpAt: string,
  timeZone: string,
  now = new Date()
): boolean {
  const due = new Date(nextFollowUpAt);
  if (Number.isNaN(due.getTime())) return false;
  return zonedDayKey(timeZone, due) < zonedDayKey(timeZone, now);
}

/** Move an incomplete past-day follow-up onto today (same clock time in org TZ). */
export function bumpedFollowUpToToday(original: Date, timeZone: string, now = new Date()): Date {
  const zNow = getZonedComponents(now, timeZone);
  const zOrig = getZonedComponents(original, timeZone);
  return zonedDateTimeToUtc(timeZone, zNow.year, zNow.month, zNow.day, zOrig.hour, zOrig.minute);
}

/** @deprecated Use bumpedFollowUpToToday — rolls only happen when a new calendar day starts. */
export function bumpedFollowUpToTomorrow(original: Date, timeZone: string, now = new Date()): Date {
  const zNow = getZonedComponents(now, timeZone);
  const zOrig = getZonedComponents(original, timeZone);
  const zNext = addZonedCalendarDays(timeZone, zNow.year, zNow.month, zNow.day, 1);
  return zonedDateTimeToUtc(timeZone, zNext.year, zNext.month, zNext.day, zOrig.hour, zOrig.minute);
}

export function buildFollowUpScheduleDays(timeZone = "UTC", now = new Date()): FollowUpScheduleDay[] {
  const z = getZonedComponents(now, timeZone);
  const zTomorrow = addZonedCalendarDays(timeZone, z.year, z.month, z.day, 1);
  const zDayAfter = addZonedCalendarDays(timeZone, z.year, z.month, z.day, 2);

  const today = startOfZonedDay(timeZone, z.year, z.month, z.day);
  const tomorrow = startOfZonedDay(timeZone, zTomorrow.year, zTomorrow.month, zTomorrow.day);
  const dayAfter = startOfZonedDay(timeZone, zDayAfter.year, zDayAfter.month, zDayAfter.day);

  return [
    {
      key: "today",
      label: `Today · ${formatZonedDayLabel(timeZone, z.year, z.month, z.day)}`,
      date: today,
    },
    {
      key: "tomorrow",
      label: `Tomorrow · ${formatZonedDayLabel(timeZone, zTomorrow.year, zTomorrow.month, zTomorrow.day)}`,
      date: tomorrow,
    },
    {
      key: "dayAfter",
      label: formatZonedDayLabel(timeZone, zDayAfter.year, zDayAfter.month, zDayAfter.day),
      date: dayAfter,
    },
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

/** Incomplete follow-up from a prior calendar day — roll onto today's schedule. */
export function shouldRollIncompleteFollowUp(
  nextFollowUpAt: string,
  lastTouchAt: string | null | undefined,
  timeZone: string,
  now = new Date()
): boolean {
  if (!isFollowUpIncomplete(nextFollowUpAt, lastTouchAt, now)) return false;
  return isFollowUpDueBeforeToday(nextFollowUpAt, timeZone, now);
}

/**
 * Bucket leads by the calendar day of next_follow_up_at (org TZ).
 * Due today stays on Today all day (even if the clock time passed). Past incomplete days roll into Today.
 */
export function bucketLeadsForFollowUpSchedule(
  leads: OsLeadRow[],
  options?: { now?: Date; timeZone?: string }
): Map<FollowUpDayKey, OsLeadRow[]> {
  const now = options?.now ?? new Date();
  const timeZone = options?.timeZone?.trim() || "UTC";

  const buckets = new Map<FollowUpDayKey, OsLeadRow[]>([
    ["today", []],
    ["tomorrow", []],
    ["dayAfter", []],
  ]);

  const z = getZonedComponents(now, timeZone);
  const zTomorrow = addZonedCalendarDays(timeZone, z.year, z.month, z.day, 1);
  const zDayAfter = addZonedCalendarDays(timeZone, z.year, z.month, z.day, 2);
  const zWindowEnd = addZonedCalendarDays(timeZone, z.year, z.month, z.day, 3);

  const todayKey = zonedDayKey(timeZone, now);
  const tomorrowKey = zonedDayKeyFromParts(zTomorrow.year, zTomorrow.month, zTomorrow.day);
  const dayAfterKey = zonedDayKeyFromParts(zDayAfter.year, zDayAfter.month, zDayAfter.day);
  const windowEndKey = zonedDayKeyFromParts(zWindowEnd.year, zWindowEnd.month, zWindowEnd.day);

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

    const dueKey = zonedDayKey(timeZone, at);
    let key: FollowUpDayKey | null = null;

    if (dueKey < todayKey) {
      key = "today";
    } else if (dueKey === todayKey) {
      key = "today";
    } else if (dueKey === tomorrowKey) {
      key = "tomorrow";
    } else if (dueKey === dayAfterKey) {
      key = "dayAfter";
    } else if (dueKey >= dayAfterKey && dueKey < windowEndKey) {
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
