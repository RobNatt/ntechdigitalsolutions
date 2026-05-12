import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_OS_SETTINGS } from "@/lib/os/default-settings";
import type { OsProfileRow, OsSettingsRow } from "@/lib/os/types";

export type OsSession = {
  userId: string;
  email: string | null;
  displayName: string;
  /** Internal team (admin) vs portal client */
  isInternal: boolean;
  profile: OsProfileRow | null;
  settings: OsSettingsRow;
};

function mapSettingsRow(row: Record<string, unknown> | null): OsSettingsRow {
  if (!row) {
    return { ...DEFAULT_OS_SETTINGS, enum_defaults: DEFAULT_OS_SETTINGS.enum_defaults };
  }
  return {
    id: String(row.id ?? DEFAULT_OS_SETTINGS.id),
    os_name: String(row.os_name ?? DEFAULT_OS_SETTINGS.os_name),
    brand_color: String(row.brand_color ?? DEFAULT_OS_SETTINGS.brand_color),
    currency: String(row.currency ?? DEFAULT_OS_SETTINGS.currency),
    timezone: String(row.timezone ?? DEFAULT_OS_SETTINGS.timezone),
    enable_content_engine: Boolean(row.enable_content_engine ?? true),
    enable_analytics: Boolean(row.enable_analytics ?? true),
    enable_sops: Boolean(row.enable_sops ?? true),
    uncontacted_stage: String(row.uncontacted_stage ?? "New"),
    enum_defaults: (() => {
      const d = DEFAULT_OS_SETTINGS.enum_defaults!;
      const raw =
        row.enum_defaults && typeof row.enum_defaults === "object"
          ? (row.enum_defaults as Record<string, unknown>)
          : {};
      const merged: Record<string, string[]> = {};
      for (const key of Object.keys(d)) {
        const v = raw[key];
        merged[key] = Array.isArray(v) ? v.map((x) => String(x)) : [...d[key as keyof typeof d]!];
      }
      for (const key of Object.keys(raw)) {
        if (!(key in merged)) {
          const v = raw[key];
          if (Array.isArray(v)) merged[key] = v.map((x) => String(x));
        }
      }
      if (!Array.isArray(merged.common_tags)) merged.common_tags = [];
      return merged;
    })(),
    created_at: row.created_at != null ? String(row.created_at) : undefined,
    updated_at: row.updated_at != null ? String(row.updated_at) : undefined,
  };
}

/** Cached per request — safe to call from layout + pages. */
export const getOsSession = cache(async (): Promise<OsSession | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, os_role, os_client_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.warn("profiles fetch (os columns may be missing until migration):", profileError.message);
  }

  const profile: OsProfileRow | null =
    !profileError && profileRow
      ? {
          id: String(profileRow.id),
          email: profileRow.email != null ? String(profileRow.email) : null,
          full_name: profileRow.full_name != null ? String(profileRow.full_name) : null,
          role: profileRow.role != null ? String(profileRow.role) : null,
          os_role:
            profileRow.os_role === "client"
              ? "client"
              : profileRow.os_role === "admin"
                ? "admin"
                : null,
          os_client_id: profileRow.os_client_id != null ? String(profileRow.os_client_id) : null,
        }
      : null;

  const isInternal = profile?.os_role !== "client";

  const { data: settingsRow, error } = await supabase.from("os_settings").select("*").limit(1).maybeSingle();

  if (error) {
    console.warn("os_settings fetch:", error.message);
  }

  const settings = mapSettingsRow(settingsRow as Record<string, unknown> | null);

  const displayName =
    profile?.full_name?.trim() ||
    profile?.email?.trim() ||
    user.email ||
    "User";

  return {
    userId: user.id,
    email: user.email ?? null,
    displayName,
    isInternal,
    profile,
    settings,
  };
});

export const getOsSettingsCached = cache(async () => {
  const session = await getOsSession();
  return session?.settings ?? { ...DEFAULT_OS_SETTINGS, enum_defaults: DEFAULT_OS_SETTINGS.enum_defaults };
});
