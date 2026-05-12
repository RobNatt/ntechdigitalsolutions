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
  enum_defaults: {
    lead_stages: ["New", "Contacted", "Booked", "Showed", "Qualified"],
    project_stages: ["Onboarding", "Development", "In Review", "Live"],
    lead_temperatures: ["Cold", "Warm", "Hot"],
    event_types: ["Call", "Meeting", "Follow-up", "Content"],
    event_status: ["Confirmed", "Completed", "Missed"],
    payment_methods: ["Bank Transfer", "Card", "Cash", "Other"],
    sales_outcomes: ["Closed", "No Show", "Showed No Close", "Rescheduled"],
  },
};
