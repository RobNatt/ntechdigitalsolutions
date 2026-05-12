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
  enum_defaults: Record<string, string[]> | null;
  created_at?: string;
  updated_at?: string;
};

export type OsProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  os_role: "admin" | "client" | null;
  os_client_id: string | null;
};
