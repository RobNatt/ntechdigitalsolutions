import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_OS_SETTINGS, OS_SETTINGS_SINGLETON_ID } from "@/lib/os/default-settings";
import { isValidEmail, normalizePhoneDigits, parseTagsInput } from "@/lib/os/lead-utils";
import type { OsSettingsRow } from "@/lib/os/types";

export const SHEET_LEAD_FIELD_KEYS = [
  "lead_name",
  "business_name",
  "email",
  "phone",
  "source",
  "tags",
  "temperature",
] as const;

export type SheetLeadFieldKey = (typeof SHEET_LEAD_FIELD_KEYS)[number];

/** Default column headers matching in-app documentation sample. */
export const DEFAULT_SHEETS_COLUMN_MAP: Record<SheetLeadFieldKey, string> = {
  lead_name: "Name",
  business_name: "Business",
  email: "Email",
  phone: "Phone",
  source: "Source",
  tags: "Tags",
  temperature: "Temperature",
};

export type IntegrationSettingsSnapshot = Pick<
  OsSettingsRow,
  | "id"
  | "uncontacted_stage"
  | "enum_defaults"
  | "integration_sheets_enabled"
  | "integration_webhook_secret"
  | "integration_sheets_column_map"
>;

export function mergeSheetsColumnMap(saved: Record<string, string> | null | undefined): Record<SheetLeadFieldKey, string> {
  const out = { ...DEFAULT_SHEETS_COLUMN_MAP };
  if (!saved) return out;
  for (const k of SHEET_LEAD_FIELD_KEYS) {
    const v = saved[k]?.trim();
    if (v) out[k] = v;
  }
  return out;
}

function pickRowValue(row: Record<string, unknown>, header: string): string {
  const t = header.trim();
  if (!t) return "";
  for (const [k, v] of Object.entries(row)) {
    if (k === t) return v == null ? "" : String(v);
  }
  const lower = t.toLowerCase();
  for (const [k, v] of Object.entries(row)) {
    if (k.toLowerCase() === lower) return v == null ? "" : String(v);
  }
  return "";
}

export function mapSheetsRowToLeadFields(
  row: Record<string, unknown>,
  columnMap: Record<SheetLeadFieldKey, string>
): {
  lead_name: string;
  business_name: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  tags: string[];
  temperature: string;
} {
  const lead_name = pickRowValue(row, columnMap.lead_name).trim() || "Untitled";
  const business_name = pickRowValue(row, columnMap.business_name).trim();
  const emailRaw = pickRowValue(row, columnMap.email).trim().toLowerCase();
  const email = emailRaw && isValidEmail(emailRaw) ? emailRaw : null;
  const phone = pickRowValue(row, columnMap.phone).trim() || null;
  const source = pickRowValue(row, columnMap.source).trim() || null;
  const tagsRaw = pickRowValue(row, columnMap.tags);
  const tags = parseTagsInput(tagsRaw.replace(/\|/g, ","));
  const temperature = pickRowValue(row, columnMap.temperature).trim() || "Cold";
  return { lead_name, business_name, email, phone, source, tags, temperature };
}

function clampTemperature(t: string, allowed: string[]): string {
  if (allowed.includes(t)) return t;
  return allowed[0] ?? "Cold";
}

async function activityInsert(
  admin: SupabaseClient,
  entityType: string,
  entityId: string,
  action: string,
  message: string
): Promise<void> {
  const { error } = await admin.from("os_activity_log").insert({
    entity_type: entityType,
    entity_id: entityId,
    action,
    message,
  });
  if (error) console.warn("activityInsert:", error.message);
}

export async function loadIntegrationSettings(admin: SupabaseClient): Promise<IntegrationSettingsSnapshot | null> {
  const { data, error } = await admin
    .from("os_settings")
    .select("id, uncontacted_stage, enum_defaults, integration_sheets_enabled, integration_webhook_secret, integration_sheets_column_map")
    .eq("id", OS_SETTINGS_SINGLETON_ID)
    .maybeSingle();
  if (error || !data) {
    console.warn("loadIntegrationSettings:", error?.message);
    return null;
  }
  const row = data as Record<string, unknown>;
  return {
    id: String(row.id ?? OS_SETTINGS_SINGLETON_ID),
    uncontacted_stage: String(row.uncontacted_stage ?? "New"),
    enum_defaults:
      row.enum_defaults && typeof row.enum_defaults === "object"
        ? (row.enum_defaults as Record<string, string[]>)
        : DEFAULT_OS_SETTINGS.enum_defaults,
    integration_sheets_enabled: Boolean(row.integration_sheets_enabled),
    integration_webhook_secret:
      row.integration_webhook_secret != null && String(row.integration_webhook_secret).trim()
        ? String(row.integration_webhook_secret)
        : null,
    integration_sheets_column_map:
      row.integration_sheets_column_map && typeof row.integration_sheets_column_map === "object"
        ? (row.integration_sheets_column_map as Record<string, string>)
        : {},
  };
}

export function verifyWebhookSecret(settings: IntegrationSettingsSnapshot, headerToken: string | null): boolean {
  const expected = settings.integration_webhook_secret?.trim();
  if (!expected) return false;
  const got = (headerToken ?? "").trim();
  if (!got || got.length !== expected.length) return false;
  try {
    return timingSafeEqual(got, expected);
  } catch {
    return false;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) {
    r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return r === 0;
}

async function findLeadIdByEmail(admin: SupabaseClient, email: string): Promise<string | null> {
  const { data } = await admin.from("os_leads").select("id").eq("email", email.toLowerCase().trim()).maybeSingle();
  return data?.id ? String(data.id) : null;
}

async function findLeadIdByPhone(admin: SupabaseClient, phone: string): Promise<string | null> {
  const digits = normalizePhoneDigits(phone);
  if (digits.length < 10) return null;
  const { data } = await admin.from("os_leads").select("id, phone").limit(3000);
  for (const r of data ?? []) {
    const row = r as { id: string; phone?: string | null };
    if (normalizePhoneDigits(row.phone ?? "") === digits) return String(row.id);
  }
  return null;
}

export async function findFirstInternalActorUserId(admin: SupabaseClient): Promise<string | null> {
  const { data } = await admin.from("profiles").select("id, os_role").limit(500);
  for (const r of data ?? []) {
    const row = r as { id: string; os_role?: string | null };
    if (row.os_role !== "client") return String(row.id);
  }
  return null;
}

export type SheetsWebhookBody = {
  sheetId?: string;
  sheetName?: string;
  row?: Record<string, unknown>;
  /** Bulk sync: array of header-keyed row objects from Google Sheets. */
  rows?: Record<string, unknown>[];
};

export type SheetRowUpsertResult =
  | { ok: true; leadId: string; created: boolean }
  | { ok: false; error: string; skipped?: boolean };

function sheetRowHasIdentity(fields: ReturnType<typeof mapSheetsRowToLeadFields>): boolean {
  if (fields.email || fields.phone) return true;
  if (fields.business_name.trim()) return true;
  return Boolean(fields.lead_name.trim() && fields.lead_name !== "Untitled");
}

/** Upsert one spreadsheet row into os_leads (match email, else phone). */
export async function upsertOsLeadFromSheetRow(
  admin: SupabaseClient,
  settings: IntegrationSettingsSnapshot,
  row: Record<string, unknown>,
  columnMap?: Record<SheetLeadFieldKey, string>
): Promise<SheetRowUpsertResult> {
  const map = columnMap ?? mergeSheetsColumnMap(settings.integration_sheets_column_map);
  const fields = mapSheetsRowToLeadFields(row, map);
  if (!sheetRowHasIdentity(fields)) {
    return { ok: false, error: "Empty row", skipped: true };
  }

  const temps = settings.enum_defaults?.lead_temperatures ?? DEFAULT_OS_SETTINGS.enum_defaults!.lead_temperatures!;
  const temperature = clampTemperature(fields.temperature, temps);
  const uncontacted = settings.uncontacted_stage;
  const source = fields.source?.trim() || "Google Sheets";

  let leadId: string | null = null;
  if (fields.email) leadId = await findLeadIdByEmail(admin, fields.email);
  if (!leadId && fields.phone) leadId = await findLeadIdByPhone(admin, fields.phone);

  if (leadId) {
    const { error } = await admin
      .from("os_leads")
      .update({
        lead_name: fields.lead_name,
        business_name: fields.business_name,
        email: fields.email,
        phone: fields.phone,
        source,
        tags: fields.tags,
        temperature,
      })
      .eq("id", leadId);
    if (error) return { ok: false, error: error.message };
    await activityInsert(admin, "os_lead", leadId, "sheets_sync", "Lead updated from spreadsheet");
    return { ok: true, leadId, created: false };
  }

  const { data, error } = await admin
    .from("os_leads")
    .insert({
      lead_name: fields.lead_name,
      business_name: fields.business_name,
      email: fields.email,
      phone: fields.phone,
      source,
      status: uncontacted,
      temperature,
      tags: fields.tags,
      assigned_user_id: null,
    })
    .select("id")
    .single();
  if (error || !data?.id) return { ok: false, error: error?.message ?? "Insert failed." };
  leadId = String(data.id);
  await activityInsert(admin, "os_lead", leadId, "sheets_sync", "Lead imported from spreadsheet");
  return { ok: true, leadId, created: true };
}

export async function upsertOsLeadsFromSheetRows(
  admin: SupabaseClient,
  settings: IntegrationSettingsSnapshot,
  rows: Record<string, unknown>[]
): Promise<{ created: number; updated: number; skipped: number; errors: string[] }> {
  const map = mergeSheetsColumnMap(settings.integration_sheets_column_map);
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || typeof row !== "object" || Object.keys(row).length === 0) {
      skipped++;
      continue;
    }
    const result = await upsertOsLeadFromSheetRow(admin, settings, row, map);
    if (result.ok) {
      if (result.created) created++;
      else updated++;
    } else if (result.skipped) {
      skipped++;
    } else {
      errors.push(`Row ${i + 2}: ${result.error}`);
    }
  }

  return { created, updated, skipped, errors };
}

export async function handleSheetsWebhook(body: unknown): Promise<{ status: number; json: Record<string, unknown> }> {
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return { status: 503, json: { ok: false, error: "Server not configured." } };
  }
  const settings = await loadIntegrationSettings(admin);
  if (!settings?.integration_sheets_enabled) {
    return { status: 403, json: { ok: false, error: "Sheets integration disabled." } };
  }
  const parsed = body as SheetsWebhookBody;

  if (Array.isArray(parsed?.rows) && parsed.rows.length > 0) {
    const MAX = 500;
    const slice = parsed.rows.slice(0, MAX);
    const stats = await upsertOsLeadsFromSheetRows(admin, settings, slice);
    return {
      status: 200,
      json: {
        ok: true,
        bulk: true,
        processed: slice.length,
        ...stats,
        truncated: parsed.rows.length > MAX,
      },
    };
  }

  const row = parsed?.row && typeof parsed.row === "object" ? (parsed.row as Record<string, unknown>) : null;
  if (!row || Object.keys(row).length === 0) {
    return { status: 400, json: { ok: false, error: "Missing row or rows array." } };
  }

  const result = await upsertOsLeadFromSheetRow(admin, settings, row);
  if (!result.ok) {
    if (result.skipped) return { status: 400, json: { ok: false, error: "Row has no name, email, or phone." } };
    return { status: 500, json: { ok: false, error: result.error } };
  }
  return { status: 200, json: { ok: true, leadId: result.leadId, created: result.created } };
}
