import type { OsSettingsRow } from "@/lib/os/types";

export const OS_SETTINGS_SINGLETON_ID = "00000000-0000-4000-8000-000000000001";

export const DEFAULT_OS_SETTINGS: Omit<OsSettingsRow, "id"> & { id: string } = {
  id: OS_SETTINGS_SINGLETON_ID,
  os_name: "Operating System",
  brand_color: "#2563eb",
  currency: "AUD",
  timezone: "Australia/Sydney",
  enable_content_engine: true,
  enable_analytics: true,
  enable_sops: true,
  uncontacted_stage: "New",
  enum_defaults: {
    lead_stages: ["New", "Contacted", "Booked", "Showed", "Qualified"],
    project_stages: ["Onboarding", "Development", "In Review", "Live"],
    lead_temperatures: ["Cold", "Warm", "Hot"],
    /** Preset tag labels for quick selection on leads (Settings-managed). */
    common_tags: [] as string[],
    event_types: ["Call", "Meeting", "Follow-up", "Content"],
    event_status: ["Confirmed", "Completed", "Missed"],
    payment_methods: ["Bank Transfer", "Card", "Cash", "Other"],
    sales_outcomes: ["Closed", "No Show", "Showed No Close", "Rescheduled"],
  },
  integration_sheets_enabled: false,
  integration_calendly_enabled: false,
  integration_google_calendar_enabled: false,
  integration_webhook_secret: null,
  integration_sheets_column_map: {},
  integration_calendly_booked_stage: "Booked",
  integration_google_calendar_id: null,
  integration_google_oauth_connected: false,
};
