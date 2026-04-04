import { type RecurrenceType, isRecurrenceType } from "@/lib/calendar/eventTypes";

export type { RecurrenceType };

export type CalendarEventRow = Record<string, unknown> & {
  id: string;
  date: string;
};

export type ExpandedCalendarEvent = CalendarEventRow & {
  occurrence_date: string;
  series_start_date: string;
  instance_id: string;
  recurrence: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** YYYY-MM-DD lexicographic compare: -1 | 0 | 1 */
export function compareYMD(a: string, b: string): number {
  const as = a.slice(0, 10);
  const bs = b.slice(0, 10);
  if (as < bs) return -1;
  if (as > bs) return 1;
  return 0;
}

function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yy = dt.getUTCFullYear();
  const mm = dt.getUTCMonth() + 1;
  const dd = dt.getUTCDate();
  return `${yy}-${pad2(mm)}-${pad2(dd)}`;
}

function addMonths(ymd: string, delta: number): string {
  const [y, m, d] = ymd.slice(0, 10).split("-").map(Number);
  let nm = m - 1 + delta;
  const ny = y + Math.floor(nm / 12);
  nm = ((nm % 12) + 12) % 12;
  const dim = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
  const dd = Math.min(d, dim);
  return `${ny}-${pad2(nm + 1)}-${pad2(dd)}`;
}

function stepRecurrence(current: string, recurrence: RecurrenceType): string {
  switch (recurrence) {
    case "daily":
      return addDays(current, 1);
    case "weekly":
      return addDays(current, 7);
    case "monthly":
      return addMonths(current, 1);
    case "yearly":
      return addMonths(current, 12);
    default:
      return current;
  }
}

export function computeRemindAtIso(
  dateStr: string,
  hour: number,
  startMinutes: number,
  alertMinutes: number
): string | null {
  const start = new Date(
    `${dateStr.slice(0, 10)}T${pad2(hour)}:${pad2(startMinutes)}:00`
  );
  if (Number.isNaN(start.getTime())) return null;
  return new Date(start.getTime() - alertMinutes * 60_000).toISOString();
}

function normalizeRecurrence(v: unknown): RecurrenceType {
  const s = typeof v === "string" ? v : "none";
  return isRecurrenceType(s) ? s : "none";
}

function materializeInstance(
  row: CalendarEventRow,
  occurrenceDate: string,
  seriesStart: string
): ExpandedCalendarEvent {
  const recurrence = normalizeRecurrence(row.recurrence);
  const hour = Number(row.hour ?? 0);
  const sm = Number(row.start_minutes ?? 0);
  const instance_id = `${row.id}::${occurrenceDate}`;

  let remindAt: string | null = null;
  const mins = row.reminder_minutes_before;
  if (typeof mins === "number" && mins >= 0) {
    remindAt = computeRemindAtIso(occurrenceDate, hour, sm, mins);
  } else if (occurrenceDate === seriesStart.slice(0, 10) && typeof row.remind_at === "string") {
    remindAt = row.remind_at;
  }

  const notificationSent =
    recurrence !== "none" ? null : (row.notification_sent_at as string | null | undefined) ?? null;

  return {
    ...row,
    date: occurrenceDate,
    occurrence_date: occurrenceDate,
    series_start_date: seriesStart.slice(0, 10),
    instance_id,
    recurrence,
    remind_at: remindAt,
    notification_sent_at: notificationSent,
  } as ExpandedCalendarEvent;
}

/**
 * Expands stored rows into display rows for [rangeFrom, rangeTo] inclusive.
 */
export function expandCalendarEventsForRange(
  rows: CalendarEventRow[],
  rangeFrom: string,
  rangeTo: string
): ExpandedCalendarEvent[] {
  const from = rangeFrom.slice(0, 10);
  const to = rangeTo.slice(0, 10);
  const out: ExpandedCalendarEvent[] = [];

  for (const row of rows) {
    const recurrence = normalizeRecurrence(row.recurrence);
    const anchor = String(row.date).slice(0, 10);

    if (recurrence === "none") {
      if (compareYMD(anchor, from) >= 0 && compareYMD(anchor, to) <= 0) {
        out.push(materializeInstance(row, anchor, anchor));
      }
      continue;
    }

    const untilRaw = row.recurrence_until;
    const until =
      typeof untilRaw === "string" && untilRaw
        ? untilRaw.slice(0, 10)
        : "2099-12-31";
    const cap = compareYMD(until, to) <= 0 ? until : to;

    if (compareYMD(anchor, cap) > 0) continue;

    let cursor = anchor;
    let guard = 0;
    while (compareYMD(cursor, from) < 0 && compareYMD(cursor, cap) <= 0 && guard < 400) {
      const next = stepRecurrence(cursor, recurrence);
      if (compareYMD(next, cursor) <= 0) break;
      cursor = next;
      guard++;
    }

    guard = 0;
    while (compareYMD(cursor, cap) <= 0 && guard < 400) {
      if (compareYMD(cursor, from) >= 0 && compareYMD(cursor, to) <= 0) {
        out.push(materializeInstance(row, cursor, anchor));
      }
      const next = stepRecurrence(cursor, recurrence);
      if (compareYMD(next, cursor) <= 0) break;
      cursor = next;
      guard++;
    }
  }

  out.sort((a, b) => {
    const c = compareYMD(a.date as string, b.date as string);
    if (c !== 0) return c;
    const ah = Number(a.hour ?? 0) * 60 + Number(a.start_minutes ?? 0);
    const bh = Number(b.hour ?? 0) * 60 + Number(b.start_minutes ?? 0);
    return ah - bh;
  });

  return out;
}
