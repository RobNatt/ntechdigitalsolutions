"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOsSession } from "@/lib/os/get-os-settings";
import { logOsActivity } from "@/lib/os/log-os-activity";
import { mapOsPaymentRow, type OsPaymentRow } from "@/lib/os/os-entity-types";

export type ActionResult<T = void> = { ok: true; data?: T } | { ok: false; error: string };

export type PaymentUpsertPayload = {
  client_id: string;
  amount: number;
  method: string;
  date: string;
  notes: string | null;
};

async function assertPaymentAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  session: NonNullable<Awaited<ReturnType<typeof getOsSession>>>,
  paymentId: string
): Promise<{ ok: true; row: OsPaymentRow } | { ok: false; error: string }> {
  const { data, error } = await supabase.from("os_payments").select("*").eq("id", paymentId).maybeSingle();
  if (error || !data) return { ok: false, error: "Payment not found." };
  const row = mapOsPaymentRow(data as Record<string, unknown>);
  if (session.isInternal) return { ok: true, row };
  if (session.profile?.os_client_id && row.client_id === session.profile.os_client_id) return { ok: true, row };
  return { ok: false, error: "Not allowed." };
}

export async function listPaymentsInRangeAction(from: string, to: string): Promise<ActionResult<{ items: OsPaymentRow[]; total: number }>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("os_payments")
    .select("*")
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false })
    .limit(2000);
  if (error) return { ok: false, error: error.message };
  const items = (data ?? []).map((r) => mapOsPaymentRow(r as Record<string, unknown>));
  const total = items.reduce((s, p) => s + p.amount, 0);
  return { ok: true, data: { items, total } };
}

export async function createPaymentAction(payload: PaymentUpsertPayload): Promise<ActionResult<{ id: string }>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can add payments." };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("os_payments")
    .insert({
      client_id: payload.client_id,
      amount: payload.amount,
      method: payload.method.trim() || "Other",
      date: payload.date,
      notes: payload.notes?.trim() || null,
    })
    .select("id")
    .single();
  if (error || !data?.id) return { ok: false, error: error?.message ?? "Insert failed." };
  const id = String(data.id);
  await logOsActivity(supabase, "os_payment", id, "created", `Amount ${payload.amount} on ${payload.date}`);
  revalidatePath("/dashboard/revenue");
  return { ok: true, data: { id } };
}

export async function updatePaymentAction(paymentId: string, payload: PaymentUpsertPayload): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can edit payments." };
  const supabase = await createClient();
  const access = await assertPaymentAccess(supabase, session, paymentId);
  if (!access.ok) return { ok: false, error: access.error };
  const { error } = await supabase
    .from("os_payments")
    .update({
      client_id: payload.client_id,
      amount: payload.amount,
      method: payload.method.trim() || "Other",
      date: payload.date,
      notes: payload.notes?.trim() || null,
    })
    .eq("id", paymentId);
  if (error) return { ok: false, error: error.message };
  await logOsActivity(supabase, "os_payment", paymentId, "updated", `Payment ${payload.date}`);
  revalidatePath("/dashboard/revenue");
  return { ok: true };
}

export async function deletePaymentAction(paymentId: string): Promise<ActionResult> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can delete payments." };
  const supabase = await createClient();
  const access = await assertPaymentAccess(supabase, session, paymentId);
  if (!access.ok) return { ok: false, error: access.error };
  const { error } = await supabase.from("os_payments").delete().eq("id", paymentId);
  if (error) return { ok: false, error: error.message };
  await logOsActivity(supabase, "os_payment", paymentId, "deleted", "Payment removed");
  revalidatePath("/dashboard/revenue");
  return { ok: true };
}
