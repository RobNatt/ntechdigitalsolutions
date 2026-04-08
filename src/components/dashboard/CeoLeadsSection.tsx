"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Pencil, Save, Trash2, Upload, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PIPELINE_STAGES, stageLabel } from "@/lib/leads/stages";
import {
  LEAD_TEMPERATURES,
  normalizeLeadTemperature,
  temperatureLabel,
  type LeadTemperature,
} from "@/lib/leads/temperature";

type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  source: string | null;
  lead_type: string | null;
  stage: string | null;
  lead_temperature?: string | null;
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
  temperature: LeadTemperature;
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
    temperature: normalizeLeadTemperature(lead.lead_temperature),
    notes: notesFromDetails(lead.details),
  };
}

function apiErrorMessage(data: Record<string, unknown>, fallback: string): string {
  const err = typeof data.error === "string" ? data.error : fallback;
  const hint = typeof data.hint === "string" && data.hint.trim() ? data.hint.trim() : "";
  return hint ? `${err} — ${hint}` : err;
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
    a.temperature === b.temperature &&
    a.notes === b.notes
  );
}

const TEMP_ORDER: Record<LeadTemperature, number> = { hot: 0, warm: 1, cold: 2 };

function sortLeadsForCrm(list: LeadRow[]): LeadRow[] {
  return [...list].sort((a, b) => {
    const ta = normalizeLeadTemperature(a.lead_temperature);
    const tb = normalizeLeadTemperature(b.lead_temperature);
    const d = TEMP_ORDER[ta] - TEMP_ORDER[tb];
    if (d !== 0) return d;
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
  });
}

function temperatureSelectClass(t: LeadTemperature): string {
  switch (t) {
    case "hot":
      return "border-rose-400/60 bg-rose-50/95 text-rose-950 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-100";
    case "warm":
      return "border-amber-400/60 bg-amber-50/95 text-amber-950 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100";
    default:
      return "border-slate-400/50 bg-slate-100/95 text-slate-900 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100";
  }
}

export function CeoLeadsSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [baseline, setBaseline] = useState<Draft | null>(null);
  const [editingView, setEditingView] = useState(false);

  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedId) ?? null,
    [leads, selectedId]
  );

  const sortedLeads = useMemo(() => sortLeadsForCrm(leads), [leads]);

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
    if (editingView) return;
    if (!selectedLead) {
      setDraft(null);
      setBaseline(null);
      return;
    }
    const d = leadToDraft(selectedLead);
    setDraft(d);
    setBaseline(d);
  }, [selectedLead, editingView]);

  const dirty = draft && baseline ? !draftsEqual(draft, baseline) : false;

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function patchTemperature(id: string, temperature: LeadTemperature) {
    const prev = leads.find((l) => l.id === id)?.lead_temperature ?? null;
    setLeads((ls) =>
      ls.map((l) => (l.id === id ? { ...l, lead_temperature: temperature } : l))
    );
    setError(null);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temperature }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLeads((ls) =>
          ls.map((l) => (l.id === id ? { ...l, lead_temperature: prev } : l))
        );
        setError(apiErrorMessage(data as Record<string, unknown>, "Could not update temperature."));
      }
    } catch {
      setLeads((ls) =>
        ls.map((l) => (l.id === id ? { ...l, lead_temperature: prev } : l))
      );
      setError("Could not update temperature.");
    }
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
          temperature: draft.temperature,
          notes: draft.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(apiErrorMessage(data as Record<string, unknown>, "Save failed."));
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

  function handleBackFromEdit() {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setEditingView(false);
    setActionMessage(null);
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
        setError(apiErrorMessage(data as Record<string, unknown>, "Push to clients failed."));
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

  async function deleteLead() {
    if (!selectedId) return;
    if (
      !confirm(
        "Permanently delete this lead? Linked client records stay in Clients; only the lead row is removed."
      )
    ) {
      return;
    }
    setDeleting(true);
    setError(null);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/leads/${selectedId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(apiErrorMessage(data as Record<string, unknown>, "Delete failed."));
        return;
      }
      setSelectedId(null);
      setEditingView(false);
      setDraft(null);
      setBaseline(null);
      setActionMessage("Lead deleted.");
      await load();
    } catch {
      setError("Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  async function clearAllLeads() {
    if (
      !window.confirm(
        "Delete every lead in the CRM? Client rows stay; only lead records are removed. This cannot be undone."
      )
    ) {
      return;
    }
    const typed = window.prompt('Type exactly: DELETE ALL LEADS');
    if (typed !== "DELETE ALL LEADS") {
      if (typed !== null) setError("Confirmation did not match. Nothing was deleted.");
      return;
    }
    setClearing(true);
    setError(null);
    setActionMessage(null);
    try {
      const res = await fetch("/api/leads/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE ALL LEADS" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(apiErrorMessage(data as Record<string, unknown>, "Clear failed."));
        return;
      }
      const n = typeof data.deleted === "number" ? data.deleted : null;
      setSelectedId(null);
      setEditingView(false);
      setDraft(null);
      setBaseline(null);
      setActionMessage(n != null ? `Removed ${n} lead${n === 1 ? "" : "s"}.` : "All leads removed.");
      await load();
    } catch {
      setError("Clear failed.");
    } finally {
      setClearing(false);
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
        setError(apiErrorMessage(data as Record<string, unknown>, "Import failed."));
        return;
      }
      const n = typeof data.imported === "number" ? data.imported : 0;
      const skipped =
        typeof data.skippedEmpty === "number" && data.skippedEmpty > 0
          ? ` (${data.skippedEmpty} empty rows skipped)`
          : "";
      const warnList = Array.isArray(data.warnings)
        ? (data.warnings as unknown[]).filter((w) => typeof w === "string").join(" ")
        : "";
      if (n === 0) {
        const msg =
          typeof data.message === "string" && data.message.trim()
            ? data.message.trim()
            : "No rows were imported.";
        setImportMessage([msg, warnList].filter(Boolean).join(" "));
      } else {
        setImportMessage(
          [`Imported ${n} lead${n === 1 ? "" : "s"}${skipped}.`, warnList].filter(Boolean).join(" ")
        );
      }
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
    "mt-1 w-full rounded-md border border-gray-400/45 dark:border-neutral-600/50 bg-white/90 px-2.5 py-1.5 text-sm text-gray-900 dark:text-neutral-50 shadow-sm focus:border-sky-500/60 focus:outline-none focus:ring-1 focus:ring-sky-500/40";

  if (editingView && selectedLead && draft) {
    return (
      <div className="flex min-h-[min(70vh,560px)] flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-400/30 dark:border-neutral-600/35 pb-3">
          <button
            type="button"
            onClick={() => handleBackFromEdit()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-gray-200/50 px-3 py-2 text-xs font-semibold text-gray-900 dark:text-neutral-50 shadow-sm hover:bg-gray-300/50 dark:hover:bg-neutral-800/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <h2 className="text-sm font-bold text-gray-900 dark:text-neutral-50">Edit lead</h2>
          <button
            type="button"
            disabled={saving || !dirty}
            onClick={() => void saveLead()}
            className="inline-flex items-center gap-2 rounded-lg border border-sky-500/45 bg-sky-100/90 px-3 py-2 text-xs font-semibold text-sky-950 shadow-sm hover:bg-sky-200/90 disabled:opacity-45"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {error && (
          <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}
        {actionMessage && (
          <p className="rounded-lg border border-sky-300/60 bg-sky-50 px-3 py-2 text-sm text-sky-950">
            {actionMessage}
          </p>
        )}

        <div className="mx-auto w-full max-w-xl flex-1 rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/25 dark:bg-neutral-800/45 p-4 shadow-inner backdrop-blur-sm">
          <div className="flex flex-col gap-3">
            <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
              Lead temperature
              <select
                className={cn(inputClass, "cursor-pointer")}
                value={draft.temperature}
                onChange={(e) =>
                  updateDraft("temperature", normalizeLeadTemperature(e.target.value))
                }
              >
                {LEAD_TEMPERATURES.map((t) => (
                  <option key={t} value={t}>
                    {temperatureLabel(t)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
              Name
              <input
                className={inputClass}
                value={draft.name}
                onChange={(e) => updateDraft("name", e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
              Email
              <input
                type="email"
                className={inputClass}
                value={draft.email}
                onChange={(e) => updateDraft("email", e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
              Phone
              <input
                className={inputClass}
                value={draft.phone}
                onChange={(e) => updateDraft("phone", e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
              Address
              <input
                className={inputClass}
                value={draft.address}
                onChange={(e) => updateDraft("address", e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
              Source
              <input
                className={inputClass}
                value={draft.source}
                onChange={(e) => updateDraft("source", e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
              Lead type
              <input
                className={inputClass}
                value={draft.lead_type}
                onChange={(e) => updateDraft("lead_type", e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
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
            <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
              Notes
              <textarea
                className={cn(inputClass, "min-h-[88px] resize-y")}
                value={draft.notes}
                onChange={(e) => updateDraft("notes", e.target.value)}
                rows={4}
              />
            </label>

            <div className="flex flex-col gap-2 border-t border-gray-400/30 dark:border-neutral-600/35 pt-3">
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
                  title={!canPush ? "Add name, email, or phone on the lead first." : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600/45 bg-emerald-100/90 px-3 py-2 text-xs font-semibold text-emerald-950 shadow-sm hover:bg-emerald-200/90 disabled:opacity-45"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  {pushing ? "Pushing…" : "Push to Clients"}
                </button>
              )}

              <button
                type="button"
                disabled={deleting}
                onClick={() => void deleteLead()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/55 bg-red-50/90 px-3 py-2 text-xs font-semibold text-red-900 shadow-sm hover:bg-red-100/90 disabled:opacity-45"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? "Deleting…" : "Delete lead"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm text-gray-600 dark:text-neutral-400">
          Website contact submissions are saved as <span className="font-medium text-gray-800 dark:text-neutral-200">hot</span>{" "}
          leads. Set <span className="font-medium text-gray-800 dark:text-neutral-200">warm</span> or{" "}
          <span className="font-medium text-gray-800 dark:text-neutral-200">cold</span> in the first column anytime. Excel imports
          default to warm.
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
            disabled={!selectedId}
            onClick={() => setEditingView(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-500/45 bg-gray-200/80 px-3 py-2 text-xs font-semibold text-gray-900 dark:text-neutral-50 shadow-sm hover:bg-gray-300/80 dark:hover:bg-neutral-800/80 disabled:opacity-45"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit lead
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-gray-200/40 px-3 py-2 text-xs font-semibold text-gray-800 dark:text-neutral-200 shadow-sm hover:bg-gray-300/50 dark:hover:bg-neutral-800/50"
          >
            Refresh
          </button>
          <button
            type="button"
            disabled={clearing || sortedLeads.length === 0}
            onClick={() => void clearAllLeads()}
            className="rounded-lg border border-red-400/55 bg-red-50/90 px-3 py-2 text-xs font-semibold text-red-900 shadow-sm hover:bg-red-100/90 disabled:opacity-45"
          >
            {clearing ? "Clearing…" : "Clear all leads"}
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

      <div className="overflow-hidden rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/20 dark:bg-neutral-800/50 shadow-inner backdrop-blur-sm">
        <div className="border-b border-gray-400/30 dark:border-neutral-600/35 px-4 py-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">Leads</h3>
        </div>
        <div className="max-h-[min(60vh,560px)] overflow-auto">
          {loading ? (
            <p className="px-4 py-8 text-center text-sm text-gray-600 dark:text-neutral-400">Loading…</p>
          ) : sortedLeads.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-600 dark:text-neutral-400">No leads yet.</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="sticky top-0 z-[1] bg-gray-300/95 dark:bg-neutral-900/95 shadow-sm">
                <tr className="border-b border-gray-400/25 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-700 dark:text-neutral-300">
                  <th className="px-2 py-2.5 pl-3">Temp</th>
                  <th className="px-3 py-2.5">Name</th>
                  <th className="px-3 py-2.5">Email</th>
                  <th className="px-3 py-2.5">Phone</th>
                  <th className="px-3 py-2.5">Client</th>
                  <th className="px-3 py-2.5">Created</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map((lead) => {
                  const isSel = lead.id === selectedId;
                  const t = normalizeLeadTemperature(lead.lead_temperature);
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
                        "cursor-pointer border-b border-gray-400/20 dark:border-neutral-600/25 last:border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50",
                        isSel ? "bg-sky-100/50" : "hover:bg-gray-400/10"
                      )}
                    >
                      <td className="px-2 py-2 pl-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          aria-label={`Temperature for ${lead.name || "lead"}`}
                          value={t}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            void patchTemperature(lead.id, normalizeLeadTemperature(e.target.value));
                          }}
                          className={cn(
                            "w-[5.5rem] cursor-pointer rounded-md border py-1 pl-2 pr-1 text-[11px] font-bold uppercase tracking-wide shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500/50",
                            temperatureSelectClass(t)
                          )}
                        >
                          {LEAD_TEMPERATURES.map((opt) => (
                            <option key={opt} value={opt}>
                              {temperatureLabel(opt)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900 dark:text-neutral-50">{lead.name || "—"}</td>
                      <td className="max-w-[160px] truncate px-3 py-2 text-gray-700 dark:text-neutral-300">
                        {lead.email || "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-700 dark:text-neutral-300 tabular-nums">{lead.phone || "—"}</td>
                      <td className="px-3 py-2">
                        {lead.client_id ? (
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                            Linked
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-neutral-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600 dark:text-neutral-400 tabular-nums">
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
    </div>
  );
}
