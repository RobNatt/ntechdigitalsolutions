/** Default company row from migration 006 — N-Tech Digital Solutions */
export const NTECH_COMPANY_ID = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

/** Must match AnalyticsTracker — used by contact form to tie submissions to the same visit */
export const ANALYTICS_STORAGE_KEYS = {
  visitorId: "ntech_vid",
  sessionId: "ntech_sid",
} as const;
