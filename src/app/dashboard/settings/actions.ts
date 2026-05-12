"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_OS_SETTINGS, OS_SETTINGS_SINGLETON_ID } from "@/lib/os/default-settings";
import { getOsSession } from "@/lib/os/get-os-settings";
import { logOsActivity } from "@/lib/os/log-os-activity";
import type { OsSettingsRow } from "@/lib/os/types";
import { isOsWorkspaceAdmin } from "@/lib/os/workspace-admin";

export type ActionResult<T = void> = { ok: true; data?: T } | { ok: false; error: string };

/** @deprecated Use granular save actions from the settings panel. */
export type UpdateOsSettingsState = { ok?: boolean; error?: string };

const SETTINGS_ID = OS_SETTINGS_SINGLETON_ID;

type Supabase = Awaited<ReturnType<typeof createClient>>;

function normalizeHex(c: string): string {
  const t = c.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(t)) return t;
  return "#2563eb";
}

function normalizeEnumDefaults(raw: OsSettingsRow["enum_defaults"]): Record<string, string[]> {
  const d = DEFAULT_OS_SETTINGS.enum_defaults!;
  const cur = raw ?? {};
  const out: Record<string, string[]> = {};
  for (const key of Object.keys(d)) {
    const v = cur[key];
    out[key] = Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [...d[key as keyof typeof d]!];
  }
  for (const key of Object.keys(cur)) {
    if (!(key in out)) {
      const v = cur[key];
      if (Array.isArray(v)) out[key] = v.map((x) => String(x).trim()).filter(Boolean);
    }
  }
  if (!out.common_tags) out.common_tags = [];
  return out;
}

async function logSetting(supabase: Supabase, message: string): Promise<void> {
  await logOsActivity(supabase, "os_settings", SETTINGS_ID, "settings_updated", message);
}

async function requireInternalSession(): Promise<
  { ok: true; session: NonNullable<Awaited<ReturnType<typeof getOsSession>>>; supabase: Supabase } | { ok: false; error: string }
> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can change workspace settings." };
  const supabase = await createClient();
  return { ok: true, session, supabase };
}

async function requireWorkspaceAdmin(): Promise<
  | { ok: true; session: NonNullable<Awaited<ReturnType<typeof getOsSession>>>; supabase: Supabase }
  | { ok: false; error: string }
> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!isOsWorkspaceAdmin(session)) return { ok: false, error: "Only workspace administrators can do this." };
  const supabase = await createClient();
  return { ok: true, session, supabase };
}

async function loadNormalizedEnums(supabase: Supabase): Promise<
  { ok: true; enums: Record<string, string[]>; uncontacted: string } | { ok: false; error: string }
> {
  const { data, error } = await supabase.from("os_settings").select("enum_defaults, uncontacted_stage").eq("id", SETTINGS_ID).maybeSingle();
  if (error || !data) return { ok: false, error: error?.message ?? "Settings not found." };
  const row = data as { enum_defaults?: unknown; uncontacted_stage?: string };
  const enums = normalizeEnumDefaults(
    row.enum_defaults && typeof row.enum_defaults === "object"
      ? (row.enum_defaults as Record<string, string[]>)
      : null
  );
  const uncontacted = String(row.uncontacted_stage ?? "New");
  return { ok: true, enums, uncontacted };
}

function sameMultiset(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

async function persistEnums(
  supabase: Supabase,
  next: Record<string, string[]>,
  extra: Record<string, unknown> | undefined,
  logMsg: string
): Promise<ActionResult> {
  const patch: Record<string, unknown> = { enum_defaults: next };
  if (extra) Object.assign(patch, extra);
  const { error } = await supabase.from("os_settings").update(patch).eq("id", SETTINGS_ID);
  if (error) return { ok: false, error: error.message };
  await logSetting(supabase, logMsg);
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/projects");
  return { ok: true };
}

async function persistRow(supabase: Supabase, patch: Record<string, unknown>, logMsg: string): Promise<ActionResult> {
  const { error } = await supabase.from("os_settings").update(patch).eq("id", SETTINGS_ID);
  if (error) return { ok: false, error: error.message };
  await logSetting(supabase, logMsg);
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function saveApplicationSettingsAction(payload: {
  os_name: string;
  brand_color: string;
}): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const os_name = payload.os_name.trim() || "Operating System";
  const brand_color = normalizeHex(payload.brand_color);
  return persistRow(
    supabase,
    { os_name, brand_color },
    `Application: name "${os_name}", brand color ${brand_color}`
  );
}

export async function saveRegionalSettingsAction(payload: { currency: string; timezone: string }): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const currency = payload.currency.trim().toUpperCase().slice(0, 8) || "AUD";
  const timezone = payload.timezone.trim() || "Australia/Sydney";
  const r = await persistRow(supabase, { currency, timezone }, `Regional: currency ${currency}, timezone ${timezone}`);
  if (r.ok) {
    revalidatePath("/dashboard/revenue");
    revalidatePath("/dashboard/calendar");
  }
  return r;
}

export async function saveFeatureTogglesAction(payload: {
  enable_content_engine: boolean;
  enable_analytics: boolean;
  enable_sops: boolean;
}): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  return persistRow(
    supabase,
    {
      enable_content_engine: payload.enable_content_engine,
      enable_analytics: payload.enable_analytics,
      enable_sops: payload.enable_sops,
    },
    `Toggles: content_engine=${payload.enable_content_engine}, analytics=${payload.enable_analytics}, sops=${payload.enable_sops}`
  );
}

export async function setUncontactedStageAction(stage: string): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const st = stage.trim();
  if (!loaded.enums.lead_stages.includes(st)) {
    return { ok: false, error: "Uncontacted stage must be one of your lead stages." };
  }
  return persistRow(supabase, { uncontacted_stage: st }, `Lead pipeline: uncontacted_stage → ${st}`);
}

export async function reorderLeadStagesAction(ordered: string[]): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const cur = loaded.enums.lead_stages;
  if (!sameMultiset(cur, ordered)) {
    return { ok: false, error: "Lead stages must match the current set (reorder only)." };
  }
  const next = { ...loaded.enums, lead_stages: ordered };
  return persistEnums(supabase, next, undefined, "Lead pipeline: reordered stages");
}

export async function addLeadStageAction(name: string): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const n = name.trim();
  if (!n) return { ok: false, error: "Stage name is required." };
  if (loaded.enums.lead_stages.includes(n)) return { ok: false, error: "That stage already exists." };
  const next = { ...loaded.enums, lead_stages: [...loaded.enums.lead_stages, n] };
  return persistEnums(supabase, next, undefined, `Lead pipeline: added stage "${n}"`);
}

export async function renameLeadStageAction(oldName: string, newName: string): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const oldN = oldName.trim();
  const newN = newName.trim();
  if (!oldN || !newN) return { ok: false, error: "Names are required." };
  if (oldN === newN) return { ok: true };
  if (!loaded.enums.lead_stages.includes(oldN)) return { ok: false, error: "Stage not found." };
  if (loaded.enums.lead_stages.includes(newN)) return { ok: false, error: "A stage with that name already exists." };
  const nextStages = loaded.enums.lead_stages.map((s) => (s === oldN ? newN : s));
  let uncontacted = loaded.uncontacted;
  if (uncontacted === oldN) uncontacted = newN;
  const { error: e1 } = await supabase.from("os_leads").update({ status: newN }).eq("status", oldN);
  if (e1) return { ok: false, error: e1.message };
  const next = { ...loaded.enums, lead_stages: nextStages };
  return persistEnums(supabase, next, { uncontacted_stage: uncontacted }, `Lead pipeline: renamed stage "${oldN}" → "${newN}"`);
}

export async function deleteLeadStageAction(stage: string, migrateTo: string): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const s = stage.trim();
  const m = migrateTo.trim();
  if (!s || !m) return { ok: false, error: "Stage and migration target are required." };
  if (s === m) return { ok: false, error: "Pick a different stage to migrate into." };
  if (loaded.enums.lead_stages.length <= 1) return { ok: false, error: "Cannot delete the last stage." };
  if (!loaded.enums.lead_stages.includes(s)) return { ok: false, error: "Stage not found." };
  if (!loaded.enums.lead_stages.includes(m)) return { ok: false, error: "Migration target must be an existing stage." };
  const { error: e1 } = await supabase.from("os_leads").update({ status: m }).eq("status", s);
  if (e1) return { ok: false, error: e1.message };
  const nextStages = loaded.enums.lead_stages.filter((x) => x !== s);
  let uncontacted = loaded.uncontacted;
  if (uncontacted === s) uncontacted = m;
  const next = { ...loaded.enums, lead_stages: nextStages };
  return persistEnums(supabase, next, { uncontacted_stage: uncontacted }, `Lead pipeline: deleted stage "${s}", migrated leads → "${m}"`);
}

export async function setLeadTemperaturesAction(temperatures: string[]): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const list = [...new Set(temperatures.map((t) => t.trim()).filter(Boolean))];
  if (list.length < 1) return { ok: false, error: "At least one temperature is required." };
  const { data: leads, error: le } = await supabase.from("os_leads").select("id, temperature");
  if (le) return { ok: false, error: le.message };
  const allowed = new Set(list);
  const fallback = list[0]!;
  const ids = (leads ?? [])
    .filter((r) => {
      const t = String((r as { temperature?: string }).temperature ?? "");
      return !allowed.has(t);
    })
    .map((r) => String((r as { id: string }).id));
  if (ids.length) {
    const { error: e2 } = await supabase.from("os_leads").update({ temperature: fallback }).in("id", ids);
    if (e2) return { ok: false, error: e2.message };
  }
  const next = { ...loaded.enums, lead_temperatures: list };
  return persistEnums(supabase, next, undefined, `Lead pipeline: temperatures → ${list.join(", ")}`);
}

export async function setCommonTagsAction(tags: string[]): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const list = [...new Set(tags.map((t) => t.trim()).filter(Boolean))];
  const next = { ...loaded.enums, common_tags: list };
  return persistEnums(supabase, next, undefined, `Lead pipeline: common tags (${list.length})`);
}

export async function reorderProjectStagesAction(ordered: string[]): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const cur = loaded.enums.project_stages;
  if (!sameMultiset(cur, ordered)) {
    return { ok: false, error: "Project stages must match the current set (reorder only)." };
  }
  const next = { ...loaded.enums, project_stages: ordered };
  return persistEnums(supabase, next, undefined, "Project stages: reordered");
}

export async function addProjectStageAction(name: string): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const n = name.trim();
  if (!n) return { ok: false, error: "Stage name is required." };
  if (loaded.enums.project_stages.includes(n)) return { ok: false, error: "That stage already exists." };
  const next = { ...loaded.enums, project_stages: [...loaded.enums.project_stages, n] };
  return persistEnums(supabase, next, undefined, `Project stages: added "${n}"`);
}

export async function renameProjectStageAction(oldName: string, newName: string): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const oldN = oldName.trim();
  const newN = newName.trim();
  if (!oldN || !newN) return { ok: false, error: "Names are required." };
  if (oldN === newN) return { ok: true };
  if (!loaded.enums.project_stages.includes(oldN)) return { ok: false, error: "Stage not found." };
  if (loaded.enums.project_stages.includes(newN)) return { ok: false, error: "A stage with that name already exists." };
  const { error: e1 } = await supabase.from("os_projects").update({ status: newN }).eq("status", oldN);
  if (e1) return { ok: false, error: e1.message };
  const nextStages = loaded.enums.project_stages.map((s) => (s === oldN ? newN : s));
  const next = { ...loaded.enums, project_stages: nextStages };
  return persistEnums(supabase, next, undefined, `Project stages: renamed "${oldN}" → "${newN}"`);
}

export async function deleteProjectStageAction(stage: string, migrateTo: string): Promise<ActionResult> {
  const gate = await requireInternalSession();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const loaded = await loadNormalizedEnums(supabase);
  if (!loaded.ok) return loaded;
  const s = stage.trim();
  const m = migrateTo.trim();
  if (!s || !m) return { ok: false, error: "Stage and migration target are required." };
  if (s === m) return { ok: false, error: "Pick a different stage to migrate into." };
  if (loaded.enums.project_stages.length <= 1) return { ok: false, error: "Cannot delete the last stage." };
  if (!loaded.enums.project_stages.includes(s)) return { ok: false, error: "Stage not found." };
  if (!loaded.enums.project_stages.includes(m)) return { ok: false, error: "Migration target must be an existing stage." };
  const { error: e1 } = await supabase.from("os_projects").update({ status: m }).eq("status", s);
  if (e1) return { ok: false, error: e1.message };
  const nextStages = loaded.enums.project_stages.filter((x) => x !== s);
  const next = { ...loaded.enums, project_stages: nextStages };
  return persistEnums(supabase, next, undefined, `Project stages: deleted "${s}", migrated projects → "${m}"`);
}

export async function bulkAssignLeadsAction(leadIds: string[], assignedUserId: string | null): Promise<ActionResult<{ updated: number }>> {
  const gate = await requireWorkspaceAdmin();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const ids = [...new Set(leadIds.map((x) => x.trim()).filter(Boolean))];
  if (ids.length === 0) return { ok: false, error: "No lead IDs provided." };
  const { error } = await supabase.from("os_leads").update({ assigned_user_id: assignedUserId }).in("id", ids);
  if (error) return { ok: false, error: error.message };
  await logSetting(supabase, `User admin: bulk-assigned ${ids.length} lead(s) → ${assignedUserId ?? "unassigned"}`);
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/settings");
  return { ok: true, data: { updated: ids.length } };
}

export async function updateProfileOsRoleAction(profileId: string, osRole: "admin" | "client" | null): Promise<ActionResult> {
  const gate = await requireWorkspaceAdmin();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase, session } = gate;
  if (profileId === session.userId && osRole === "client") {
    return { ok: false, error: "You cannot demote yourself to client from here." };
  }
  const { error } = await supabase
    .from("profiles")
    .update({ os_role: osRole })
    .eq("id", profileId);
  if (error) return { ok: false, error: error.message };
  await logSetting(supabase, `User admin: profile ${profileId} os_role → ${osRole ?? "null"}`);
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function updateProfileLinkedClientAction(profileId: string, osClientId: string | null): Promise<ActionResult> {
  const gate = await requireWorkspaceAdmin();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase } = gate;
  const { error } = await supabase.from("profiles").update({ os_client_id: osClientId }).eq("id", profileId);
  if (error) return { ok: false, error: error.message };
  await logSetting(
    supabase,
    `User admin: profile ${profileId} linked_client → ${osClientId ?? "none"}`
  );
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

/** Legacy single-form save — kept for compatibility. Prefer granular actions above. */
export async function updateOsSettingsAction(
  _prev: UpdateOsSettingsState,
  formData: FormData
): Promise<UpdateOsSettingsState> {
  const r = await saveApplicationSettingsAction({
    os_name: String(formData.get("os_name") ?? ""),
    brand_color: String(formData.get("brand_color") ?? ""),
  });
  if (!r.ok) return { error: r.error };
  const r2 = await saveRegionalSettingsAction({
    currency: String(formData.get("currency") ?? ""),
    timezone: String(formData.get("timezone") ?? ""),
  });
  if (!r2.ok) return { error: r2.error };
  const r3 = await saveFeatureTogglesAction({
    enable_content_engine: formData.get("enable_content_engine") === "on",
    enable_analytics: formData.get("enable_analytics") === "on",
    enable_sops: formData.get("enable_sops") === "on",
  });
  if (!r3.ok) return { error: r3.error };
  const r4 = await setUncontactedStageAction(String(formData.get("uncontacted_stage") ?? ""));
  if (!r4.ok) return { error: r4.error };
  return { ok: true };
}
