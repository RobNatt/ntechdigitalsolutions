/** Row shape for `public.os_settings` (singleton). */
export type OsSettingsRow = {
  id: string;
  os_name: string;
  brand_color: string;
  currency: string;
  timezone: string;
  enable_content_engine: boolean;
  enable_analytics: boolean;
  enable_sops: boolean;
  /** Stage value counted as "uncontacted" for KPI (default New). */
  uncontacted_stage: string;
  enum_defaults: Record<string, string[]> | null;
  created_at?: string;
  updated_at?: string;
  /** Optional inbound/outbound integrations (safe defaults when unset). */
  integration_sheets_enabled: boolean;
  integration_calendly_enabled: boolean;
  integration_google_calendar_enabled: boolean;
  /** Shared secret for X-Webhook-Token on webhook routes. */
  integration_webhook_secret: string | null;
  /** Maps lead field keys to Google Sheet column header names. */
  integration_sheets_column_map: Record<string, string> | null;
  /** Lead pipeline stage applied when a Calendly booking is synced. */
  integration_calendly_booked_stage: string;
  /** Target Google Calendar ID (placeholder until OAuth). */
  integration_google_calendar_id: string | null;
  integration_google_oauth_connected: boolean;
};

export type OsProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  os_role: "admin" | "client" | null;
  os_client_id: string | null;
};
