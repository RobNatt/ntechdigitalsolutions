"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createPaymentAction,
  deletePaymentAction,
  listPaymentsInRangeAction,
  updatePaymentAction,
  type PaymentUpsertPayload,
} from "@/app/dashboard/revenue/actions";
import { formatOsCurrency } from "@/lib/os/format-os-currency";
import {
  currentWallYmdParts,
  getMonthRangeYmd,
  getYearRangeYmd,
} from "@/lib/os/os-revenue-range";
import type { OsClientRow, OsPaymentRow } from "@/lib/os/os-entity-types";
import { cn } from "@/lib/utils";

type RevenuePageClientProps = {
  initialPayments: OsPaymentRow[];
  initialFrom: string;
  initialTo: string;
  initialTotal: number;
  clients: OsClientRow[];
  currency: string;
  timeZone: string;
  paymentMethods: string[];
  isInternal: boolean;
  brandColor: string;
};

function clientLabel(clients: OsClientRow[], id: string): string {
  const c = clients.find((x) => x.id === id);
  if (!c) return id.slice(0, 8) + "…";
  return c.business_name?.trim() || c.contact_name?.trim() || id.slice(0, 8);
}

export function RevenuePageClient({
  initialPayments,
  initialFrom,
  initialTo,
  initialTotal,
  clients,
  currency,
  timeZone,
  paymentMethods,
  isInternal,
  brandColor,
}: RevenuePageClientProps) {
  const router = useRouter();
  const [payments, setPayments] = useState(initialPayments);
  const [total, setTotal] = useState(initialTotal);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [mode, setMode] = useState<"monthly" | "yearly" | "custom">("monthly");
  const [customFrom, setCustomFrom] = useState(initialFrom);
  const [customTo, setCustomTo] = useState(initialTo);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<"closed" | "create" | { edit: OsPaymentRow }>("closed");
  const [form, setForm] = useState<PaymentUpsertPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setPayments(initialPayments);
    setTotal(initialTotal);
    setFrom(initialFrom);
    setTo(initialTo);
    setCustomFrom(initialFrom);
    setCustomTo(initialTo);
  }, [initialPayments, initialTotal, initialFrom, initialTo]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const loadRange = useCallback(async (f: string, t: string) => {
    setLoading(true);
    try {
      const r = await listPaymentsInRangeAction(f, t);
      if (r.ok && r.data) {
        setPayments(r.data.items);
        setTotal(r.data.total);
        setFrom(f);
        setTo(t);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  function applyMonthly() {
    const { y, m } = currentWallYmdParts(timeZone);
    const r = getMonthRangeYmd(y, m);
    void loadRange(r.from, r.to);
    setMode("monthly");
  }

  function applyYearly() {
    const { y } = currentWallYmdParts(timeZone);
    const r = getYearRangeYmd(y);
    void loadRange(r.from, r.to);
    setMode("yearly");
  }

  function applyCustom() {
    void loadRange(customFrom, customTo);
    setMode("custom");
  }

  function openCreate() {
    setErr(null);
    setForm({
      client_id: clients[0]?.id ?? "",
      amount: 0,
      method: paymentMethods[0] ?? "Other",
      date: from,
      notes: null,
    });
    setModal("create");
  }

  function openEdit(p: OsPaymentRow) {
    setErr(null);
    setForm({
      client_id: p.client_id,
      amount: p.amount,
      method: p.method,
      date: p.date,
      notes: p.notes,
    });
    setModal({ edit: p });
  }

  async function submit() {
    if (!form) return;
    setErr(null);
    setBusy(true);
    try {
      if (modal === "create") {
        const r = await createPaymentAction(form);
        if (!r.ok) setErr(r.error);
        else {
          setModal("closed");
          await loadRange(from, to);
          refresh();
        }
      } else if (typeof modal === "object" && "edit" in modal) {
        const r = await updatePaymentAction(modal.edit.id, form);
        if (!r.ok) setErr(r.error);
        else {
          setModal("closed");
          await loadRange(from, to);
          refresh();
        }
      }
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(p: OsPaymentRow) {
    if (!confirm("Delete this payment?")) return;
    startTransition(async () => {
      const r = await deletePaymentAction(p.id);
      if (!r.ok) alert(r.error);
      else {
        await loadRange(from, to);
        refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Revenue</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
            Track payments and analytics
          </p>
        </div>
        {isInternal ? (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: brandColor }}
          >
            Add Payment
          </button>
        ) : null}
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applyMonthly}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium",
              mode === "monthly"
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                : "border-neutral-300 dark:border-neutral-600"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={applyYearly}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium",
              mode === "yearly"
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                : "border-neutral-300 dark:border-neutral-600"
            )}
          >
            Yearly
          </button>
          <span className="self-center text-sm text-neutral-500">Custom range</span>
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-600 dark:bg-neutral-900"
          />
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-600 dark:bg-neutral-900"
          />
          <button
            type="button"
            onClick={applyCustom}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium dark:border-neutral-600"
          >
            Apply
          </button>
        </div>
        <p className="text-xs text-neutral-500">
          Range: {from} → {to}
          {loading ? " · Loading…" : ""}
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Total in range</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-neutral-900 dark:text-white">
          {formatOsCurrency(total, currency)}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/60">
                <td className="px-4 py-3">{clientLabel(clients, p.client_id)}</td>
                <td className="px-4 py-3 tabular-nums font-medium">{formatOsCurrency(p.amount, currency)}</td>
                <td className="px-4 py-3">{p.method}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{p.date}</td>
                <td className="px-4 py-3 text-right">
                  {isInternal ? (
                    <>
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline dark:text-neutral-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(p)}
                        className="ml-3 text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-neutral-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 ? (
          <p className="p-6 text-center text-sm text-neutral-500">No payments in this range.</p>
        ) : null}
      </div>

      {modal !== "closed" && form && isInternal ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-950">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {modal === "create" ? "Add payment" : "Edit payment"}
              </h2>
              <button
                type="button"
                onClick={() => setModal("closed")}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            </div>
            {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Client
                <select
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.client_id}
                  onChange={(e) => setForm((f) => (f ? { ...f, client_id: e.target.value } : f))}
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {clientLabel(clients, c.id)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Amount
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={Number.isFinite(form.amount) ? form.amount : 0}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, amount: parseFloat(e.target.value) || 0 } : f))
                  }
                />
              </label>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Method
                <select
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.method}
                  onChange={(e) => setForm((f) => (f ? { ...f, method: e.target.value } : f))}
                >
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Date
                <input
                  type="date"
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.date}
                  onChange={(e) => setForm((f) => (f ? { ...f, date: e.target.value } : f))}
                />
              </label>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Notes
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.notes ?? ""}
                  onChange={(e) => setForm((f) => (f ? { ...f, notes: e.target.value || null } : f))}
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal("closed")}
                className="rounded-lg px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void submit()}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: brandColor }}
              >
                {busy ? "Saving…" : modal === "create" ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
