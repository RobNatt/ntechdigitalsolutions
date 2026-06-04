"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLeadAction, moveLeadPipelineAction } from "@/app/dashboard/leads/actions";
import type { AssigneeOption, OsLeadRow } from "@/lib/os/leads-types";
import { cn } from "@/lib/utils";
import { LeadCreateModal } from "@/components/os/leads/LeadCreateModal";
import { LeadSpreadsheetSync } from "@/components/os/leads/LeadSpreadsheetSync";
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
  leadsFetchError?: string | null;
  migrationPending?: boolean;
  sheetsIntegrationEnabled?: boolean;
  settingsIntegrationsUrl?: string;
};

function cardTitle(lead: OsLeadRow): string {
  const n = lead.lead_name?.trim();
  if (n) return n;
  return lead.business_name?.trim() || "Lead";
}

/** Hot → Warm → Cold, then any custom temperatures from settings. */
function orderedTemperatures(leadTemperatures: string[]): string[] {
  const preferred = ["Hot", "Warm", "Cold"];
  const out: string[] = [];
  for (const p of preferred) {
    const match = leadTemperatures.find((t) => t.toLowerCase() === p.toLowerCase());
    if (match) out.push(match);
  }
  for (const t of leadTemperatures) {
    if (!out.some((x) => x.toLowerCase() === t.toLowerCase())) out.push(t);
  }
  return out.length ? out : ["Cold", "Warm", "Hot"];
}

function tempLaneClass(temp: string): string {
  const t = temp.toLowerCase();
  if (t === "hot") return "bg-red-50/80 dark:bg-red-950/30";
  if (t === "warm") return "bg-amber-50/80 dark:bg-amber-950/25";
  return "bg-sky-50/60 dark:bg-sky-950/20";
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
  leadsFetchError = null,
  migrationPending = false,
  sheetsIntegrationEnabled = false,
  settingsIntegrationsUrl = "/dashboard/settings",
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

  const handleLeadUpdated = useCallback((updated: OsLeadRow) => {
    setLeads((p) => p.map((x) => (x.id === updated.id ? updated : x)));
    setModal((m) =>
      m.mode === "detail" && m.lead.id === updated.id ? { mode: "detail", lead: updated } : m
    );
  }, []);

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

  const tempLanes = useMemo(() => orderedTemperatures(leadTemperatures), [leadTemperatures]);

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

  function onDropToPipeline(leadId: string, stage: string, temperature?: string) {
    startTransition(async () => {
      const res = await moveLeadPipelineAction(leadId, stage, temperature);
      if (res.ok) {
        setLeads((prev) =>
          prev.map((x) =>
            x.id === leadId
              ? { ...x, status: stage, temperature: temperature ?? x.temperature }
              : x
          )
        );
        refresh();
      }
    });
  }

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">Leads CRM</h1>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            7d: <strong className="text-neutral-800 dark:text-neutral-200">{kpiNew7d}</strong>
            <span className="mx-1.5">·</span>
            {uncontactedStage}:{" "}
            <strong className="text-neutral-800 dark:text-neutral-200">{kpiUncontacted}</strong>
          </span>
        </div>
        {isInternal ? (
          <button
            type="button"
            onClick={() => setModal({ mode: "create" })}
            className="inline-flex shrink-0 items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold text-white"
            style={{ backgroundColor: brandColor }}
          >
            Add Lead
          </button>
        ) : null}
      </header>

      {leadsFetchError ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
          role="alert"
        >
          <p className="font-semibold">Could not load leads</p>
          <p className="mt-1 text-red-800 dark:text-red-300">{leadsFetchError}</p>
          <p className="mt-2 text-xs text-red-700 dark:text-red-400">
            Your leads are usually still in the database. Apply migration{" "}
            <code className="rounded bg-red-100 px-1 dark:bg-red-900">035_os_lead_workflow.sql</code> in Supabase, or
            run <code className="rounded bg-red-100 px-1 dark:bg-red-900">supabase db push</code>.
          </p>
        </div>
      ) : null}

      {migrationPending && !leadsFetchError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-semibold">Database update recommended</p>
          <p className="mt-1 text-amber-900 dark:text-amber-200">
            Leads are loading in compatibility mode. Run migration{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">035_os_lead_workflow</code> in Supabase to
            enable follow-up tracking, documents, and the new pipeline stages.
          </p>
        </div>
      ) : null}

      {isInternal ? (
        <LeadSpreadsheetSync
          brandColor={brandColor}
          settingsUrl={settingsIntegrationsUrl}
          sheetsEnabled={sheetsIntegrationEnabled}
        />
      ) : null}

      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
        {(["pipeline", "table"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 px-3 py-1.5 text-xs font-medium transition",
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
            "min-h-0 flex-1 space-y-1.5 overflow-y-auto pb-2 pr-1",
            isPending && "pointer-events-none opacity-70"
          )}
          style={{ maxHeight: "calc(100vh - 11rem)" }}
        >
          {leadStages.map((stage) => (
            <PipelineStageRow
              key={stage}
              stage={stage}
              leads={leadsByStatus.get(stage) ?? []}
              tempLanes={tempLanes}
              brandColor={brandColor}
              onCardClick={(lead) => setModal({ mode: "detail", lead })}
              onDropLead={(id, temp) => onDropToPipeline(id, stage, temp)}
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
          onLeadUpdated={handleLeadUpdated}
        />
      ) : null}
    </div>
  );
}

function groupLeadsByTemperature(leads: OsLeadRow[], tempLanes: string[]): Map<string, OsLeadRow[]> {
  const m = new Map<string, OsLeadRow[]>();
  for (const t of tempLanes) m.set(t, []);
  const fallback = tempLanes[0] ?? "Cold";
  for (const l of leads) {
    const key =
      tempLanes.find((t) => t.toLowerCase() === (l.temperature ?? "").trim().toLowerCase()) ?? fallback;
    if (!m.has(key)) m.set(key, []);
    m.get(key)!.push(l);
  }
  return m;
}

function PipelineStageRow({
  stage,
  leads,
  tempLanes,
  brandColor,
  onCardClick,
  onDropLead,
}: {
  stage: string;
  leads: OsLeadRow[];
  tempLanes: string[];
  brandColor: string;
  onCardClick: (l: OsLeadRow) => void;
  onDropLead: (leadId: string, temperature: string) => void;
}) {
  const byTemp = groupLeadsByTemperature(leads, tempLanes);

  return (
    <section className="rounded-lg border border-neutral-200 bg-neutral-50/80 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div
        className="flex items-center justify-between border-b border-neutral-200 px-2 py-1 dark:border-neutral-800"
        style={{ borderLeftWidth: 3, borderLeftColor: brandColor }}
      >
        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-100">{stage}</span>
        <span className="text-[10px] tabular-nums text-neutral-500">{leads.length}</span>
      </div>
      <div
        className="grid gap-px p-px"
        style={{ gridTemplateColumns: `repeat(${tempLanes.length}, minmax(0, 1fr))` }}
      >
        {tempLanes.map((temp) => (
          <TemperatureLane
            key={temp}
            temperature={temp}
            leads={byTemp.get(temp) ?? []}
            onCardClick={onCardClick}
            onDropLead={(id) => onDropLead(id, temp)}
          />
        ))}
      </div>
    </section>
  );
}

function TemperatureLane({
  temperature,
  leads,
  onCardClick,
  onDropLead,
}: {
  temperature: string;
  leads: OsLeadRow[];
  onCardClick: (l: OsLeadRow) => void;
  onDropLead: (leadId: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={cn(
        "flex min-h-[2.5rem] flex-col rounded-sm",
        tempLaneClass(temperature),
        dragOver && "ring-2 ring-inset ring-sky-400 dark:ring-sky-500"
      )}
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
      <div className="flex items-center justify-between border-b border-neutral-200/60 px-1.5 py-0.5 dark:border-neutral-700/60">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
          {temperature}
        </span>
        <span className="text-[10px] tabular-nums text-neutral-400">{leads.length}</span>
      </div>
      <div className="flex flex-col gap-px p-0.5">
        {leads.map((lead) => (
          <LeadNameCard key={lead.id} lead={lead} onCardClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}

function LeadNameCard({
  lead,
  onCardClick,
}: {
  lead: OsLeadRow;
  onCardClick: (l: OsLeadRow) => void;
}) {
  const overdue =
    lead.next_follow_up_at && new Date(lead.next_follow_up_at).getTime() < Date.now();

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(LEAD_MIME, lead.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => onCardClick(lead)}
      title={cardTitle(lead)}
      className={cn(
        "flex w-full items-center gap-1 rounded px-1 py-0.5 text-left text-[11px] leading-tight transition",
        "border border-transparent bg-white/90 hover:border-neutral-300 dark:bg-neutral-950/90 dark:hover:border-neutral-600",
        overdue && "border-l-2 border-l-red-500 pl-0.5"
      )}
    >
      <span className="min-w-0 flex-1 truncate font-medium text-neutral-900 dark:text-neutral-100">
        {cardTitle(lead)}
      </span>
    </button>
  );
}
