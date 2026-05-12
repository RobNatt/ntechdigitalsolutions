/** Build a minimal RFC 5545 iCalendar document for dashboard events. */

export type IcsEventInput = {
  id: string;
  title: string;
  date_start: string;
  date_end: string;
  meeting_link?: string | null;
};

function toIcsUtc(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/i, "Z");
  }
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/i, "Z");
}

function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function buildDashboardEventsIcs(events: IcsEventInput[]): string {
  const stamp = toIcsUtc(new Date().toISOString());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AgencyOS//Dashboard Export//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const e of events) {
    const desc = e.meeting_link ? `Meeting: ${e.meeting_link}` : "";
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@dashboard-export`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toIcsUtc(e.date_start)}`,
      `DTEND:${toIcsUtc(e.date_end)}`,
      `SUMMARY:${escapeText((e.title || "Event").slice(0, 200))}`,
      desc ? `DESCRIPTION:${escapeText(desc.slice(0, 1000))}` : "DESCRIPTION:",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
