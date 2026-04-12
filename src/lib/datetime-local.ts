/**
 * datetime-local values are wall time in the user's zone. If the server parses the raw
 * "YYYY-MM-DDTHH:mm" string, Node/Vercel (UTC) treats that as UTC and shifts the clock
 * (e.g. 9am Eastern becomes 9am Z → shows as 4am local). Always convert in the browser
 * and send UTC ISO to the API.
 */

/** Convert <input type="datetime-local"> value to UTC ISO for POST/PATCH bodies. */
export function datetimeLocalInputToIsoUtc(localValue: string): string | null {
  const trimmed = localValue.trim();
  if (!trimmed) return null;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

/** Fill datetime-local from a timestamptz ISO string returned by the API. */
export function isoUtcToDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
