"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLeadAction, moveLeadStatusAction } from "@/app/dashboard/leads/actions";
import type { AssigneeOption, OsLeadRow } from "@/lib/os/leads-types";
import { cn } from "@/lib/utils";
import { LeadCreateModal } from "@/components/os/leads/LeadCreateModal";
import { LeadWorkModal } from "@/components/os/leads/LeadWorkModal";

const LEAD_MIME = "application/x-os-lead-id";

type LeadsCrmClientProps = {
  initialLeads: OsLeadRow[];
  leadStages: string[];
  leadTemperatures: string[];
  uncontactedStage: string;
  brandColor: string;
  isInternal: boolean;
  assignees: AssigneeOption[];
  kpiNew7d: number;
  kpiUncontacted: number;
  commonTags?: string[];
};

function cardTitle(lead: OsLeadRow): string {
  const n = lead.lead_name?.trim();
  if (n) return n;
  return lead.business_name?.trim() || "Lead";
}

function cardSub(lead: OsLeadRow): string | null {
  const n = lead.lead_name?.trim();
  const b = lead.business_name?.trim();
  if (n && b && n !== b) return b;
  return null;
}

export function LeadsCrmClient({
  initialLeads,
  leadStages,
  leadTemperatures,
  uncontactedStage,
  brandColor,
  isInternal,
  assignees,
  kpiNew7d,
  kpiUncontacted,
  commonTags = [],
}: LeadsCrmClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"pipeline" | "table">("pipeline");
  const [leads, setLeads] = useState(initialLeads);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const sources = useMemo(() => {
    const s = new Set<string>();
    for (const l of leads) {
      const v = l.source?.trim();
      if (v) s.add(v);
    }
    return Array.from(s).sort();
  }, [leads]);

  const [modal, setModal] = useState<
    | { mode: "closed" }
    | { mode: "create" }
    | { mode: "detail"; lead: OsLeadRow }
  >({ mode: "closed" });

  const [tableSearch, setTableSearch] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fTemp, setFTemp] = useState("");
  const [fSource, setFSource] = useState("");

  const filteredTable = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    return leads.filter((l) => {
      if (fStatus && l.status !== fStatus) return false;
      if (fTemp && l.temperature !== fTemp) return false;
      if (fSource && (l.source?.trim() || "") !== fSource) return false;
      if (!q) return true;
      const blob = [l.lead_name, l.business_name, l.email, l.phone, l.source, l.status]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [leads, tableSearch, fStatus, fTemp, fSource]);

  const leadsByStatus = useMemo(() => {
    const m = new Map<string, OsLeadRow[]>();
    for (const s of leadStages) m.set(s, []);
    for (const l of leads) {
      const st = leadStages.includes(l.status) ? l.status : leadStages[0] ?? "New";
      if (!m.has(st)) m.set(st, []);
      m.get(st)!.push(l);
    }
    return m;
  }, [leads, leadStages]);

  async function onDropToStage(leadId: string, stage: string) {
    startTransition(async () => {
      const res = await moveLeadStatusAction(leadId, stage);
      if (res.ok) {
        setLeads((prev) => prev.map((x) => (x.id === leadId ? { ...x, status: stage } : x)));
        refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Leads CRM</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
            Manage your sales pipeline and convert leads to projects
          </p>
        </div>
        {isInternal ? (
          <button
            type="button"
            onClick={() => setModal({ mode: "create" })}
            className="inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: brandColor }}
          >
            Add Lead
          </button>
        ) : null}
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">New leads (7d)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-neutral-900 dark:text-white">{kpiNew7d}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Uncontacted ({uncontactedStage})
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-neutral-900 dark:text-white">
            {kpiUncontacted}
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
        {(["pipeline", "table"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition",
              tab === t
                ? "border-current text-neutral-900 dark:text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            )}
            style={tab === t ? { borderColor: brandColor, color: undefined } : undefined}
          >
            {t === "pipeline" ? "Pipeline" : "Table"}
          </button>
        ))}
      </div>

      {tab === "pipeline" ? (
        <div
          className={cn(
            "flex gap-3 overflow-x-auto pb-2",
            isPending && "pointer-events-none opacity-70"
          )}
        >
          {leadStages.map((stage) => (
            <PipelineColumn
              key={stage}
              stage={stage}
              leads={leadsByStatus.get(stage) ?? []}
              brandColor={brandColor}
              onCardClick={(lead) => setModal({ mode: "detail", lead })}
              onDropLead={(id) => onDropToStage(id, stage)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input
              type="search"
              placeholder="Search…"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="min-w-[12rem] flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            />
            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              <option value="">All statuses</option>
              {leadStages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={fTemp}
              onChange={(e) => setFTemp(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              <option value="">All temperatures</option>
              {leadTemperatures.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={fSource}
              onChange={(e) => setFSource(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              <option value="">All sources</option>
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Business</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Temp</th>
                  <th className="px-3 py-2">Assigned</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTable.map((lead) => (
                  <tr key={lead.id} className="border-b border-neutral-100 dark:border-neutral-800">
                    <td className="px-3 py-2 font-medium text-neutral-900 dark:text-white">{cardTitle(lead)}</td>
                    <td className="px-3 py-2 text-neutral-600 dark:text-neutral-300">{lead.business_name || "—"}</td>
                    <td className="px-3 py-2 text-neutral-600 dark:text-neutral-300">{lead.email || "—"}</td>
                    <td className="px-3 py-2 text-neutral-600 dark:text-neutral-300">{lead.phone || "—"}</td>
                    <td className="px-3 py-2 text-neutral-600 dark:text-neutral-300">{lead.source || "—"}</td>
                    <td className="px-3 py-2">{lead.status}</td>
                    <td className="px-3 py-2">{lead.temperature}</td>
                    <td className="px-3 py-2 text-neutral-600 dark:text-neutral-300">
                      {assignees.find((a) => a.id === lead.assigned_user_id)?.label ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-neutral-500">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="font-medium text-sky-700 hover:underline dark:text-sky-400"
                        onClick={() => setModal({ mode: "detail", lead })}
                      >
                        Open
                      </button>
                      {isInternal ? (
                        <button
                          type="button"
                          className="ml-3 font-medium text-red-600 hover:underline dark:text-red-400"
                          onClick={() => {
                            if (!confirm("Delete this lead?")) return;
                            startTransition(async () => {
                              const r = await deleteLeadAction(lead.id);
                              if (r.ok) {
                                setLeads((p) => p.filter((x) => x.id !== lead.id));
                                refresh();
                              }
                            });
                          }}
                        >
                          Delete
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTable.length === 0 ? (
              <p className="p-6 text-center text-sm text-neutral-500">No leads match filters.</p>
            ) : null}
          </div>
        </div>
      )}

      {modal.mode === "create" ? (
        <LeadCreateModal
          leadStages={leadStages}
          leadTemperatures={leadTemperatures}
          assignees={assignees}
          isInternal={isInternal}
          brandColor={brandColor}
          commonTags={commonTags}
          onClose={() => setModal({ mode: "closed" })}
          onSaved={() => {
            setModal({ mode: "closed" });
            refresh();
          }}
        />
      ) : null}
      {modal.mode === "detail" ? (
        <LeadWorkModal
          lead={modal.lead}
          leadStages={leadStages}
          leadTemperatures={leadTemperatures}
          assignees={assignees}
          isInternal={isInternal}
          brandColor={brandColor}
          commonTags={commonTags}
          onClose={() => setModal({ mode: "closed" })}
          onSaved={() => {
            refresh();
          }}
          onDeleted={(deletedId) => {
            setLeads((p) => p.filter((x) => x.id !== deletedId));
            setModal({ mode: "closed" });
            refresh();
          }}
          onLeadUpdated={(updated) => {
            setLeads((p) => p.map((x) => (x.id === updated.id ? updated : x)));
            setModal((m) => (m.mode === "detail" && m.lead.id === updated.id ? { mode: "detail", lead: updated } : m));
          }}
        />
      ) : null}
    </div>
  );
}

function PipelineColumn({
  stage,
  leads,
  brandColor,
  onCardClick,
  onDropLead,
}: {
  stage: string;
  leads: OsLeadRow[];
  brandColor: string;
  onCardClick: (l: OsLeadRow) => void;
  onDropLead: (leadId: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={cn(
        "flex w-64 shrink-0 flex-col rounded-xl border bg-neutral-50 dark:bg-neutral-900/80",
        dragOver ? "border-dashed border-2" : "border-neutral-200 dark:border-neutral-800"
      )}
      style={dragOver ? { borderColor: brandColor } : undefined}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const id = e.dataTransfer.getData(LEAD_MIME);
        if (id) onDropLead(id);
      }}
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{stage}</span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: brandColor }}
        >
          {leads.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2">
        {leads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(LEAD_MIME, lead.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onClick={() => onCardClick(lead)}
            className="relative rounded-lg border border-neutral-200 bg-white p-3 text-left shadow-sm transition hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:border-neutral-600"
          >
            {lead.next_follow_up_at && new Date(lead.next_follow_up_at).getTime() < Date.now() ? (
              <span
                className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"
                title="Follow-up overdue"
              />
            ) : null}
            <p className="font-medium text-neutral-900 dark:text-white">{cardTitle(lead)}</p>
            {cardSub(lead) ? (
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{cardSub(lead)}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {lead.temperature}
              </span>
              {(lead.tags ?? []).slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
                >
                  {t}
                </span>
              ))}
              {(lead.tags?.length ?? 0) > 4 ? (
                <span className="text-[10px] text-neutral-400">+{lead.tags!.length - 4}</span>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
