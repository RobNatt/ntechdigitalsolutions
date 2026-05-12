"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addLeadStageAction,
  addProjectStageAction,
  bulkAssignLeadsAction,
  deleteLeadStageAction,
  deleteProjectStageAction,
  renameLeadStageAction,
  renameProjectStageAction,
  reorderLeadStagesAction,
  reorderProjectStagesAction,
  saveApplicationSettingsAction,
  saveFeatureTogglesAction,
  saveRegionalSettingsAction,
  setCommonTagsAction,
  setLeadTemperaturesAction,
  setUncontactedStageAction,
  updateProfileLinkedClientAction,
  updateProfileOsRoleAction,
} from "@/app/dashboard/settings/actions";
import type { OsSettingsRow } from "@/lib/os/types";
import { cn } from "@/lib/utils";

export type WorkspaceProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  os_role: string | null;
  os_client_id: string | null;
};

type OsSettingsPanelProps = {
  settings: OsSettingsRow;
  isWorkspaceAdmin: boolean;
  profiles: WorkspaceProfileRow[];
  clients: { id: string; label: string }[];
  currentUserId: string;
};

const CURRENCY_OPTIONS = ["AUD", "USD", "EUR", "GBP", "NZD", "CAD", "JPY", "SGD", "INR"];

const TIMEZONE_PRESETS = [
  "UTC",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Perth",
  "Pacific/Auckland",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
];

function normalizeHex(c: string): string {
  const t = c.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(t)) return t;
  return "#2563eb";
}

export function OsSettingsPanel({
  settings,
  isWorkspaceAdmin,
  profiles,
  clients,
  currentUserId,
}: OsSettingsPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const brand = normalizeHex(settings.brand_color);
  const [osName, setOsName] = useState(settings.os_name);
  const [brandColor, setBrandColor] = useState(brand);

  const [currencySelect, setCurrencySelect] = useState(
    CURRENCY_OPTIONS.includes(settings.currency) ? settings.currency : "__custom__"
  );
  const [currencyCustom, setCurrencyCustom] = useState(
    CURRENCY_OPTIONS.includes(settings.currency) ? "" : settings.currency
  );
  const [timezoneSelect, setTimezoneSelect] = useState(
    TIMEZONE_PRESETS.includes(settings.timezone) ? settings.timezone : "__custom__"
  );
  const [timezoneCustom, setTimezoneCustom] = useState(
    TIMEZONE_PRESETS.includes(settings.timezone) ? "" : settings.timezone
  );

  const [toggles, setToggles] = useState({
    enable_content_engine: settings.enable_content_engine,
    enable_analytics: settings.enable_analytics,
    enable_sops: settings.enable_sops,
  });

  const leadStages = useMemo(
    () => settings.enum_defaults?.lead_stages ?? [],
    [settings.enum_defaults?.lead_stages]
  );
  const projectStages = useMemo(
    () => settings.enum_defaults?.project_stages ?? [],
    [settings.enum_defaults?.project_stages]
  );
  const leadTemps = useMemo(
    () => settings.enum_defaults?.lead_temperatures ?? [],
    [settings.enum_defaults?.lead_temperatures]
  );
  const commonTags = useMemo(
    () => settings.enum_defaults?.common_tags ?? [],
    [settings.enum_defaults?.common_tags]
  );

  const [uncontacted, setUncontacted] = useState(settings.uncontacted_stage);
  const [newLeadStage, setNewLeadStage] = useState("");
  const [newProjectStage, setNewProjectStage] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newTemp, setNewTemp] = useState("");
  const [localTemps, setLocalTemps] = useState<string[]>(leadTemps);
  const [localTags, setLocalTags] = useState<string[]>(commonTags);

  const [renameLead, setRenameLead] = useState<{ from: string; to: string } | null>(null);
  const [renameProject, setRenameProject] = useState<{ from: string; to: string } | null>(null);
  const [deleteLead, setDeleteLead] = useState<{ stage: string; migrateTo: string } | null>(null);
  const [deleteProject, setDeleteProject] = useState<{ stage: string; migrateTo: string } | null>(null);

  const [bulkIds, setBulkIds] = useState("");
  const [bulkUser, setBulkUser] = useState("");

  useEffect(() => {
    setOsName(settings.os_name);
    setBrandColor(normalizeHex(settings.brand_color));
    setCurrencySelect(CURRENCY_OPTIONS.includes(settings.currency) ? settings.currency : "__custom__");
    setCurrencyCustom(CURRENCY_OPTIONS.includes(settings.currency) ? "" : settings.currency);
    setTimezoneSelect(TIMEZONE_PRESETS.includes(settings.timezone) ? settings.timezone : "__custom__");
    setTimezoneCustom(TIMEZONE_PRESETS.includes(settings.timezone) ? "" : settings.timezone);
    setToggles({
      enable_content_engine: settings.enable_content_engine,
      enable_analytics: settings.enable_analytics,
      enable_sops: settings.enable_sops,
    });
    setUncontacted(settings.uncontacted_stage);
    setLocalTemps(leadTemps);
    setLocalTags(commonTags);
  }, [settings, leadTemps, commonTags]);

  const run = useCallback(
    async (fn: () => Promise<{ ok: boolean; error?: string }>, okText: string) => {
      setFlash(null);
      startTransition(async () => {
        const r = await fn();
        if (r.ok) {
          setFlash({ kind: "ok", text: okText });
          router.refresh();
        } else setFlash({ kind: "err", text: r.error ?? "Something went wrong." });
      });
    },
    [router]
  );

  const effectiveCurrency =
    currencySelect === "__custom__"
      ? (currencyCustom.trim().toUpperCase().slice(0, 8) || "AUD")
      : currencySelect;

  const effectiveTimezone =
    timezoneSelect === "__custom__"
      ? (timezoneCustom.trim() || "UTC")
      : timezoneSelect;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Settings</h1>
        <p className="mt-1 max-w-3xl text-sm text-neutral-600 dark:text-neutral-400">
          Customize this workspace for your agency: branding, regional defaults, pipelines, feature visibility, and team
          access.
        </p>
      </header>

      {flash ? (
        <div
          className={cn(
            "rounded-lg border px-3 py-2 text-sm",
            flash.kind === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
          )}
        >
          {flash.text}
        </div>
      ) : null}

      {/* 1) Application */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Application</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Workspace name and accent color apply across the dashboard immediately after you save.
        </p>
        <div className="mt-4 max-w-xl space-y-4">
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
            OS name
            <input
              value={osName}
              onChange={(e) => setOsName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            />
          </label>
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Brand color
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="mt-1.5 h-10 w-28 cursor-pointer rounded border border-neutral-300 bg-white p-0.5 dark:border-neutral-600"
            />
          </label>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              void run(
                () => saveApplicationSettingsAction({ os_name: osName, brand_color: brandColor }),
                "Application settings saved."
              )
            }
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
            style={{ backgroundColor: brandColor }}
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </section>

      {/* 2) Regional */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Regional</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Used for Revenue ranges and Calendar date formatting.
        </p>
        <div className="mt-4 max-w-xl space-y-4">
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Currency
            <select
              value={currencySelect}
              onChange={(e) => {
                const v = e.target.value;
                setCurrencySelect(v);
                if (v !== "__custom__") setCurrencyCustom("");
              }}
              className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__custom__">Custom…</option>
            </select>
            {currencySelect === "__custom__" ? (
              <input
                value={currencyCustom}
                onChange={(e) => setCurrencyCustom(e.target.value)}
                placeholder="ISO code (e.g. CHF)"
                className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm uppercase dark:border-neutral-600 dark:bg-neutral-950"
              />
            ) : null}
          </label>
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Timezone
            <select
              value={timezoneSelect}
              onChange={(e) => {
                const v = e.target.value;
                setTimezoneSelect(v);
                if (v !== "__custom__") setTimezoneCustom("");
              }}
              className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            >
              {TIMEZONE_PRESETS.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
              <option value="__custom__">Custom IANA…</option>
            </select>
            {timezoneSelect === "__custom__" ? (
              <input
                value={timezoneCustom}
                onChange={(e) => setTimezoneCustom(e.target.value)}
                placeholder="e.g. Australia/Sydney"
                className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
              />
            ) : null}
          </label>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              void run(
                () => saveRegionalSettingsAction({ currency: effectiveCurrency, timezone: effectiveTimezone }),
                "Regional settings saved."
              )
            }
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
            style={{ backgroundColor: brandColor }}
          >
            {pending ? "Saving…" : "Save regional"}
          </button>
        </div>
      </section>

      {/* 3) Lead pipeline */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Lead pipeline</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Stages power the Leads CRM board. Renaming or deleting updates existing leads; deleting requires a migration
          target.
        </p>

        <div className="mt-4 max-w-xl">
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Uncontacted stage (KPI)
            <select
              value={uncontacted}
              onChange={(e) => setUncontacted(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            >
              {leadStages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={pending}
            className="mt-3 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium dark:border-neutral-600"
            onClick={() =>
              void run(() => setUncontactedStageAction(uncontacted), "Uncontacted stage updated.")
            }
          >
            Save uncontacted stage
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Lead stages</h3>
          <ul className="mt-2 divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
            {leadStages.map((stage, idx) => (
              <li key={`${stage}-${idx}`} className="flex flex-wrap items-center gap-2 px-3 py-2 text-sm">
                <span className="min-w-0 flex-1 font-medium text-neutral-900 dark:text-white">{stage}</span>
                <button
                  type="button"
                  className="text-xs text-neutral-600 hover:underline dark:text-neutral-400"
                  disabled={pending || idx === 0}
                  onClick={() =>
                    void run(async () => {
                      const next = [...leadStages];
                      [next[idx - 1], next[idx]] = [next[idx]!, next[idx - 1]!];
                      return reorderLeadStagesAction(next);
                    }, "Stages reordered.")
                  }
                >
                  Up
                </button>
                <button
                  type="button"
                  className="text-xs text-neutral-600 hover:underline dark:text-neutral-400"
                  disabled={pending || idx >= leadStages.length - 1}
                  onClick={() =>
                    void run(async () => {
                      const next = [...leadStages];
                      [next[idx], next[idx + 1]] = [next[idx + 1]!, next[idx]!];
                      return reorderLeadStagesAction(next);
                    }, "Stages reordered.")
                  }
                >
                  Down
                </button>
                <button
                  type="button"
                  className="text-xs text-sky-700 hover:underline dark:text-sky-400"
                  onClick={() => setRenameLead({ from: stage, to: stage })}
                >
                  Rename
                </button>
                <button
                  type="button"
                  className="text-xs text-red-600 hover:underline dark:text-red-400"
                  onClick={() => setDeleteLead({ stage, migrateTo: leadStages.find((s) => s !== stage) ?? "" })}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={newLeadStage}
              onChange={(e) => setNewLeadStage(e.target.value)}
              placeholder="New stage name"
              className="min-w-[12rem] flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            />
            <button
              type="button"
              disabled={pending}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              style={{ backgroundColor: brandColor }}
              onClick={() =>
                void run(async () => {
                  const r = await addLeadStageAction(newLeadStage);
                  if (r.ok) setNewLeadStage("");
                  return r;
                }, "Stage added.")
              }
            >
              Add stage
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Lead temperatures</h3>
          <p className="mt-1 text-xs text-neutral-500">
            Removing a value migrates any leads using it to the first temperature in the list.
          </p>
          <ul className="mt-2 space-y-1">
            {localTemps.map((t, i) => (
              <li key={`${t}-${i}`} className="flex items-center gap-2 text-sm">
                <span className="flex-1">{t}</span>
                <button
                  type="button"
                  className="text-xs text-red-600 hover:underline"
                  disabled={pending || localTemps.length <= 1}
                  onClick={() => {
                    const next = localTemps.filter((_, j) => j !== i);
                    setLocalTemps(next);
                    void run(() => setLeadTemperaturesAction(next), "Temperatures updated.");
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <input
              value={newTemp}
              onChange={(e) => setNewTemp(e.target.value)}
              placeholder="Add temperature"
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            />
            <button
              type="button"
              disabled={pending}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600"
              onClick={() => {
                const n = newTemp.trim();
                if (!n || localTemps.includes(n)) return;
                const next = [...localTemps, n];
                setLocalTemps(next);
                setNewTemp("");
                void run(() => setLeadTemperaturesAction(next), "Temperatures updated.");
              }}
            >
              Add
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Common tags</h3>
          <p className="mt-1 text-xs text-neutral-500">Quick-insert labels on the Leads CRM tag field.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {localTags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-2 py-0.5 text-xs dark:border-neutral-700"
              >
                {t}
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  disabled={pending}
                  onClick={() => {
                    const next = localTags.filter((x) => x !== t);
                    setLocalTags(next);
                    void run(() => setCommonTagsAction(next), "Common tags saved.");
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag"
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            />
            <button
              type="button"
              disabled={pending}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600"
              onClick={() => {
                const n = newTag.trim();
                if (!n || localTags.includes(n)) return;
                const next = [...localTags, n];
                setLocalTags(next);
                setNewTag("");
                void run(() => setCommonTagsAction(next), "Common tags saved.");
              }}
            >
              Add tag
            </button>
          </div>
        </div>
      </section>

      {/* 4) Project stages */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Project stages</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Kanban columns on the Projects page. Safe migration applies when you rename or delete a stage in use.
        </p>
        <ul className="mt-4 divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {projectStages.map((stage, idx) => (
            <li key={`${stage}-${idx}`} className="flex flex-wrap items-center gap-2 px-3 py-2 text-sm">
              <span className="min-w-0 flex-1 font-medium text-neutral-900 dark:text-white">{stage}</span>
              <button
                type="button"
                className="text-xs text-neutral-600 hover:underline dark:text-neutral-400"
                disabled={pending || idx === 0}
                onClick={() =>
                  void run(async () => {
                    const next = [...projectStages];
                    [next[idx - 1], next[idx]] = [next[idx]!, next[idx - 1]!];
                    return reorderProjectStagesAction(next);
                  }, "Project stages reordered.")
                }
              >
                Up
              </button>
              <button
                type="button"
                className="text-xs text-neutral-600 hover:underline dark:text-neutral-400"
                disabled={pending || idx >= projectStages.length - 1}
                onClick={() =>
                  void run(async () => {
                    const next = [...projectStages];
                    [next[idx], next[idx + 1]] = [next[idx + 1]!, next[idx]!];
                    return reorderProjectStagesAction(next);
                  }, "Project stages reordered.")
                }
              >
                Down
              </button>
              <button
                type="button"
                className="text-xs text-sky-700 hover:underline dark:text-sky-400"
                onClick={() => setRenameProject({ from: stage, to: stage })}
              >
                Rename
              </button>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline dark:text-red-400"
                onClick={() =>
                  setDeleteProject({ stage, migrateTo: projectStages.find((s) => s !== stage) ?? "" })
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={newProjectStage}
            onChange={(e) => setNewProjectStage(e.target.value)}
            placeholder="New project stage"
            className="min-w-[12rem] flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
          />
          <button
            type="button"
            disabled={pending}
            className="rounded-lg px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: brandColor }}
            onClick={() =>
              void run(async () => {
                const r = await addProjectStageAction(newProjectStage);
                if (r.ok) setNewProjectStage("");
                return r;
              }, "Project stage added.")
            }
          >
            Add stage
          </button>
        </div>
      </section>

      {/* 5) Page toggles */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Page toggles</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          When disabled, the page is hidden from the sidebar and direct visits redirect to the dashboard.
        </p>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={toggles.enable_content_engine}
              onChange={(e) => setToggles((t) => ({ ...t, enable_content_engine: e.target.checked }))}
            />
            Content Engine
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={toggles.enable_analytics}
              onChange={(e) => setToggles((t) => ({ ...t, enable_analytics: e.target.checked }))}
            />
            Analytics
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={toggles.enable_sops}
              onChange={(e) => setToggles((t) => ({ ...t, enable_sops: e.target.checked }))}
            />
            SOPs
          </label>
          <button
            type="button"
            disabled={pending}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: brandColor }}
            onClick={() =>
              void run(() => saveFeatureTogglesAction(toggles), "Feature toggles saved.")
            }
          >
            Save toggles
          </button>
        </div>
      </section>

      {/* 6) User management */}
      {isWorkspaceAdmin ? (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">User management</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Assign OS roles, link portal users to a client record, and bulk-assign leads. Client logins keep read-only
            rules in the rest of the app.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs font-semibold uppercase text-neutral-500 dark:border-neutral-800">
                <tr>
                  <th className="py-2 pr-3">User</th>
                  <th className="py-2 pr-3">App role</th>
                  <th className="py-2 pr-3">OS role</th>
                  <th className="py-2 pr-3">Linked client</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {profiles.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 pr-3">
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {p.full_name?.trim() || p.email || p.id.slice(0, 8)}
                        {p.id === currentUserId ? (
                          <span className="ml-2 text-xs text-neutral-400">(you)</span>
                        ) : null}
                      </div>
                      <div className="text-xs text-neutral-500">{p.email}</div>
                    </td>
                    <td className="py-2 pr-3 text-neutral-600 dark:text-neutral-400">{p.role ?? "—"}</td>
                    <td className="py-2 pr-3">
                      <select
                        className="w-full min-w-[7rem] rounded border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-600 dark:bg-neutral-950"
                        value={p.os_role ?? ""}
                        disabled={pending}
                        onChange={(e) => {
                          const v = e.target.value;
                          const osRole = v === "" ? null : v === "admin" || v === "client" ? v : null;
                          void run(
                            () => updateProfileOsRoleAction(p.id, osRole),
                            "User role updated."
                          );
                        }}
                      >
                        <option value="">Internal (unset)</option>
                        <option value="admin">Admin</option>
                        {p.id === currentUserId ? null : <option value="client">Client</option>}
                      </select>
                    </td>
                    <td className="py-2 pr-3">
                      <select
                        className="w-full min-w-[10rem] rounded border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-600 dark:bg-neutral-950"
                        value={p.os_client_id ?? ""}
                        disabled={pending}
                        onChange={(e) => {
                          const v = e.target.value;
                          void run(
                            () => updateProfileLinkedClientAction(p.id, v ? v : null),
                            "Linked client updated."
                          );
                        }}
                      >
                        <option value="">—</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Bulk assign leads</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Paste lead UUIDs (comma or newline separated), then pick an assignee.
            </p>
            <textarea
              value={bulkIds}
              onChange={(e) => setBulkIds(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 font-mono text-xs dark:border-neutral-600 dark:bg-neutral-950"
              placeholder="uuid, uuid, …"
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <select
                value={bulkUser}
                onChange={(e) => setBulkUser(e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
              >
                <option value="">Unassigned</option>
                {profiles
                  .filter((p) => p.os_role !== "client")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name?.trim() || p.email || p.id.slice(0, 8)}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                disabled={pending}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                style={{ backgroundColor: brandColor }}
                onClick={() => {
                  const raw = bulkIds.split(/[\s,;]+/).map((x) => x.trim()).filter(Boolean);
                  const assignee = bulkUser || null;
                  void run(
                    () => bulkAssignLeadsAction(raw, assignee),
                    `Bulk assign: ${raw.length} lead(s).`
                  );
                }}
              >
                Assign leads
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {/* Modals */}
      {renameLead ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4" role="dialog">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-neutral-950">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Rename lead stage</h3>
            <input
              value={renameLead.to}
              onChange={(e) => setRenameLead((r) => (r ? { ...r, to: e.target.value } : r))}
              className="mt-3 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="text-sm text-neutral-600" onClick={() => setRenameLead(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
                style={{ backgroundColor: brandColor }}
                onClick={() => {
                  const { from, to } = renameLead;
                  void run(() => renameLeadStageAction(from, to), "Lead stage renamed.");
                  setRenameLead(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {renameProject ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4" role="dialog">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-neutral-950">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Rename project stage</h3>
            <input
              value={renameProject.to}
              onChange={(e) => setRenameProject((r) => (r ? { ...r, to: e.target.value } : r))}
              className="mt-3 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="text-sm text-neutral-600" onClick={() => setRenameProject(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
                style={{ backgroundColor: brandColor }}
                onClick={() => {
                  const { from, to } = renameProject;
                  void run(() => renameProjectStageAction(from, to), "Project stage renamed.");
                  setRenameProject(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteLead ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4" role="dialog">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-neutral-950">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Delete lead stage</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Move all leads in <strong>{deleteLead.stage}</strong> to:
            </p>
            <select
              value={deleteLead.migrateTo}
              onChange={(e) => setDeleteLead((d) => (d ? { ...d, migrateTo: e.target.value } : d))}
              className="mt-2 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              {leadStages
                .filter((s) => s !== deleteLead.stage)
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="text-sm text-neutral-600" onClick={() => setDeleteLead(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
                onClick={() => {
                  const { stage, migrateTo } = deleteLead;
                  void run(() => deleteLeadStageAction(stage, migrateTo), "Lead stage deleted.");
                  setDeleteLead(null);
                }}
              >
                Delete &amp; migrate
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteProject ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4" role="dialog">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-neutral-950">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Delete project stage</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Move all projects in <strong>{deleteProject.stage}</strong> to:
            </p>
            <select
              value={deleteProject.migrateTo}
              onChange={(e) => setDeleteProject((d) => (d ? { ...d, migrateTo: e.target.value } : d))}
              className="mt-2 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            >
              {projectStages
                .filter((s) => s !== deleteProject.stage)
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="text-sm text-neutral-600" onClick={() => setDeleteProject(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
                onClick={() => {
                  const { stage, migrateTo } = deleteProject;
                  void run(() => deleteProjectStageAction(stage, migrateTo), "Project stage deleted.");
                  setDeleteProject(null);
                }}
              >
                Delete &amp; migrate
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
