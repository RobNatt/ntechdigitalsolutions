"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOsSession } from "@/lib/os/get-os-settings";
import { logOsActivity } from "@/lib/os/log-os-activity";
import { mapOsEventRow, type OsEventRow } from "@/lib/os/os-entity-types";

export type ActionResult<T = void> = { ok: true; data?: T } | { ok: false; error: string };

export type EventUpsertPayload = {
  title: string;
  date_start: string;
  date_end: string;
  event_type: string;
  status: string;
  meeting_link: string | null;
  related_lead_id: string | null;
  related_client_id: string | null;
};

async function assertEventAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  session: NonNullable<Awaited<ReturnType<typeof getOsSession>>>,
  eventId: string
): Promise<{ ok: true; row: OsEventRow } | { ok: false; error: string }> {
  const { data, error } = await supabase.from("os_events").select("*").eq("id", eventId).maybeSingle();
  if (error || !data) return { ok: false, error: "Event not found." };
  const row = mapOsEventRow(data as Record<string, unknown>);
  if (session.isInternal) return { ok: true, row };
  const cid = session.profile?.os_client_id;
  if (row.created_by_user_id === session.userId) return { ok: true, row };
  if (cid && row.related_client_id === cid) return { ok: true, row };
  return { ok: false, error: "Not allowed." };
}

export async function createEventAction(payload: EventUpsertPayload): Promise<ActionResult<{ id: string }>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const cid = session.profile?.os_client_id ?? null;
  if (!session.isInternal) {
    if (payload.related_client_id && !cid) {
      return { ok: false, error: "Invalid related client." };
    }
    if (payload.related_client_id && cid && payload.related_client_id !== cid) {
      return { ok: false, error: "Invalid related client." };
    }
  }
  const { data, error } = await supabase
    .from("os_events")
    .insert({
      title: payload.title.trim(),
      date_start: payload.date_start,
      date_end: payload.date_end,
      event_type: payload.event_type.trim() || "Meeting",
      status: payload.status.trim() || "Confirmed",
      meeting_link: payload.meeting_link?.trim() || null,
      related_lead_id: session.isInternal ? payload.related_lead_id : null,
      related_client_id: payload.related_client_id,
      created_by_user_id: session.userId,
    })
    .select("id")
    .single();
  if (error || !data?.id) return { ok: false, error: error?.message ?? "Insert failed." };
  const id = String(data.id);
  await logOsActivity(supabase, "os_event", id, "created", payload.title.trim() || "Event");
  revalidatePath("/dashboard/calendar");
  return { ok: true, data: { id } };
}

export async function updateEventAction(eventId: string, payload: EventUpsertPayload): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const access = await assertEventAccess(supabase, session, eventId);
  if (!access.ok) return { ok: false, error: access.error };
  const cid = session.profile?.os_client_id ?? null;
  if (!session.isInternal) {
    if (payload.related_client_id && cid && payload.related_client_id !== cid) {
      return { ok: false, error: "Invalid related client." };
    }
    if (payload.related_client_id && !cid) {
      return { ok: false, error: "Invalid related client." };
    }
  }
  const { error } = await supabase
    .from("os_events")
    .update({
      title: payload.title.trim(),
      date_start: payload.date_start,
      date_end: payload.date_end,
      event_type: payload.event_type.trim() || "Meeting",
      status: payload.status.trim() || "Confirmed",
      meeting_link: payload.meeting_link?.trim() || null,
      related_lead_id: session.isInternal ? payload.related_lead_id : access.row.related_lead_id,
      related_client_id: payload.related_client_id,
    })
    .eq("id", eventId);
  if (error) return { ok: false, error: error.message };
  await logOsActivity(supabase, "os_event", eventId, "updated", payload.title.trim() || "Event");
  revalidatePath("/dashboard/calendar");
  return { ok: true };
}

export async function deleteEventAction(eventId: string): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can delete events." };
  const supabase = await createClient();
  const access = await assertEventAccess(supabase, session, eventId);
  if (!access.ok) return { ok: false, error: access.error };
  const { error } = await supabase.from("os_events").delete().eq("id", eventId);
  if (error) return { ok: false, error: error.message };
  await logOsActivity(supabase, "os_event", eventId, "deleted", access.row.title || "Event");
  revalidatePath("/dashboard/calendar");
  return { ok: true };
}
