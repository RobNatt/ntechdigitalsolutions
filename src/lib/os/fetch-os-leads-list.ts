import type { SupabaseClient } from "@supabase/supabase-js";
import { mapOsLeadRow } from "@/lib/os/map-os-lead";
import type { OsLeadRow } from "@/lib/os/leads-types";

const LEAD_LIST_COLUMNS_FULL =
  "id, lead_name, business_name, email, phone, source, status, temperature, tags, assigned_user_id, linked_client_id, next_follow_up_at, last_touch_at, linkedin_url, pipeline_notes, created_at, updated_at";

const LEAD_LIST_COLUMNS_LEGACY =
  "id, lead_name, business_name, email, phone, source, status, temperature, tags, assigned_user_id, linked_client_id, created_at, updated_at";

export type FetchOsLeadsListResult = {
  leads: OsLeadRow[];
  error: string | null;
  usedLegacyColumns: boolean;
};

export function isMissingSchemaError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    (m.includes("column") || m.includes("relation") || m.includes("table")) &&
    (m.includes("does not exist") || m.includes("could not find") || m.includes("unknown") || m.includes("schema cache"))
  );
}

export async function fetchOsLeadsList(
  supabase: SupabaseClient,
  options?: { limit?: number }
): Promise<FetchOsLeadsListResult> {
  const limit = options?.limit ?? 500;

  const run = async (columns: string) => {
    return supabase
      .from("os_leads")
      .select(columns)
      .order("created_at", { ascending: false })
      .limit(limit);
  };

  const full = await run(LEAD_LIST_COLUMNS_FULL);
  if (!full.error) {
    return {
      leads: (full.data ?? []).map((r) => mapOsLeadRow(r as unknown as Record<string, unknown>)),
      error: null,
      usedLegacyColumns: false,
    };
  }

  if (isMissingSchemaError(full.error.message)) {
    const legacy = await run(LEAD_LIST_COLUMNS_LEGACY);
    if (!legacy.error) {
      return {
        leads: (legacy.data ?? []).map((r) => mapOsLeadRow(r as unknown as Record<string, unknown>)),
        error: null,
        usedLegacyColumns: true,
      };
    }
    return { leads: [], error: legacy.error.message, usedLegacyColumns: true };
  }

  return { leads: [], error: full.error.message, usedLegacyColumns: false };
}

/** Pipeline columns from settings plus any status values still on leads (e.g. after partial migration). */
export function mergeLeadPipelineStages(settingsStages: string[], leads: OsLeadRow[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const s of settingsStages) {
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  const extras = new Set<string>();
  for (const l of leads) {
    const st = l.status?.trim();
    if (st && !seen.has(st)) extras.add(st);
  }
  return [...out, ...Array.from(extras).sort()];
}
