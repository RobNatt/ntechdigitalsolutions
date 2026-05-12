/** YYYY-MM-DD in IANA time zone (via Intl). */
export function formatYmdInTimeZone(isoOrDate: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(isoOrDate);
}

export function daysInGregorianMonth(year: number, month1to12: number): number {
  return new Date(year, month1to12, 0).getDate();
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function getMonthRangeYmd(year: number, month1to12: number): { from: string; to: string } {
  const from = `${year}-${pad2(month1to12)}-01`;
  const last = daysInGregorianMonth(year, month1to12);
  const to = `${year}-${pad2(month1to12)}-${pad2(last)}`;
  return { from, to };
}

export function getYearRangeYmd(year: number): { from: string; to: string } {
  return { from: `${year}-01-01`, to: `${year}-12-31` };
}

export function currentWallYmdParts(timeZone: string): { y: number; m: number; d: number } {
  const s = formatYmdInTimeZone(new Date(), timeZone);
  const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
  return { y, m, d };
}
