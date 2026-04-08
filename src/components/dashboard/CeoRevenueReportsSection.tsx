"use client";

import { useCallback, useEffect, useState } from "react";
import { DollarSign, Loader2, Mail, Plus, Trash2 } from "lucide-react";

type ClientRow = {
  id: string;
  name: string | null;
  email: string | null;
  company_id: string | null;
};

type InvoiceRow = {
  id: string;
  invoice_number: string;
  status: string;
  total_cents: number;
  sent_at: string | null;
  created_at: string;
};

type DraftLine = { key: string; description: string; quantity: string; unitDollars: string };

function newLine(): DraftLine {
  return {
    key: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()),
    description: "",
    quantity: "1",
    unitDollars: "",
  };
}

function parseDollarsToCents(s: string): number | null {
  const t = s.trim().replace(/[$,]/g, "");
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function CeoRevenueReportsSection() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [lines, setLines] = useState<DraftLine[]>(() => [newLine(), newLine()]);
  const [taxDollars, setTaxDollars] = useState("");
  const [notes, setNotes] = useState("");

  const loadClients = useCallback(async () => {
    setLoadingClients(true);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (!res.ok) return;
      setClients(Array.isArray(data.clients) ? data.clients : []);
    } catch {
      /* ignore */
    } finally {
      setLoadingClients(false);
    }
  }, []);

  const loadInvoices = useCallback(async (cid: string) => {
    if (!cid) {
      setInvoices([]);
      return;
    }
    setLoadingInvoices(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/invoices?clientId=${encodeURIComponent(cid)}`);
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not load invoices." });
        setInvoices([]);
        return;
      }
      setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
    } catch {
      setInvoices([]);
      setMessage({ type: "err", text: "Could not load invoices." });
    } finally {
      setLoadingInvoices(false);
    }
  }, []);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  useEffect(() => {
    void loadInvoices(clientId);
  }, [clientId, loadInvoices]);

  const selected = clients.find((c) => c.id === clientId);

  const updateLine = (key: string, patch: Partial<DraftLine>) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  };

  const addLine = () => setLines((prev) => [...prev, newLine()]);
  const removeLine = (key: string) =>
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.key !== key)));

  const handleCreateInvoice = async () => {
    if (!clientId) {
      setMessage({ type: "err", text: "Select a client first." });
      return;
    }
    const lineItems = lines
      .map((l) => {
        const qty = Math.floor(Number(l.quantity));
        const unit = parseDollarsToCents(l.unitDollars);
        const desc = l.description.trim();
        return { desc, qty, unit };
      })
      .filter((l) => l.desc && l.qty >= 1 && l.unit != null) as {
      desc: string;
      qty: number;
      unit: number;
    }[];

    if (lineItems.length === 0) {
      setMessage({ type: "err", text: "Add at least one line with description, quantity, and unit price." });
      return;
    }

    const taxCents = taxDollars.trim() ? parseDollarsToCents(taxDollars) : 0;
    if (taxCents === null) {
      setMessage({ type: "err", text: "Tax must be a valid dollar amount." });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          lineItems: lineItems.map((l) => ({
            description: l.desc,
            quantity: l.qty,
            unitPriceCents: l.unit,
          })),
          taxCents,
          notes: notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not create invoice." });
        return;
      }
      setMessage({ type: "ok", text: `Invoice ${data.invoice?.invoice_number ?? ""} created.` });
      setLines([newLine(), newLine()]);
      setTaxDollars("");
      setNotes("");
      await loadInvoices(clientId);
    } catch {
      setMessage({ type: "err", text: "Could not create invoice." });
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (inv: InvoiceRow) => {
    setSendingId(inv.id);
    setMessage(null);
    try {
      const res = await fetch(`/api/invoices/${inv.id}/send`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not send invoice." });
        return;
      }
      setMessage({ type: "ok", text: `Invoice ${inv.invoice_number} emailed to the client.` });
      await loadInvoices(clientId);
    } catch {
      setMessage({ type: "err", text: "Could not send invoice." });
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-neutral-200">
          <DollarSign className="h-4 w-4 text-emerald-700" aria-hidden />
          Revenue reports
        </p>
        <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-neutral-400">
          Create invoices for services rendered and email them to the client. Requires{" "}
          <code className="rounded bg-gray-400/20 px-1 text-xs">RESEND_API_KEY</code> and a client email
          in the CRM.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/15 dark:bg-neutral-800/25 p-2">
        <span className="px-2 text-xs font-semibold text-gray-800 dark:text-neutral-200">Client:</span>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          disabled={loadingClients}
          className="min-w-[220px] rounded-xl border border-gray-400/50 dark:border-neutral-600/55 bg-white/90 py-2 pl-3 pr-8 text-sm font-medium text-gray-900 dark:text-neutral-50 shadow-sm disabled:opacity-60"
        >
          <option value="">{loadingClients ? "Loading…" : "Select a client…"}</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name || c.email || c.id.slice(0, 8)}
            </option>
          ))}
        </select>
        {selected && !selected.email?.trim() && (
          <span className="text-xs font-medium text-amber-800">
            No email on file — add one on the client record before sending.
          </span>
        )}
      </div>

      {message && (
        <p
          className={`rounded-xl px-3 py-2 text-sm ${
            message.type === "ok" ? "bg-emerald-500/15 text-emerald-900" : "bg-red-500/15 text-red-900"
          }`}
          role="status"
        >
          {message.text}
        </p>
      )}

      {clientId && (
        <div className="rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-white/50 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-50">Create invoice</h3>
          <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">Line totals use quantity × unit price (USD).</p>

          <div className="mt-3 space-y-2">
            {lines.map((line) => (
              <div key={line.key} className="flex flex-wrap items-end gap-2">
                <label className="min-w-[180px] flex-1">
                  <span className="sr-only">Description</span>
                  <input
                    type="text"
                    placeholder="Service / description"
                    value={line.description}
                    onChange={(e) => updateLine(line.key, { description: e.target.value })}
                    className="w-full rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="w-20">
                  <span className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 dark:text-neutral-500">Qty</span>
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) => updateLine(line.key, { quantity: e.target.value })}
                    className="w-full rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white px-2 py-2 text-sm"
                  />
                </label>
                <label className="w-28">
                  <span className="mb-1 block text-[10px] font-semibold uppercase text-gray-500 dark:text-neutral-500">Unit $</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={line.unitDollars}
                    onChange={(e) => updateLine(line.key, { unitDollars: e.target.value })}
                    className="w-full rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white px-2 py-2 text-sm"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeLine(line.key)}
                  className="rounded-lg p-2 text-gray-500 dark:text-neutral-500 hover:bg-gray-200/60 hover:text-red-700"
                  aria-label="Remove line"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addLine}
            className="mt-2 inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-400/60 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100/80"
          >
            <Plus className="h-3.5 w-3.5" />
            Add line
          </button>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs font-semibold text-gray-700 dark:text-neutral-300">Tax (USD, optional)</span>
              <input
                type="text"
                inputMode="decimal"
                value={taxDollars}
                onChange={(e) => setTaxDollars(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-gray-700 dark:text-neutral-300">Notes (optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Payment terms, PO number, etc."
                className="w-full rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => void handleCreateInvoice()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create invoice
          </button>
        </div>
      )}

      {clientId && (
        <div className="rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/10 dark:bg-neutral-800/25 p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-50">Invoices for this client</h3>
          {loadingInvoices ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </p>
          ) : invoices.length === 0 ? (
            <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400">No invoices yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-400/30">
              {invoices.map((inv) => (
                <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-neutral-50">
                      {inv.invoice_number}{" "}
                      <span className="font-normal text-gray-600 dark:text-neutral-400">· {formatUsd(inv.total_cents)}</span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-neutral-400">
                      Status: {inv.status}
                      {inv.sent_at ? ` · sent ${new Date(inv.sent_at).toLocaleString()}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {inv.status !== "paid" && inv.status !== "void" && (
                      <button
                        type="button"
                        disabled={!!sendingId || !selected?.email?.trim()}
                        onClick={() => void handleSend(inv)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title={!selected?.email?.trim() ? "Client needs an email address" : undefined}
                      >
                        {sendingId === inv.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Mail className="h-3.5 w-3.5" />
                        )}
                        {inv.status === "draft" ? "Send to client" : "Resend"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!clientId && (
        <div className="rounded-2xl border border-dashed border-gray-400/50 dark:border-neutral-600/55 bg-gray-300/10 dark:bg-neutral-800/25 px-6 py-8 text-center">
          <p className="text-sm text-gray-700 dark:text-neutral-300">Choose a client to create and view invoices.</p>
        </div>
      )}
    </div>
  );
}
