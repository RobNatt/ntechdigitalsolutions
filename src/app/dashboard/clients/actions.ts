"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOsSession } from "@/lib/os/get-os-settings";
import { logOsActivity } from "@/lib/os/log-os-activity";
import { mapOsClientRow, type OsClientRow } from "@/lib/os/os-entity-types";

export type ActionResult<T = void> = { ok: true; data?: T } | { ok: false; error: string };

export type ClientUpsertPayload = {
  contact_name: string;
  business_name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
};

async function assertClientAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  session: NonNullable<Awaited<ReturnType<typeof getOsSession>>>,
  clientId: string
): Promise<{ ok: true; row: OsClientRow } | { ok: false; error: string }> {
  const { data, error } = await supabase.from("os_clients").select("*").eq("id", clientId).maybeSingle();
  if (error || !data) return { ok: false, error: "Client not found." };
  const row = mapOsClientRow(data as Record<string, unknown>);
  if (session.isInternal) return { ok: true, row };
  if (session.profile?.os_client_id === row.id) return { ok: true, row };
  return { ok: false, error: "Not allowed." };
}

export async function createClientAction(payload: ClientUpsertPayload): Promise<ActionResult<{ id: string }>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can add clients." };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("os_clients")
    .insert({
      contact_name: payload.contact_name.trim(),
      business_name: payload.business_name.trim(),
      email: payload.email?.trim() || null,
      phone: payload.phone?.trim() || null,
      notes: payload.notes?.trim() || null,
    })
    .select("id")
    .single();
  if (error || !data?.id) return { ok: false, error: error?.message ?? "Insert failed." };
  const id = String(data.id);
  await logOsActivity(supabase, "os_client", id, "created", `Client: ${payload.contact_name.trim() || payload.business_name.trim()}`);
  revalidatePath("/dashboard/clients");
  return { ok: true, data: { id } };
}

export async function updateClientAction(clientId: string, payload: ClientUpsertPayload): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const access = await assertClientAccess(supabase, session, clientId);
  if (!access.ok) return { ok: false, error: access.error };
  const { error } = await supabase
    .from("os_clients")
    .update({
      contact_name: payload.contact_name.trim(),
      business_name: payload.business_name.trim(),
      email: payload.email?.trim() || null,
      phone: payload.phone?.trim() || null,
      notes: payload.notes?.trim() || null,
    })
    .eq("id", clientId);
  if (error) return { ok: false, error: error.message };
  await logOsActivity(
    supabase,
    "os_client",
    clientId,
    "updated",
    `Updated ${payload.contact_name.trim() || payload.business_name.trim()}`
  );
  revalidatePath("/dashboard/clients");
  return { ok: true };
}

export async function deleteClientAction(clientId: string): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can delete clients." };
  const supabase = await createClient();
  const access = await assertClientAccess(supabase, session, clientId);
  if (!access.ok) return { ok: false, error: access.error };
  const label = access.row.contact_name || access.row.business_name || clientId;
  const { error } = await supabase.from("os_clients").delete().eq("id", clientId);
  if (error) return { ok: false, error: error.message };
  await logOsActivity(supabase, "os_client", clientId, "deleted", `Removed client: ${label}`);
  revalidatePath("/dashboard/clients");
  return { ok: true };
}
