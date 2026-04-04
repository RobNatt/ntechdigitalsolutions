"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  stage: string | null;
  created_at: string;
};

export function CeoLeadsSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

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
      setLeads(Array.isArray(data.leads) ? data.leads : []);
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm text-gray-600">
          Upload an Excel file (.xlsx or .xls). The first sheet should include a header row. We match
          columns such as{" "}
          <span className="font-medium text-gray-800">Name</span>,{" "}
          <span className="font-medium text-gray-800">Email</span>,{" "}
          <span className="font-medium text-gray-800">Phone</span>,{" "}
          <span className="font-medium text-gray-800">Address</span>,{" "}
          <span className="font-medium text-gray-800">Company</span>,{" "}
          <span className="font-medium text-gray-800">Stage</span>, and{" "}
          <span className="font-medium text-gray-800">Notes</span>. Up to 500 rows per import.
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

      <div className="overflow-hidden rounded-2xl border border-gray-400/40 bg-gray-300/20 shadow-inner backdrop-blur-sm">
        <div className="border-b border-gray-400/30 px-4 py-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
            Leads
          </h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="px-4 py-8 text-center text-sm text-gray-600">Loading…</p>
          ) : leads.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-600">
              No leads in the database yet. Use Import Excel or your public lead forms to add rows.
            </p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-400/25 bg-gray-400/10 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-700">
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Phone</th>
                  <th className="px-4 py-2.5">Source</th>
                  <th className="px-4 py-2.5">Stage</th>
                  <th className="px-4 py-2.5">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-400/20 last:border-0 hover:bg-gray-400/10"
                  >
                    <td className="px-4 py-2.5 font-medium text-gray-900">
                      {lead.name || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">{lead.email || "—"}</td>
                    <td className="px-4 py-2.5 text-gray-700 tabular-nums">{lead.phone || "—"}</td>
                    <td className="px-4 py-2.5 text-gray-700">{lead.source || "—"}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex rounded-md border border-gray-400/50 bg-gray-100/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-800">
                        {(lead.stage || "submitted").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 tabular-nums">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
