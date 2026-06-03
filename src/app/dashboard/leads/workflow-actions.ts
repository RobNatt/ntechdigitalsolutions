"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOsSession } from "@/lib/os/get-os-settings";
import {
  defaultNextFollowUpAt,
  STAGE_CHECKLIST_TEMPLATES,
  TOUCH_CHANNELS,
} from "@/lib/os/lead-workflow";
import type {
  LeadWorkspaceData,
  OsLeadChecklistRow,
  OsLeadDocumentRow,
  OsLeadEventRow,
  OsLeadTouchpointRow,
} from "@/lib/os/leads-workflow-types";
import { mapOsLeadRow } from "@/lib/os/map-os-lead";
import type { ActionResult } from "./actions";

const BUCKET = "os-lead-documents";
const MAX_BYTES = 20 * 1024 * 1024;

async function requireInternalLead(
  leadId: string
): Promise<
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; userId: string }
  | { ok: false; error: string }
> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can manage lead workflow." };
  const supabase = await createClient();
  const { data, error } = await supabase.from("os_leads").select("id").eq("id", leadId).maybeSingle();
  if (error || !data) return { ok: false, error: "Lead not found." };
  return { ok: true, supabase, userId: session.userId };
}

function mapTouch(row: Record<string, unknown>): OsLeadTouchpointRow {
  return {
    id: String(row.id),
    lead_id: String(row.lead_id),
    channel: String(row.channel),
    outcome: row.outcome != null ? String(row.outcome) : null,
    notes: row.notes != null ? String(row.notes) : null,
    touched_at: String(row.touched_at),
    next_follow_up_at: row.next_follow_up_at != null ? String(row.next_follow_up_at) : null,
    created_at: String(row.created_at),
  };
}

function mapDoc(row: Record<string, unknown>, downloadUrl?: string | null): OsLeadDocumentRow {
  return {
    id: String(row.id),
    lead_id: String(row.lead_id),
    stage: row.stage != null ? String(row.stage) : null,
    file_name: String(row.file_name),
    storage_path: String(row.storage_path),
    mime_type: row.mime_type != null ? String(row.mime_type) : null,
    byte_size: row.byte_size != null ? Number(row.byte_size) : null,
    notes: row.notes != null ? String(row.notes) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    download_url: downloadUrl ?? null,
  };
}

function mapCheck(row: Record<string, unknown>): OsLeadChecklistRow {
  return {
    id: String(row.id),
    lead_id: String(row.lead_id),
    stage: String(row.stage),
    item_key: String(row.item_key),
    label: String(row.label),
    completed_at: row.completed_at != null ? String(row.completed_at) : null,
    notes: row.notes != null ? String(row.notes) : null,
  };
}

function mapEvent(row: Record<string, unknown>): OsLeadEventRow {
  return {
    id: String(row.id),
    title: String(row.title),
    date_start: String(row.date_start),
    date_end: String(row.date_end),
    event_type: String(row.event_type),
    status: String(row.status),
    meeting_link: row.meeting_link != null ? String(row.meeting_link) : null,
  };
}

async function ensureChecklistRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  leadId: string,
  stage: string
): Promise<void> {
  const template = STAGE_CHECKLIST_TEMPLATES[stage];
  if (!template?.length) return;
  const { data: existing } = await supabase
    .from("os_lead_checklist")
    .select("item_key")
    .eq("lead_id", leadId)
    .eq("stage", stage);
  const have = new Set((existing ?? []).map((r) => String(r.item_key)));
  const toInsert = template
    .filter((t) => !have.has(t.key))
    .map((t) => ({
      lead_id: leadId,
      stage,
      item_key: t.key,
      label: t.label,
    }));
  if (toInsert.length) {
    await supabase.from("os_lead_checklist").insert(toInsert);
  }
}

export async function getLeadWorkspaceAction(leadId: string): Promise<ActionResult<LeadWorkspaceData>> {
  const access = await requireInternalLead(leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { supabase } = access;

  const [leadRes, touchRes, docRes, checkRes, eventRes] = await Promise.all([
    supabase
      .from("os_leads")
      .select("next_follow_up_at, last_touch_at, linkedin_url, pipeline_notes, status")
      .eq("id", leadId)
      .maybeSingle(),
    supabase
      .from("os_lead_touchpoints")
      .select("*")
      .eq("lead_id", leadId)
      .order("touched_at", { ascending: false })
      .limit(50),
    supabase
      .from("os_lead_documents")
      .select("*")
      .eq("lead_id", leadId)
      .order("updated_at", { ascending: false }),
    supabase.from("os_lead_checklist").select("*").eq("lead_id", leadId).order("stage"),
    supabase
      .from("os_events")
      .select("id, title, date_start, date_end, event_type, status, meeting_link")
      .eq("related_lead_id", leadId)
      .order("date_start", { ascending: false })
      .limit(20),
  ]);

  if (leadRes.error || !leadRes.data) return { ok: false, error: leadRes.error?.message ?? "Lead not found." };
  const stage = String(leadRes.data.status ?? "");
  await ensureChecklistRows(supabase, leadId, stage);

  const { data: checklistAfter } = await supabase
    .from("os_lead_checklist")
    .select("*")
    .eq("lead_id", leadId)
    .order("stage");

  const docs: OsLeadDocumentRow[] = [];
  for (const row of docRes.data ?? []) {
    const path = String((row as { storage_path: string }).storage_path);
    const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
    docs.push(mapDoc(row as Record<string, unknown>, signed?.signedUrl ?? null));
  }

  return {
    ok: true,
    data: {
      touchpoints: (touchRes.data ?? []).map((r) => mapTouch(r as Record<string, unknown>)),
      documents: docs,
      checklist: (checklistAfter ?? checkRes.data ?? []).map((r) => mapCheck(r as Record<string, unknown>)),
      events: (eventRes.data ?? []).map((r) => mapEvent(r as Record<string, unknown>)),
      next_follow_up_at:
        leadRes.data.next_follow_up_at != null ? String(leadRes.data.next_follow_up_at) : null,
      last_touch_at: leadRes.data.last_touch_at != null ? String(leadRes.data.last_touch_at) : null,
      linkedin_url: leadRes.data.linkedin_url != null ? String(leadRes.data.linkedin_url) : null,
      pipeline_notes:
        leadRes.data.pipeline_notes != null ? String(leadRes.data.pipeline_notes) : null,
    },
  };
}

export type LogTouchPayload = {
  channel: string;
  outcome: string | null;
  notes: string | null;
  touched_at?: string | null;
  next_follow_up_at?: string | null;
  move_to_stage?: string | null;
};

export async function logLeadTouchAction(
  leadId: string,
  payload: LogTouchPayload
): Promise<ActionResult<{ touchpointId: string }>> {
  const access = await requireInternalLead(leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { supabase, userId } = access;

  const channel = payload.channel.trim().toLowerCase();
  if (!TOUCH_CHANNELS.includes(channel as (typeof TOUCH_CHANNELS)[number])) {
    return { ok: false, error: "Invalid outreach type." };
  }

  const { data: leadRow } = await supabase
    .from("os_leads")
    .select("temperature")
    .eq("id", leadId)
    .maybeSingle();
  const temperature = String(leadRow?.temperature ?? "Cold");
  const touchedAt = payload.touched_at?.trim() || new Date().toISOString();
  const nextAt =
    payload.next_follow_up_at?.trim() ||
    defaultNextFollowUpAt(temperature, new Date(touchedAt));

  const { data: touch, error: tErr } = await supabase
    .from("os_lead_touchpoints")
    .insert({
      lead_id: leadId,
      channel,
      outcome: payload.outcome?.trim() || null,
      notes: payload.notes?.trim() || null,
      touched_at: touchedAt,
      next_follow_up_at: nextAt,
      created_by_user_id: userId,
    })
    .select("id")
    .single();
  if (tErr || !touch?.id) return { ok: false, error: tErr?.message ?? "Could not log touch." };

  const leadUpdates: Record<string, unknown> = {
    last_touch_at: touchedAt,
    next_follow_up_at: nextAt,
  };
  if (payload.move_to_stage?.trim()) {
    leadUpdates.status = payload.move_to_stage.trim();
  }
  const { error: uErr } = await supabase.from("os_leads").update(leadUpdates).eq("id", leadId);
  if (uErr) return { ok: false, error: uErr.message };

  if (payload.move_to_stage?.trim()) {
    await ensureChecklistRows(supabase, leadId, payload.move_to_stage.trim());
  }

  await supabase.from("os_activity_log").insert({
    entity_type: "os_lead",
    entity_id: leadId,
    action: "touch_logged",
    message: `${channel}${payload.outcome ? ` · ${payload.outcome}` : ""}${payload.notes ? ` — ${payload.notes.slice(0, 120)}` : ""}`,
  });

  revalidatePath("/dashboard/leads");
  return { ok: true, data: { touchpointId: String(touch.id) } };
}

export async function saveLeadPipelineNotesAction(
  leadId: string,
  notes: string
): Promise<ActionResult> {
  const access = await requireInternalLead(leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { error } = await access.supabase
    .from("os_leads")
    .update({ pipeline_notes: notes.trim() || null })
    .eq("id", leadId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

export async function saveLeadLinkedInAction(
  leadId: string,
  linkedinUrl: string | null
): Promise<ActionResult> {
  const access = await requireInternalLead(leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { error } = await access.supabase
    .from("os_leads")
    .update({ linkedin_url: linkedinUrl?.trim() || null })
    .eq("id", leadId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

export async function setLeadNextFollowUpAction(
  leadId: string,
  nextFollowUpAt: string | null
): Promise<ActionResult> {
  const access = await requireInternalLead(leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { error } = await access.supabase
    .from("os_leads")
    .update({ next_follow_up_at: nextFollowUpAt })
    .eq("id", leadId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

export async function toggleLeadChecklistAction(
  leadId: string,
  checklistId: string,
  completed: boolean
): Promise<ActionResult> {
  const access = await requireInternalLead(leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { error } = await access.supabase
    .from("os_lead_checklist")
    .update({ completed_at: completed ? new Date().toISOString() : null })
    .eq("id", checklistId)
    .eq("lead_id", leadId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

export async function uploadLeadDocumentAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const leadId = String(formData.get("leadId") ?? "");
  const stage = String(formData.get("stage") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const file = formData.get("file");
  if (!leadId) return { ok: false, error: "Missing lead." };
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a file to upload." };
  if (file.size > MAX_BYTES) return { ok: false, error: "File must be under 20 MB." };

  const access = await requireInternalLead(leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { supabase, userId } = access;

  const safeName = file.name.replace(/[^\w.\-()+ ]/g, "_").slice(0, 180);
  const storagePath = `${leadId}/${Date.now()}-${safeName}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(storagePath, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (upErr) return { ok: false, error: upErr.message };

  const { data, error } = await supabase
    .from("os_lead_documents")
    .insert({
      lead_id: leadId,
      stage,
      file_name: safeName,
      storage_path: storagePath,
      mime_type: file.type || null,
      byte_size: file.size,
      notes,
      uploaded_by_user_id: userId,
    })
    .select("id")
    .single();
  if (error || !data?.id) return { ok: false, error: error?.message ?? "Could not save document record." };

  revalidatePath("/dashboard/leads");
  return { ok: true, data: { id: String(data.id) } };
}

export async function deleteLeadDocumentAction(leadId: string, documentId: string): Promise<ActionResult> {
  const access = await requireInternalLead(leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { data: doc } = await access.supabase
    .from("os_lead_documents")
    .select("storage_path")
    .eq("id", documentId)
    .eq("lead_id", leadId)
    .maybeSingle();
  if (!doc) return { ok: false, error: "Document not found." };
  await access.supabase.storage.from(BUCKET).remove([String(doc.storage_path)]);
  const { error } = await access.supabase.from("os_lead_documents").delete().eq("id", documentId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

export type LeadMeetingPayload = {
  title: string;
  date_start: string;
  date_end: string;
  event_type: string;
  status: string;
  meeting_link: string | null;
};

export async function createLeadMeetingAction(
  leadId: string,
  payload: LeadMeetingPayload
): Promise<ActionResult<{ id: string }>> {
  const access = await requireInternalLead(leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { data, error } = await access.supabase
    .from("os_events")
    .insert({
      title: payload.title.trim() || "Meeting",
      date_start: payload.date_start,
      date_end: payload.date_end,
      event_type: payload.event_type.trim() || "Meeting",
      status: payload.status.trim() || "Confirmed",
      meeting_link: payload.meeting_link?.trim() || null,
      related_lead_id: leadId,
      related_client_id: null,
      created_by_user_id: access.userId,
    })
    .select("id")
    .single();
  if (error || !data?.id) return { ok: false, error: error?.message ?? "Could not schedule meeting." };
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/calendar");
  return { ok: true, data: { id: String(data.id) } };
}

export async function updateLeadMeetingStatusAction(
  leadId: string,
  eventId: string,
  status: string
): Promise<ActionResult> {
  const access = await requireInternalLead(leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { error } = await access.supabase
    .from("os_events")
    .update({ status: status.trim() })
    .eq("id", eventId)
    .eq("related_lead_id", leadId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/calendar");
  return { ok: true };
}

/** Refresh lead row after workspace changes (status, follow-up dates). */
export async function refreshLeadRowAction(leadId: string): Promise<
  ActionResult<{ lead: ReturnType<typeof mapOsLeadRow> }>
> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const { data, error } = await supabase.from("os_leads").select("*").eq("id", leadId).maybeSingle();
  if (error || !data) return { ok: false, error: "Lead not found." };
  return { ok: true, data: { lead: mapOsLeadRow(data as Record<string, unknown>) } };
}
