export const CALENDAR_EVENT_TYPES = [
  "lead_call",
  "client_onboarding",
  "client_follow_up",
  "other",
] as const;

export type CalendarEventType = (typeof CALENDAR_EVENT_TYPES)[number];

export function isCalendarEventType(s: string): s is CalendarEventType {
  return (CALENDAR_EVENT_TYPES as readonly string[]).includes(s);
}

export const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  lead_call: "Lead call",
  client_onboarding: "Client onboarding",
  client_follow_up: "Client follow-up",
  other: "Other",
};

export const ALERT_MINUTES_OPTIONS = [
  { value: -1, label: "No alert" },
  { value: 0, label: "At start time" },
  { value: 5, label: "5 min before" },
  { value: 15, label: "15 min before" },
  { value: 30, label: "30 min before" },
  { value: 60, label: "1 hour before" },
] as const;
