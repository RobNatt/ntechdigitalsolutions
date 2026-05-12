"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createClientAction,
  deleteClientAction,
  updateClientAction,
  type ClientUpsertPayload,
} from "@/app/dashboard/clients/actions";
import type { OsClientRow } from "@/lib/os/os-entity-types";
import { cn } from "@/lib/utils";

type ClientsPageClientProps = {
  initialClients: OsClientRow[];
  brandColor: string;
  isInternal: boolean;
};

function emptyForm(): ClientUpsertPayload {
  return {
    contact_name: "",
    business_name: "",
    email: null,
    phone: null,
    notes: null,
  };
}

export function ClientsPageClient({ initialClients, brandColor, isInternal }: ClientsPageClientProps) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"closed" | "create" | { edit: OsClientRow }>("closed");
  const [form, setForm] = useState<ClientUpsertPayload>(emptyForm());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      const blob = [c.contact_name, c.business_name, c.email, c.phone, c.notes].filter(Boolean).join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [clients, search]);

  function openCreate() {
    setErr(null);
    setForm(emptyForm());
    setModal("create");
  }

  function openEdit(c: OsClientRow) {
    setErr(null);
    setForm({
      contact_name: c.contact_name,
      business_name: c.business_name,
      email: c.email,
      phone: c.phone,
      notes: c.notes,
    });
    setModal({ edit: c });
  }

  async function submit() {
    setErr(null);
    setBusy(true);
    try {
      if (modal === "create") {
        const r = await createClientAction(form);
        if (!r.ok) setErr(r.error);
        else {
          setModal("closed");
          refresh();
        }
      } else if (typeof modal === "object" && "edit" in modal) {
        const r = await updateClientAction(modal.edit.id, form);
        if (!r.ok) setErr(r.error);
        else {
          setModal("closed");
          refresh();
        }
      }
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(c: OsClientRow) {
    if (!isInternal) return;
    if (!window.confirm(`Delete client ${c.contact_name || c.business_name}?`)) return;
    startTransition(async () => {
      const r = await deleteClientAction(c.id);
      if (!r.ok) alert(r.error);
      else refresh();
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Clients</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
            Directory of businesses and primary contacts
          </p>
        </div>
        {isInternal ? (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: brandColor }}
          >
            Add Client
          </button>
        ) : null}
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/60">
                <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{c.contact_name || "—"}</td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{c.business_name || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline dark:text-neutral-200"
                  >
                    Edit
                  </button>
                  {isInternal ? (
                    <button
                      type="button"
                      onClick={() => void onDelete(c)}
                      className="ml-3 text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      Delete
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-neutral-500">No clients match your search.</p>
        ) : null}
      </div>

      {modal !== "closed" ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-950">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {modal === "create" ? "Add client" : "Edit client"}
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
              <Field label="Contact name">
                <input
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.contact_name}
                  onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
                />
              </Field>
              <Field label="Business name">
                <input
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.business_name}
                  onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
                />
              </Field>
              <Field label="Email">
                <input
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.email ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value || null }))}
                />
              </Field>
              <Field label="Phone">
                <input
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.phone ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value || null }))}
                />
              </Field>
              <Field label="Notes">
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.notes ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value || null }))}
                />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal("closed")}
                className={cn("rounded-lg px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300")}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
      {label}
      {children}
    </label>
  );
}
