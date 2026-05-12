"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getOsSession } from "@/lib/os/get-os-settings";
import { isValidEmail, normalizePhoneDigits, parseTagsInput } from "@/lib/os/lead-utils";
import type { OsActivityRow, OsLeadRow } from "@/lib/os/leads-types";
import { mapOsLeadRow } from "@/lib/os/map-os-lead";

export type ActionResult<T = void> = { ok: true; data?: T } | { ok: false; error: string };

async function logLeadActivity(
  supabase: Awaited<ReturnType<typeof createClient>>,
  leadId: string,
  action: string,
  message: string
): Promise<void> {
  const { error } = await supabase.from("os_activity_log").insert({
    entity_type: "os_lead",
    entity_id: leadId,
    action,
    message,
  });
  if (error) {
    console.warn("logLeadActivity:", error.message);
  }
}

async function assertLeadAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  session: NonNullable<Awaited<ReturnType<typeof getOsSession>>>,
  leadId: string
): Promise<{ ok: true; lead: OsLeadRow } | { ok: false; error: string }> {
  const { data, error } = await supabase.from("os_leads").select("*").eq("id", leadId).maybeSingle();
  if (error || !data) return { ok: false, error: "Lead not found." };
  const lead = mapOsLeadRow(data as Record<string, unknown>);
  if (session.isInternal) return { ok: true, lead };
  const ok =
    lead.assigned_user_id === session.userId ||
    (session.profile?.os_client_id != null && lead.linked_client_id === session.profile.os_client_id);
  if (!ok) return { ok: false, error: "Not allowed." };
  return { ok: true, lead };
}

export async function getLeadActivityAction(leadId: string): Promise<ActionResult<{ items: OsActivityRow[] }>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const access = await assertLeadAccess(supabase, session, leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const { data, error } = await supabase
    .from("os_activity_log")
    .select("id, entity_type, entity_id, action, message, created_at")
    .eq("entity_type", "os_lead")
    .eq("entity_id", leadId)
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) return { ok: false, error: error.message };
  const items = (data ?? []).map((r) => ({
    id: String(r.id),
    entity_type: String(r.entity_type),
    entity_id: String(r.entity_id),
    action: String(r.action),
    message: r.message != null ? String(r.message) : null,
    created_at: String(r.created_at),
  }));
  return { ok: true, data: { items } };
}

export async function checkLeadDuplicatesAction(
  email: string | null,
  phone: string | null,
  excludeLeadId?: string | null
): Promise<ActionResult<{ emailMatch: boolean; phoneMatch: boolean }>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const e = email?.trim().toLowerCase() || "";
  const p = normalizePhoneDigits(phone);
  let emailMatch = false;
  let phoneMatch = false;
  if (e) {
    let q = supabase.from("os_leads").select("id").eq("email", e).limit(2);
    if (excludeLeadId) q = q.neq("id", excludeLeadId);
    const { data } = await q;
    emailMatch = (data?.length ?? 0) > 0;
  }
  if (p.length >= 10) {
    const { data: rows } = await supabase.from("os_leads").select("id, phone").limit(500);
    const match = (rows ?? []).some((row) => {
      if (excludeLeadId && row.id === excludeLeadId) return false;
      return normalizePhoneDigits(String(row.phone ?? "")) === p;
    });
    phoneMatch = match;
  }
  return { ok: true, data: { emailMatch, phoneMatch } };
}

export async function moveLeadStatusAction(leadId: string, newStatus: string): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const access = await assertLeadAccess(supabase, session, leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const prev = access.lead.status;
  if (prev === newStatus) return { ok: true };
  const { error } = await supabase.from("os_leads").update({ status: newStatus }).eq("id", leadId);
  if (error) return { ok: false, error: error.message };
  await logLeadActivity(supabase, leadId, "status_changed", `Status: ${prev} → ${newStatus}`);
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

export type LeadUpsertPayload = {
  lead_name: string;
  business_name: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  temperature: string;
  tags: string;
  assigned_user_id: string | null;
};

export async function createLeadAction(payload: LeadUpsertPayload): Promise<ActionResult<{ id: string }>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can create leads." };
  const supabase = await createClient();
  const emailNorm = payload.email?.trim().toLowerCase() || null;
  if (emailNorm && !isValidEmail(emailNorm)) return { ok: false, error: "Invalid email format." };
  const tags = parseTagsInput(payload.tags);
  const row = {
    lead_name: payload.lead_name.trim() || "Untitled",
    business_name: payload.business_name.trim() || "",
    email: emailNorm || null,
    phone: payload.phone?.trim() || null,
    source: payload.source?.trim() || null,
    status: payload.status.trim() || "New",
    temperature: payload.temperature.trim() || "Cold",
    tags,
    assigned_user_id: payload.assigned_user_id || null,
  };
  const { data, error } = await supabase.from("os_leads").insert(row).select("id").single();
  if (error || !data?.id) return { ok: false, error: error?.message ?? "Insert failed." };
  const id = String(data.id);
  await logLeadActivity(supabase, id, "created", `Lead created: ${row.lead_name}`);
  revalidatePath("/dashboard/leads");
  return { ok: true, data: { id } };
}

export async function updateLeadAction(leadId: string, payload: LeadUpsertPayload): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const access = await assertLeadAccess(supabase, session, leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const emailNorm = payload.email?.trim().toLowerCase() || null;
  if (emailNorm && !isValidEmail(emailNorm)) return { ok: false, error: "Invalid email format." };
  const tags = parseTagsInput(payload.tags);
  const updates: Record<string, unknown> = {
    lead_name: payload.lead_name.trim() || "Untitled",
    business_name: payload.business_name.trim() || "",
    email: emailNorm || null,
    phone: payload.phone?.trim() || null,
    source: payload.source?.trim() || null,
    status: payload.status.trim() || "New",
    temperature: payload.temperature.trim() || "Cold",
    tags,
  };
  if (session.isInternal) {
    updates.assigned_user_id = payload.assigned_user_id || null;
  }
  const { error } = await supabase.from("os_leads").update(updates).eq("id", leadId);
  if (error) return { ok: false, error: error.message };
  await logLeadActivity(supabase, leadId, "updated", "Lead details updated");
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

export async function deleteLeadAction(leadId: string): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only administrators can delete leads." };
  const supabase = await createClient();
  await logLeadActivity(supabase, leadId, "deleted", "Lead deleted");
  const { error } = await supabase.from("os_leads").delete().eq("id", leadId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

export async function convertLeadToClientAction(leadId: string): Promise<ActionResult<{ clientId: string }>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can convert to client." };
  const supabase = await createClient();
  const access = await assertLeadAccess(supabase, session, leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const lead = access.lead;
  if (lead.linked_client_id) {
    return { ok: true, data: { clientId: lead.linked_client_id } };
  }
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { ok: false, error: "Server configuration missing for admin operations." };
  }
  const contact = lead.lead_name?.trim() || lead.business_name?.trim() || "Contact";
  const business = lead.business_name?.trim() || lead.lead_name?.trim() || "Business";
  const { data: client, error: cErr } = await admin
    .from("os_clients")
    .insert({
      contact_name: contact,
      business_name: business,
      email: lead.email,
      phone: lead.phone,
      notes: `Created from lead ${leadId}`,
    })
    .select("id")
    .single();
  if (cErr || !client?.id) return { ok: false, error: cErr?.message ?? "Could not create client." };
  const clientId = String(client.id);
  const { error: uErr } = await supabase.from("os_leads").update({ linked_client_id: clientId }).eq("id", leadId);
  if (uErr) return { ok: false, error: uErr.message };
  await logLeadActivity(supabase, leadId, "converted_client", `Linked client ${clientId}`);
  revalidatePath("/dashboard/leads");
  return { ok: true, data: { clientId } };
}

export async function convertLeadToProjectAction(leadId: string): Promise<ActionResult<{ projectId: string }>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can convert to project." };
  const supabase = await createClient();
  const access = await assertLeadAccess(supabase, session, leadId);
  if (!access.ok) return { ok: false, error: access.error };
  const lead = access.lead;
  if (!lead.linked_client_id) {
    return { ok: false, error: "Link or convert this lead to a client first." };
  }
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { ok: false, error: "Server configuration missing for admin operations." };
  }
  const name = `${lead.business_name || lead.lead_name || "Project"} — Onboarding`.slice(0, 200);
  const { data: proj, error: pErr } = await admin
    .from("os_projects")
    .insert({
      project_name: name,
      client_id: lead.linked_client_id,
      status: "Onboarding",
      recurring: false,
      notes: `Created from lead ${leadId}`,
    })
    .select("id")
    .single();
  if (pErr || !proj?.id) return { ok: false, error: pErr?.message ?? "Could not create project." };
  const projectId = String(proj.id);
  await logLeadActivity(supabase, leadId, "converted_project", `Project ${projectId} (Onboarding)`);
  revalidatePath("/dashboard/leads");
  return { ok: true, data: { projectId } };
}
