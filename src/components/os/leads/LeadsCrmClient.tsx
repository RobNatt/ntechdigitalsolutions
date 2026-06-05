"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLeadAction, moveLeadStatusAction } from "@/app/dashboard/leads/actions";
import {
  bucketLeadsForFollowUpSchedule,
  buildFollowUpScheduleDays,
  type FollowUpDayKey,
} from "@/lib/os/follow-up-schedule";
import type { OsCalendlyBookingUrls } from "@/lib/os/calendly-booking";
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
  calendlyUrls: OsCalendlyBookingUrls;
};

function cardTitle(lead: OsLeadRow): string {
  const n = lead.lead_name?.trim();
  if (n) return n;
  return lead.business_name?.trim() || "Lead";
}

const TEMP_ORDER = ["Hot", "Warm", "Cold"] as const;

function orderedTemperatures(leadTemperatures: string[]): string[] {
  const out: string[] = [];
  for (const p of TEMP_ORDER) {
    const match = leadTemperatures.find((t) => t.toLowerCase() === p.toLowerCase());
    if (match) out.push(match);
  }
  for (const t of leadTemperatures) {
    if (!out.some((x) => x.toLowerCase() === t.toLowerCase())) out.push(t);
  }
  return out.length ? out : [...TEMP_ORDER];
}

/** Hot = light red, Warm = orange, Cold = light blue */
function leadCardTempClass(temperature: string): string {
  const t = temperature.trim().toLowerCase();
  if (t === "hot") {
    return "border-red-200 bg-red-100 hover:border-red-300 dark:border-red-900/60 dark:bg-red-950/50 dark:hover:border-red-800";
  }
  if (t === "warm") {
    return "border-orange-200 bg-orange-100 hover:border-orange-300 dark:border-orange-900/60 dark:bg-orange-950/45 dark:hover:border-orange-800";
  }
  return "border-sky-200 bg-sky-100 hover:border-sky-300 dark:border-sky-900/60 dark:bg-sky-950/45 dark:hover:border-sky-800";
}

function groupLeadsByTemperature(leads: OsLeadRow[], tempLanes: string[]): Map<string, OsLeadRow[]> {
  const m = new Map<string, OsLeadRow[]>();
  for (const t of tempLanes) m.set(t, []);
  const fallback = tempLanes.find((t) => t.toLowerCase() === "cold") ?? tempLanes[0] ?? "Cold";
  for (const l of leads) {
    const key =
      tempLanes.find((t) => t.toLowerCase() === (l.temperature ?? "").trim().toLowerCase()) ?? fallback;
    if (!m.has(key)) m.set(key, []);
    m.get(key)!.push(l);
  }
  return m;
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
  calendlyUrls,
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

  const followUpScheduleDays = useMemo(() => buildFollowUpScheduleDays(), []);
  const followUpByDay = useMemo(() => bucketLeadsForFollowUpSchedule(leads), [leads]);
  const followUpTotal = useMemo(
    () => followUpScheduleDays.reduce((n, d) => n + (followUpByDay.get(d.key)?.length ?? 0), 0),
    [followUpScheduleDays, followUpByDay]
  );

  function onDropToStage(leadId: string, stage: string) {
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

      {leadsFetchError ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
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
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
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

      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <span className="font-medium uppercase tracking-wide text-neutral-500">Temperature</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-100 px-2 py-0.5 dark:border-red-900/60 dark:bg-red-950/50">
          Hot
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-100 px-2 py-0.5 dark:border-orange-900/60 dark:bg-orange-950/45">
          Warm
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-100 px-2 py-0.5 dark:border-sky-900/60 dark:bg-sky-950/45">
          Cold
        </span>
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
        <div className="space-y-8">
          {!migrationPending ? (
            <section className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                    Follow-up schedule
                  </h2>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Today through the next two days. Missed today roll to tomorrow automatically.
                  </p>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {followUpTotal} scheduled
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {followUpScheduleDays.map((day) => (
                  <FollowUpDayColumn
                    key={day.key}
                    label={day.label}
                    dayKey={day.key}
                    leads={followUpByDay.get(day.key) ?? []}
                    tempLanes={tempLanes}
                    brandColor={brandColor}
                    onCardClick={(lead) => setModal({ mode: "detail", lead })}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
              Pipeline
            </h2>
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
                  tempLanes={tempLanes}
                  brandColor={brandColor}
                  onCardClick={(lead) => setModal({ mode: "detail", lead })}
                  onDropLead={(id) => onDropToStage(id, stage)}
                />
              ))}
            </div>
          </section>
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
          calendlyUrls={calendlyUrls}
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

function TemperatureGroupedColumn({
  title,
  leads,
  tempLanes,
  brandColor,
  onCardClick,
  draggableCards = true,
  emptyMessage,
  className,
  dragDrop,
}: {
  title: string;
  leads: OsLeadRow[];
  tempLanes: string[];
  brandColor: string;
  onCardClick: (l: OsLeadRow) => void;
  draggableCards?: boolean;
  emptyMessage?: string;
  className?: string;
  dragDrop?: { onDropLead: (leadId: string) => void };
}) {
  const [dragOver, setDragOver] = useState(false);
  const byTemp = groupLeadsByTemperature(leads, tempLanes);
  const hasLeads = leads.length > 0;

  return (
    <div
      className={cn(
        "flex w-56 shrink-0 flex-col rounded-xl border bg-neutral-50 dark:bg-neutral-900/80",
        dragDrop && dragOver ? "border-dashed border-2" : "border-neutral-200 dark:border-neutral-800",
        className
      )}
      style={dragDrop && dragOver ? { borderColor: brandColor } : undefined}
      onDragOver={
        dragDrop
          ? (e) => {
              e.preventDefault();
              setDragOver(true);
            }
          : undefined
      }
      onDragLeave={dragDrop ? () => setDragOver(false) : undefined}
      onDrop={
        dragDrop
          ? (e) => {
              e.preventDefault();
              setDragOver(false);
              const id = e.dataTransfer.getData(LEAD_MIME);
              if (id) dragDrop.onDropLead(id);
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{title}</span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: brandColor }}
        >
          {leads.length}
        </span>
      </div>
      <div className="flex max-h-[min(70vh,32rem)] flex-col gap-3 overflow-y-auto p-2">
        {!hasLeads && emptyMessage ? (
          <p className="px-1 py-4 text-center text-xs text-neutral-500 dark:text-neutral-400">{emptyMessage}</p>
        ) : null}
        {tempLanes.map((temp) => {
          const list = byTemp.get(temp) ?? [];
          if (list.length === 0) return null;
          return (
            <div key={temp}>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {temp}
              </p>
              <div className="flex flex-col gap-1.5">
                {list.map((lead) => (
                  <LeadPipelineCard
                    key={lead.id}
                    lead={lead}
                    onCardClick={onCardClick}
                    draggable={draggableCards}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FollowUpDayColumn({
  label,
  dayKey,
  leads,
  tempLanes,
  brandColor,
  onCardClick,
}: {
  label: string;
  dayKey: FollowUpDayKey;
  leads: OsLeadRow[];
  tempLanes: string[];
  brandColor: string;
  onCardClick: (l: OsLeadRow) => void;
}) {
  return (
    <TemperatureGroupedColumn
      title={label}
      leads={leads}
      tempLanes={tempLanes}
      brandColor={brandColor}
      onCardClick={onCardClick}
      draggableCards={false}
      emptyMessage={
        dayKey === "tomorrow" ? "No follow-ups — rolled missed items appear here" : "No follow-ups scheduled"
      }
    />
  );
}

function PipelineColumn({
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
  onDropLead: (leadId: string) => void;
}) {
  return (
    <TemperatureGroupedColumn
      title={stage}
      leads={leads}
      tempLanes={tempLanes}
      brandColor={brandColor}
      onCardClick={onCardClick}
      dragDrop={{ onDropLead }}
    />
  );
}

function LeadPipelineCard({
  lead,
  onCardClick,
  draggable = true,
}: {
  lead: OsLeadRow;
  onCardClick: (l: OsLeadRow) => void;
  draggable?: boolean;
}) {
  const overdue =
    lead.next_follow_up_at && new Date(lead.next_follow_up_at).getTime() < Date.now();

  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={
        draggable
          ? (e) => {
              e.dataTransfer.setData(LEAD_MIME, lead.id);
              e.dataTransfer.effectAllowed = "move";
            }
          : undefined
      }
      onClick={() => onCardClick(lead)}
      title={cardTitle(lead)}
      className={cn(
        "w-full rounded-lg border px-2.5 py-2 text-left text-sm shadow-sm transition",
        leadCardTempClass(lead.temperature),
        overdue && "ring-2 ring-red-500 ring-offset-1 dark:ring-offset-neutral-950"
      )}
    >
      <span className="block truncate font-medium text-neutral-900 dark:text-neutral-100">
        {cardTitle(lead)}
      </span>
    </button>
  );
}
