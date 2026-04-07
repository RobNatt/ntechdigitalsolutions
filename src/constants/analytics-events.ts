/**
 * First-party custom event names (stored in analytics_events.event_type).
 * Pageviews use `pageview`; inquiries use `inquiry_submit` (via /api/inquiries only).
 */
export const ANALYTICS_CUSTOM_EVENTS = {
  CTA_CLICK: "cta_click",
  PRICING_PLAN_CLICK: "pricing_plan_click",
  FORM_START: "form_start",
  CHAT_OPEN: "chat_open",
  CHAT_WELCOME_ACCEPT: "chat_welcome_accept",
  CHAT_WELCOME_DISMISS: "chat_welcome_dismiss",
} as const;

export type AnalyticsCustomEventName =
  (typeof ANALYTICS_CUSTOM_EVENTS)[keyof typeof ANALYTICS_CUSTOM_EVENTS];
