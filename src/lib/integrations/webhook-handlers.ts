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
  | "integration_calendly_enabled"
  | "integration_webhook_secret"
  | "integration_sheets_column_map"
  | "integration_calendly_booked_stage"
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
    .select(
      "id, uncontacted_stage, enum_defaults, integration_sheets_enabled, integration_calendly_enabled, integration_webhook_secret, integration_sheets_column_map, integration_calendly_booked_stage"
    )
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
    integration_calendly_enabled: Boolean(row.integration_calendly_enabled),
    integration_webhook_secret:
      row.integration_webhook_secret != null && String(row.integration_webhook_secret).trim()
        ? String(row.integration_webhook_secret)
        : null,
    integration_sheets_column_map:
      row.integration_sheets_column_map && typeof row.integration_sheets_column_map === "object"
        ? (row.integration_sheets_column_map as Record<string, string>)
        : {},
    integration_calendly_booked_stage: String(row.integration_calendly_booked_stage ?? "Booked"),
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
};

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
  const row = parsed?.row && typeof parsed.row === "object" ? (parsed.row as Record<string, unknown>) : null;
  if (!row || Object.keys(row).length === 0) {
    return { status: 400, json: { ok: false, error: "Missing row object." } };
  }
  const map = mergeSheetsColumnMap(settings.integration_sheets_column_map);
  const fields = mapSheetsRowToLeadFields(row, map);
  const temps = settings.enum_defaults?.lead_temperatures ?? DEFAULT_OS_SETTINGS.enum_defaults!.lead_temperatures!;
  const temperature = clampTemperature(fields.temperature, temps);
  const uncontacted = settings.uncontacted_stage;

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
        source: fields.source,
        tags: fields.tags,
        temperature,
      })
      .eq("id", leadId);
    if (error) return { status: 500, json: { ok: false, error: error.message } };
    await activityInsert(admin, "os_lead", leadId, "sheets_sync", "Lead upserted from Google Sheets");
  } else {
    const { data, error } = await admin
      .from("os_leads")
      .insert({
        lead_name: fields.lead_name,
        business_name: fields.business_name,
        email: fields.email,
        phone: fields.phone,
        source: fields.source,
        status: uncontacted,
        temperature,
        tags: fields.tags,
        assigned_user_id: null,
      })
      .select("id")
      .single();
    if (error || !data?.id) return { status: 500, json: { ok: false, error: error?.message ?? "Insert failed." } };
    leadId = String(data.id);
    await activityInsert(admin, "os_lead", leadId, "sheets_sync", "Lead upserted from Google Sheets");
  }

  return { status: 200, json: { ok: true, leadId } };
}

export type CalendlyParsed = {
  inviteeName: string;
  inviteeEmail: string;
  startIso: string;
  endIso: string;
  meetingLink: string;
  eventTypeName: string;
};

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function firstEmailInString(s: string): string | null {
  const m = s.match(/[^\s@]+@[^\s@]+\.[^\s@]+/i);
  return m ? m[0]!.toLowerCase() : null;
}

/** Best-effort parse for Calendly and custom proxy payloads. */
export function parseCalendlyPayload(body: unknown): CalendlyParsed | null {
  const root = asRecord(body);
  if (!root) return null;
  const candidates: Record<string, unknown>[] = [root];
  const p1 = asRecord(root.payload);
  if (p1) candidates.push(p1);
  const p2 = asRecord(root.data);
  if (p2) candidates.push(p2);
  const scheduled = asRecord(root.scheduled_event) ?? asRecord(p1?.scheduled_event) ?? asRecord(p2?.scheduled_event);

  let inviteeEmail = "";
  let inviteeName = "";
  for (const c of candidates) {
    const inv = asRecord(c.invitee) ?? asRecord(c.invitee_email ? { email: c.invitee_email } : null);
    const em =
      (typeof c.email === "string" && c.email) ||
      (typeof inv?.email === "string" && inv.email) ||
      (typeof c.invitee_email === "string" && c.invitee_email) ||
      "";
    const nm =
      (typeof c.name === "string" && c.name) ||
      (typeof inv?.name === "string" && inv.name) ||
      "";
    if (em) inviteeEmail = em.trim().toLowerCase();
    if (typeof inv?.name === "string" && inv.name.trim()) inviteeName = inv.name.trim();
    else if (typeof c.name === "string" && c.name.trim()) inviteeName = c.name.trim();
    else if (nm) inviteeName = String(nm).trim();
    if (inviteeEmail) break;
  }

  if (!inviteeEmail && typeof body === "string") {
    inviteeEmail = firstEmailInString(body) ?? "";
  }

  let startIso = "";
  let endIso = "";
  const se = scheduled ?? asRecord(root.event);
  if (se) {
    startIso = String(se.start_time ?? se.startTime ?? se.start ?? "");
    endIso = String(se.end_time ?? se.endTime ?? se.end ?? "");
  }
  if (!startIso) startIso = String(root.start_time ?? root.startTime ?? root.start ?? "");
  if (!endIso) endIso = String(root.end_time ?? root.endTime ?? root.end ?? "");

  let meetingLink = "";
  meetingLink =
    String(root.meeting_link ?? root.meetingLink ?? "") ||
    String(scheduled?.join_url ?? "") ||
    (() => {
      const lr = scheduled?.location;
      if (lr && typeof lr === "object") {
        const l = lr as Record<string, unknown>;
        return String(l.join_url ?? l.joinUrl ?? "");
      }
      if (typeof lr === "string") return lr;
      return "";
    })() ||
    "";

  let eventTypeName = "";
  const et = asRecord(scheduled?.event_type) ?? asRecord(root.event_type);
  eventTypeName =
    String(et?.name ?? et?.slug ?? root.event_type_name ?? root.eventType ?? scheduled?.name ?? "Booking") || "Booking";

  if (!inviteeEmail || !isValidEmail(inviteeEmail)) return null;
  if (!startIso || !endIso) {
    const s = new Date(startIso || Date.now());
    const e = new Date(s.getTime() + 60 * 60 * 1000);
    if (!startIso) startIso = s.toISOString();
    if (!endIso) endIso = e.toISOString();
  }

  if (!inviteeName) inviteeName = inviteeEmail.split("@")[0] ?? "Invitee";

  return {
    inviteeName,
    inviteeEmail,
    startIso: new Date(startIso).toISOString(),
    endIso: new Date(endIso).toISOString(),
    meetingLink: meetingLink.trim(),
    eventTypeName: String(eventTypeName).trim() || "Booking",
  };
}

export async function handleCalendlyWebhook(body: unknown): Promise<{ status: number; json: Record<string, unknown> }> {
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return { status: 503, json: { ok: false, error: "Server not configured." } };
  }
  const settings = await loadIntegrationSettings(admin);
  if (!settings?.integration_calendly_enabled) {
    return { status: 403, json: { ok: false, error: "Calendly integration disabled." } };
  }
  const parsed = parseCalendlyPayload(body);
  if (!parsed) {
    return { status: 400, json: { ok: false, error: "Could not parse invitee email from payload." } };
  }
  const stages = settings.enum_defaults?.lead_stages ?? DEFAULT_OS_SETTINGS.enum_defaults!.lead_stages!;
  const bookedStage = settings.integration_calendly_booked_stage?.trim() || "Booked";
  const status = stages.includes(bookedStage) ? bookedStage : stages.includes("Booked") ? "Booked" : stages[0] ?? "New";

  let leadId = await findLeadIdByEmail(admin, parsed.inviteeEmail);
  if (leadId) {
    const { error } = await admin
      .from("os_leads")
      .update({
        lead_name: parsed.inviteeName,
        status,
      })
      .eq("id", leadId);
    if (error) return { status: 500, json: { ok: false, error: error.message } };
  } else {
    const temps = settings.enum_defaults?.lead_temperatures ?? DEFAULT_OS_SETTINGS.enum_defaults!.lead_temperatures!;
    const { data, error } = await admin
      .from("os_leads")
      .insert({
        lead_name: parsed.inviteeName,
        business_name: "",
        email: parsed.inviteeEmail,
        phone: null,
        source: "Calendly",
        status,
        temperature: temps[0] ?? "Cold",
        tags: [],
        assigned_user_id: null,
      })
      .select("id")
      .single();
    if (error || !data?.id) return { status: 500, json: { ok: false, error: error?.message ?? "Insert failed." } };
    leadId = String(data.id);
  }

  await activityInsert(admin, "os_lead", leadId!, "calendly_sync", "Calendly booking synced");

  const actorId = await findFirstInternalActorUserId(admin);
  let eventId: string | null = null;
  if (actorId) {
    const title = `Calendly: ${parsed.eventTypeName}`;
    const { data: ev, error: evErr } = await admin
      .from("os_events")
      .insert({
        title,
        date_start: parsed.startIso,
        date_end: parsed.endIso,
        event_type: "Meeting",
        status: "Confirmed",
        related_lead_id: leadId,
        related_client_id: null,
        meeting_link: parsed.meetingLink || null,
        created_by_user_id: actorId,
      })
      .select("id")
      .single();
    if (!evErr && ev?.id) {
      eventId = String(ev.id);
      await activityInsert(admin, "os_event", eventId, "calendly_sync", `Created from Calendly booking (${parsed.inviteeEmail})`);
    }
  }

  return { status: 200, json: { ok: true, leadId, eventId } };
}
