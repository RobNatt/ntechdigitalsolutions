"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Upload, UserPlus, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { PIPELINE_STAGES, stageLabel } from "@/lib/leads/stages";

type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  source: string | null;
  lead_type: string | null;
  stage: string | null;
  client_id: string | null;
  details: unknown;
  created_at: string;
};

type Draft = {
  name: string;
  email: string;
  phone: string;
  address: string;
  source: string;
  lead_type: string;
  stage: string;
  notes: string;
};

function notesFromDetails(details: unknown): string {
  if (details && typeof details === "object" && !Array.isArray(details)) {
    const n = (details as { notes?: unknown }).notes;
    if (typeof n === "string") return n;
  }
  return "";
}

function leadToDraft(lead: LeadRow): Draft {
  return {
    name: lead.name ?? "",
    email: lead.email ?? "",
    phone: lead.phone ?? "",
    address: lead.address ?? "",
    source: lead.source ?? "",
    lead_type: lead.lead_type ?? "homeowner",
    stage: lead.stage ?? "submitted",
    notes: notesFromDetails(lead.details),
  };
}

function draftsEqual(a: Draft, b: Draft): boolean {
  return (
    a.name === b.name &&
    a.email === b.email &&
    a.phone === b.phone &&
    a.address === b.address &&
    a.source === b.source &&
    a.lead_type === b.lead_type &&
    a.stage === b.stage &&
    a.notes === b.notes
  );
}

export function CeoLeadsSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [baseline, setBaseline] = useState<Draft | null>(null);

  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedId) ?? null,
    [leads, selectedId]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads?limit=200");
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load leads.");
        setLeads([]);
        return;
      }
      const list = Array.isArray(data.leads) ? data.leads : [];
      setLeads(list);
    } catch {
      setError("Failed to load leads.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!selectedLead) {
      setDraft(null);
      setBaseline(null);
      return;
    }
    const d = leadToDraft(selectedLead);
    setDraft(d);
    setBaseline(d);
  }, [selectedLead]);

  const dirty = draft && baseline ? !draftsEqual(draft, baseline) : false;

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function saveLead() {
    if (!selectedId || !draft) return;
    setSaving(true);
    setError(null);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/leads/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          email: draft.email,
          phone: draft.phone,
          address: draft.address,
          source: draft.source || "unknown",
          lead_type: draft.lead_type,
          stage: draft.stage,
          notes: draft.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Save failed.");
        return;
      }
      setBaseline(draft);
      setActionMessage("Saved.");
      await load();
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function pushToClient(retriggerOnboarding = false) {
    if (!selectedId) return;
    if (
      !retriggerOnboarding &&
      draft &&
      baseline &&
      !draftsEqual(draft, baseline)
    ) {
      setError("Save your changes before pushing to clients.");
      return;
    }
    setPushing(true);
    setError(null);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/leads/${selectedId}/push-to-client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retriggerOnboarding }),
      });
      const data = await res.json();
      if (res.status === 409 && data.code === "ALREADY_LINKED") {
        setError(
          "This lead is already linked to a client. Use “Re-run onboarding” to queue the sequence again."
        );
        return;
      }
      if (!res.ok && res.status !== 207) {
        setError(typeof data.error === "string" ? data.error : "Push to clients failed.");
        return;
      }
      if (data.onboardingRetriggered) {
        setActionMessage("Onboarding queued again for this client.");
      } else if (data.warning) {
        setActionMessage(String(data.warning));
      } else {
        setActionMessage(
          "Client created, lead marked won, and onboarding sequence queued. Next: automate steps in onboarding."
        );
      }
      await load();
      if (baseline && draft) setBaseline(draft);
    } catch {
      setError("Push to clients failed.");
    } finally {
      setPushing(false);
    }
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImporting(true);
    setImportMessage(null);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/leads/import", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Import failed.");
        return;
      }
      const n = typeof data.imported === "number" ? data.imported : 0;
      const skipped =
        typeof data.skippedEmpty === "number" && data.skippedEmpty > 0
          ? ` (${data.skippedEmpty} empty rows skipped)`
          : "";
      setImportMessage(`Imported ${n} lead${n === 1 ? "" : "s"}${skipped}.`);
      await load();
    } catch {
      setError("Import failed.");
    } finally {
      setImporting(false);
    }
  }

  const canPush =
    Boolean(draft) &&
    Boolean(
      (draft?.name && draft.name.trim()) ||
        (draft?.email && draft.email.trim()) ||
        (draft?.phone && draft.phone.trim())
    );

  const inputClass =
    "mt-1 w-full rounded-md border border-gray-400/45 bg-white/90 px-2.5 py-1.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-sky-500/60 focus:outline-none focus:ring-1 focus:ring-sky-500/40";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
        <p className="max-w-xl text-sm text-gray-600">
          Select a row to edit fields, update pipeline stage, or push a won lead to{" "}
          <span className="font-medium text-gray-800">Clients</span> and queue onboarding. Import
          from Excel still uses the first sheet with headers (
          <span className="font-medium text-gray-800">Name</span>,{" "}
          <span className="font-medium text-gray-800">Email</span>,{" "}
          <span className="font-medium text-gray-800">Phone</span>, etc.).
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="sr-only"
            onChange={onFileSelected}
          />
          <button
            type="button"
            disabled={importing}
            onClick={() => fileRef.current?.click()}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-100/80 px-3 py-2 text-xs font-semibold text-sky-900 shadow-sm hover:bg-sky-200/80 disabled:opacity-50"
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            {importing ? "Importing…" : "Import Excel"}
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-gray-400/50 bg-gray-200/40 px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-300/50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      {importMessage && (
        <p className="rounded-lg border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {importMessage}
        </p>
      )}
      {actionMessage && (
        <p className="rounded-lg border border-sky-300/60 bg-sky-50 px-3 py-2 text-sm text-sky-950">
          {actionMessage}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
        <div className="overflow-hidden rounded-2xl border border-gray-400/40 bg-gray-300/20 shadow-inner backdrop-blur-sm">
          <div className="border-b border-gray-400/30 px-4 py-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
              Leads pipeline
            </h3>
          </div>
          <div className="max-h-[min(52vh,480px)] overflow-auto">
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-gray-600">Loading…</p>
            ) : leads.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-gray-600">
                No leads yet. Import a spreadsheet or capture leads from your public forms.
              </p>
            ) : (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="sticky top-0 z-[1] bg-gray-300/95 shadow-sm">
                  <tr className="border-b border-gray-400/25 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-700">
                    <th className="px-3 py-2.5">Name</th>
                    <th className="px-3 py-2.5">Email</th>
                    <th className="px-3 py-2.5">Phone</th>
                    <th className="px-3 py-2.5">Stage</th>
                    <th className="px-3 py-2.5">Client</th>
                    <th className="px-3 py-2.5">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const isSel = lead.id === selectedId;
                    return (
                      <tr
                        key={lead.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedId(lead.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedId(lead.id);
                          }
                        }}
                        className={cn(
                          "cursor-pointer border-b border-gray-400/20 last:border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50",
                          isSel ? "bg-sky-100/50" : "hover:bg-gray-400/10"
                        )}
                      >
                        <td className="px-3 py-2 font-medium text-gray-900">
                          {lead.name || "—"}
                        </td>
                        <td className="max-w-[140px] truncate px-3 py-2 text-gray-700">
                          {lead.email || "—"}
                        </td>
                        <td className="px-3 py-2 text-gray-700 tabular-nums">{lead.phone || "—"}</td>
                        <td className="px-3 py-2">
                          <span className="inline-flex rounded-md border border-gray-400/50 bg-gray-100/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-800">
                            {stageLabel(lead.stage || "submitted")}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {lead.client_id ? (
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                              Linked
                            </span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600 tabular-nums">
                          {lead.created_at
                            ? new Date(lead.created_at).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-400/40 bg-gray-300/25 p-4 shadow-inner backdrop-blur-sm lg:sticky lg:top-0">
          {!selectedLead || !draft ? (
            <p className="text-center text-sm text-gray-600">
              Select a lead in the table to edit details and push to clients.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Edit lead</h3>
                <p className="mt-0.5 text-xs text-gray-600">
                  Changes apply to this CRM record only.
                </p>
              </div>

              <label className="block text-xs font-semibold text-gray-700">
                Name
                <input
                  className={inputClass}
                  value={draft.name}
                  onChange={(e) => updateDraft("name", e.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="block text-xs font-semibold text-gray-700">
                Email
                <input
                  type="email"
                  className={inputClass}
                  value={draft.email}
                  onChange={(e) => updateDraft("email", e.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="block text-xs font-semibold text-gray-700">
                Phone
                <input
                  className={inputClass}
                  value={draft.phone}
                  onChange={(e) => updateDraft("phone", e.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="block text-xs font-semibold text-gray-700">
                Address
                <input
                  className={inputClass}
                  value={draft.address}
                  onChange={(e) => updateDraft("address", e.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="block text-xs font-semibold text-gray-700">
                Source
                <input
                  className={inputClass}
                  value={draft.source}
                  onChange={(e) => updateDraft("source", e.target.value)}
                  placeholder="e.g. excel_import, SEO"
                  autoComplete="off"
                />
              </label>
              <label className="block text-xs font-semibold text-gray-700">
                Lead type
                <input
                  className={inputClass}
                  value={draft.lead_type}
                  onChange={(e) => updateDraft("lead_type", e.target.value)}
                  placeholder="homeowner, commercial…"
                  autoComplete="off"
                />
              </label>
              <label className="block text-xs font-semibold text-gray-700">
                Pipeline stage
                <select
                  className={cn(inputClass, "cursor-pointer")}
                  value={draft.stage}
                  onChange={(e) => updateDraft("stage", e.target.value)}
                >
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {stageLabel(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-gray-700">
                Notes
                <textarea
                  className={cn(inputClass, "min-h-[88px] resize-y")}
                  value={draft.notes}
                  onChange={(e) => updateDraft("notes", e.target.value)}
                  placeholder="Internal notes…"
                  rows={4}
                />
              </label>

              <div className="flex flex-col gap-2 border-t border-gray-400/30 pt-3">
                <button
                  type="button"
                  disabled={saving || !dirty}
                  onClick={() => void saveLead()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-500/40 bg-gray-200/80 px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm hover:bg-gray-300/80 disabled:opacity-45"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving ? "Saving…" : "Save changes"}
                </button>

                {selectedLead.client_id ? (
                  <div className="rounded-lg border border-emerald-400/40 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-950">
                    <p className="font-semibold">Linked to a client record</p>
                    <p className="mt-1 text-emerald-900/90">
                      Onboarding runs from the client. You can queue it again if needed.
                    </p>
                    <button
                      type="button"
                      disabled={pushing}
                      onClick={() => void pushToClient(true)}
                      className="mt-2 w-full rounded-md border border-emerald-600/40 bg-white/90 px-2 py-1.5 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-100/80 disabled:opacity-50"
                    >
                      {pushing ? "Working…" : "Re-run onboarding"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={pushing || !canPush}
                    onClick={() => void pushToClient(false)}
                    title={
                      !canPush ? "Add name, email, or phone on the lead first." : undefined
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600/45 bg-emerald-100/90 px-3 py-2 text-xs font-semibold text-emerald-950 shadow-sm hover:bg-emerald-200/90 disabled:opacity-45"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {pushing ? "Pushing…" : "Push to Clients"}
                  </button>
                )}

                <p className="text-[11px] leading-relaxed text-gray-600">
                  <span className="font-medium text-gray-800">Push to Clients</span> creates a client,
                  marks this lead as won, links both records, and queues the onboarding stub in{" "}
                  <code className="rounded bg-gray-400/25 px-1">lib/onboarding</code> — your next step
                  is to wire real emails or tasks there.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
