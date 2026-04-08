export type ReviewKind = "weekly" | "monthly" | "quarterly";

export type ScheduledReviewWindow = {
  reviewKind: ReviewKind;
  periodStart: string;
  periodEnd: string;
  comparisonStart?: string;
  comparisonEnd?: string;
  label: string;
};

type TzParts = {
  year: number;
  month: number;
  day: number;
  weekdayMon0: number;
  ymd: string;
};

const WEEKDAY_MAP: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

function parseParts(now: Date, timeZone: string): TzParts {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .slice(0, 10);
  const [year, month, day] = ymd.split("-").map(Number);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(now);
  return {
    year,
    month,
    day,
    ymd,
    weekdayMon0: WEEKDAY_MAP[weekday] ?? 0,
  };
}

function addDays(ymd: string, n: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + n * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

function startOfMonth(y: number, m: number): string {
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-01`;
}

function nextMonthStart(y: number, m: number): string {
  if (m === 12) return startOfMonth(y + 1, 1);
  return startOfMonth(y, m + 1);
}

function quarterStartMonth(month: number): number {
  if (month <= 3) return 1;
  if (month <= 6) return 4;
  if (month <= 9) return 7;
  return 10;
}

export function getScheduledReviewsForDate(
  now: Date,
  timeZone: string
): ScheduledReviewWindow[] {
  const p = parseParts(now, timeZone);
  const isSunday = p.weekdayMon0 === 6;
  if (!isSunday) return [];

  const out: ScheduledReviewWindow[] = [];

  out.push({
    reviewKind: "weekly",
    periodStart: addDays(p.ymd, -7),
    periodEnd: p.ymd,
    label: "Previous 7 days",
  });

  const isFirstSundayOfMonth = p.day <= 7;
  if (isFirstSundayOfMonth) {
    const prevMonth = p.month === 1 ? 12 : p.month - 1;
    const prevMonthYear = p.month === 1 ? p.year - 1 : p.year;
    out.push({
      reviewKind: "monthly",
      periodStart: startOfMonth(prevMonthYear, prevMonth),
      periodEnd: startOfMonth(p.year, p.month),
      comparisonStart: addDays(p.ymd, -7),
      comparisonEnd: p.ymd,
      label: "Previous month + previous 7 days comparison",
    });

    const currentQuarterStart = quarterStartMonth(p.month);
    const isQuarterStartMonth = [1, 4, 7, 10].includes(currentQuarterStart) && p.month === currentQuarterStart;
    if (isQuarterStartMonth) {
      const prevQuarterEndMonth = currentQuarterStart === 1 ? 12 : currentQuarterStart - 1;
      const prevQuarterEndYear = currentQuarterStart === 1 ? p.year - 1 : p.year;
      const prevQuarterStartMonth = quarterStartMonth(prevQuarterEndMonth);
      const prevQuarterStartYear =
        prevQuarterEndMonth === 12 ? prevQuarterEndYear : prevQuarterEndYear;
      out.push({
        reviewKind: "quarterly",
        periodStart: startOfMonth(prevQuarterStartYear, prevQuarterStartMonth),
        periodEnd: startOfMonth(p.year, p.month),
        label: "Previous quarter review",
      });
    }
  }

  return out;
}

export function ymdToIsoStart(ymd: string): string {
  return `${ymd}T00:00:00.000Z`;
}

