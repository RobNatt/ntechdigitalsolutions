/** Default sales pipeline (replaces legacy Booked / Showed / Qualified). */
export const DEFAULT_LEAD_PIPELINE_STAGES = [
  "New",
  "Contacted",
  "Discovery Call",
  "Research",
  "Proposal Meeting",
  "Won",
  "Lost",
] as const;

export const TOUCH_CHANNELS = ["call", "email", "sms", "linkedin", "meeting", "other"] as const;
export type TouchChannel = (typeof TOUCH_CHANNELS)[number];

export const TOUCH_OUTCOMES = [
  "connected",
  "no_answer",
  "voicemail",
  "replied",
  "booked",
  "sent",
  "other",
] as const;

export const EVENT_MEETING_STATUSES = ["Confirmed", "Completed", "Missed"] as const;

/** Days until suggested next follow-up by temperature. */
export function followUpCadenceDays(temperature: string): number {
  const t = temperature.trim().toLowerCase();
  if (t === "hot") return 1;
  if (t === "warm") return 2;
  return 3;
}

export function addDaysIso(from: Date, days: number): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function defaultNextFollowUpAt(temperature: string, from: Date = new Date()): string {
  return addDaysIso(from, followUpCadenceDays(temperature));
}

export type StageChecklistItem = { key: string; label: string };

export const STAGE_CHECKLIST_TEMPLATES: Record<string, StageChecklistItem[]> = {
  "Discovery Call": [
    { key: "call_scheduled", label: "Discovery call scheduled" },
    { key: "call_completed", label: "Discovery call completed (notes saved)" },
  ],
  Research: [
    { key: "discovery_summary", label: "Discovery summary documented" },
    { key: "proposal_draft", label: "Proposal draft prepared" },
  ],
  "Proposal Meeting": [
    { key: "proposal_sent", label: "Proposal sent to lead" },
    { key: "proposal_meeting_scheduled", label: "Proposal meeting scheduled" },
  ],
};

export function touchChannelLabel(channel: string): string {
  const map: Record<string, string> = {
    call: "Call",
    email: "Email",
    sms: "Text",
    linkedin: "LinkedIn",
    meeting: "Meeting",
    other: "Other",
  };
  return map[channel] ?? channel;
}

export function formatFollowUpDue(iso: string | null | undefined): string {
  if (!iso) return "Not scheduled";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Not scheduled";
  const now = new Date();
  const dayMs = 86400000;
  const diff = Math.ceil((d.getTime() - now.getTime()) / dayMs);
  const when = d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  if (diff < 0) return `Overdue · was ${when}`;
  if (diff === 0) return `Due today · ${when}`;
  if (diff === 1) return `Due tomorrow · ${when}`;
  return `Due in ${diff} days · ${when}`;
}
