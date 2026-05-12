"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOsSession } from "@/lib/os/get-os-settings";
import { logOsActivity } from "@/lib/os/log-os-activity";
import { mapOsProjectRow, type OsProjectRow } from "@/lib/os/os-entity-types";

export type ActionResult<T = void> = { ok: true; data?: T } | { ok: false; error: string };

export type ProjectUpsertPayload = {
  project_name: string;
  client_id: string;
  status: string;
  start_date: string | null;
  due_date: string | null;
  recurring: boolean;
  notes: string | null;
};

async function assertProjectAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  session: NonNullable<Awaited<ReturnType<typeof getOsSession>>>,
  projectId: string
): Promise<{ ok: true; row: OsProjectRow } | { ok: false; error: string }> {
  const { data, error } = await supabase.from("os_projects").select("*").eq("id", projectId).maybeSingle();
  if (error || !data) return { ok: false, error: "Project not found." };
  const row = mapOsProjectRow(data as Record<string, unknown>);
  if (session.isInternal) return { ok: true, row };
  if (session.profile?.os_client_id && row.client_id === session.profile.os_client_id) return { ok: true, row };
  return { ok: false, error: "Not allowed." };
}

export async function createProjectAction(payload: ProjectUpsertPayload): Promise<ActionResult<{ id: string }>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can create projects." };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("os_projects")
    .insert({
      project_name: payload.project_name.trim(),
      client_id: payload.client_id,
      status: payload.status.trim() || "Onboarding",
      recurring: payload.recurring,
      start_date: payload.start_date || null,
      due_date: payload.due_date || null,
      notes: payload.notes?.trim() || null,
    })
    .select("id")
    .single();
  if (error || !data?.id) return { ok: false, error: error?.message ?? "Insert failed." };
  const id = String(data.id);
  await logOsActivity(supabase, "os_project", id, "created", `Project: ${payload.project_name.trim()}`);
  revalidatePath("/dashboard/projects");
  return { ok: true, data: { id } };
}

export async function updateProjectAction(projectId: string, payload: ProjectUpsertPayload): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const access = await assertProjectAccess(supabase, session, projectId);
  if (!access.ok) return { ok: false, error: access.error };
  const clientId = session.isInternal ? payload.client_id : access.row.client_id;
  if (!session.isInternal && payload.client_id !== access.row.client_id) {
    return { ok: false, error: "Cannot reassign project client." };
  }
  const { error } = await supabase
    .from("os_projects")
    .update({
      project_name: payload.project_name.trim(),
      client_id: clientId,
      status: payload.status.trim() || access.row.status,
      recurring: payload.recurring,
      start_date: payload.start_date || null,
      due_date: payload.due_date || null,
      notes: payload.notes?.trim() || null,
    })
    .eq("id", projectId);
  if (error) return { ok: false, error: error.message };
  await logOsActivity(supabase, "os_project", projectId, "updated", `Project: ${payload.project_name.trim()}`);
  revalidatePath("/dashboard/projects");
  return { ok: true };
}

export async function updateProjectStatusAction(projectId: string, newStatus: string): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const access = await assertProjectAccess(supabase, session, projectId);
  if (!access.ok) return { ok: false, error: access.error };
  const prev = access.row.status;
  if (prev === newStatus) return { ok: true };
  const { error } = await supabase.from("os_projects").update({ status: newStatus }).eq("id", projectId);
  if (error) return { ok: false, error: error.message };
  await logOsActivity(supabase, "os_project", projectId, "status_changed", `Status: ${prev} → ${newStatus}`);
  revalidatePath("/dashboard/projects");
  return { ok: true };
}

export async function deleteProjectAction(projectId: string): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can delete projects." };
  const supabase = await createClient();
  const access = await assertProjectAccess(supabase, session, projectId);
  if (!access.ok) return { ok: false, error: access.error };
  const { error } = await supabase.from("os_projects").delete().eq("id", projectId);
  if (error) return { ok: false, error: error.message };
  await logOsActivity(supabase, "os_project", projectId, "deleted", `Removed: ${access.row.project_name}`);
  revalidatePath("/dashboard/projects");
  return { ok: true };
}
