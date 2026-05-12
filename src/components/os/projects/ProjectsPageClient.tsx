"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
  updateProjectStatusAction,
  type ProjectUpsertPayload,
} from "@/app/dashboard/projects/actions";
import type { OsClientRow, OsProjectRow } from "@/lib/os/os-entity-types";
import { cn } from "@/lib/utils";

const PROJECT_MIME = "application/x-os-project-id";

type ProjectsPageClientProps = {
  initialProjects: OsProjectRow[];
  projectStages: string[];
  clients: OsClientRow[];
  brandColor: string;
  isInternal: boolean;
  linkedClientId: string | null;
};

function clientLabel(clients: OsClientRow[], id: string): string {
  const c = clients.find((x) => x.id === id);
  if (!c) return id.slice(0, 8) + "…";
  return c.business_name?.trim() || c.contact_name?.trim() || id.slice(0, 8);
}

function normalizeStatus(stages: string[], status: string): string {
  return stages.includes(status) ? status : stages[0] ?? status;
}

export function ProjectsPageClient({
  initialProjects,
  projectStages,
  clients,
  brandColor,
  isInternal,
  linkedClientId,
}: ProjectsPageClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [modal, setModal] = useState<"closed" | "create" | { edit: OsProjectRow }>("closed");
  const [form, setForm] = useState<ProjectUpsertPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const { activeCount, recurringCount } = useMemo(() => {
    let active = 0;
    let recurring = 0;
    for (const p of projects) {
      if (p.status !== "Live") active += 1;
      if (p.recurring) recurring += 1;
    }
    return { activeCount: active, recurringCount: recurring };
  }, [projects]);

  const projectsByStatus = useMemo(() => {
    const m = new Map<string, OsProjectRow[]>();
    for (const s of projectStages) m.set(s, []);
    for (const p of projects) {
      const st = normalizeStatus(projectStages, p.status);
      if (!m.has(st)) m.set(st, []);
      m.get(st)!.push(p);
    }
    return m;
  }, [projects, projectStages]);

  function openCreate() {
    setErr(null);
    setForm({
      project_name: "",
      client_id: linkedClientId ?? (clients[0]?.id ?? ""),
      status: projectStages[0] ?? "Onboarding",
      start_date: null,
      due_date: null,
      recurring: false,
      notes: null,
    });
    setModal("create");
  }

  function openEdit(p: OsProjectRow) {
    setErr(null);
    setForm({
      project_name: p.project_name,
      client_id: p.client_id,
      status: p.status,
      start_date: p.start_date,
      due_date: p.due_date,
      recurring: p.recurring,
      notes: p.notes,
    });
    setModal({ edit: p });
  }

  async function submit() {
    if (!form) return;
    setErr(null);
    if (!form.client_id.trim()) {
      setErr("Client is required.");
      return;
    }
    setBusy(true);
    try {
      if (modal === "create") {
        const r = await createProjectAction(form);
        if (!r.ok) setErr(r.error);
        else {
          setModal("closed");
          refresh();
        }
      } else if (typeof modal === "object" && "edit" in modal) {
        const r = await updateProjectAction(modal.edit.id, form);
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

  async function onDropToStage(projectId: string, stage: string) {
    startTransition(async () => {
      const r = await updateProjectStatusAction(projectId, stage);
      if (r.ok) {
        setProjects((prev) => prev.map((x) => (x.id === projectId ? { ...x, status: stage } : x)));
        refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Projects</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
            Track and manage your active and recurring projects
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {activeCount} active • {recurringCount} recurring
          </p>
          {isInternal ? (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: brandColor }}
            >
              Add Project
            </button>
          ) : null}
        </div>
      </header>

      <div
        className={cn("flex gap-3 overflow-x-auto pb-2")}
      >
        {projectStages.map((stage) => (
          <ProjectColumn
            key={stage}
            stage={stage}
            projects={projectsByStatus.get(stage) ?? []}
            clients={clients}
            brandColor={brandColor}
            onCardClick={openEdit}
            onDropProject={(id) => void onDropToStage(id, stage)}
          />
        ))}
      </div>

      {modal !== "closed" && form ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-950">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {modal === "create" ? "Add project" : "Edit project"}
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
              <Field label="Project name">
                <input
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.project_name}
                  onChange={(e) => setForm((f) => (f ? { ...f, project_name: e.target.value } : f))}
                />
              </Field>
              <Field label="Client">
                {isInternal ? (
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
                ) : (
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                    {clientLabel(clients, form.client_id)}
                  </p>
                )}
              </Field>
              <Field label="Status">
                <select
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={normalizeStatus(projectStages, form.status)}
                  onChange={(e) => setForm((f) => (f ? { ...f, status: e.target.value } : f))}
                >
                  {projectStages.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Start date">
                <input
                  type="date"
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.start_date ?? ""}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, start_date: e.target.value || null } : f))
                  }
                />
              </Field>
              <Field label="Due date">
                <input
                  type="date"
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.due_date ?? ""}
                  onChange={(e) => setForm((f) => (f ? { ...f, due_date: e.target.value || null } : f))}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
                <input
                  type="checkbox"
                  checked={form.recurring}
                  onChange={(e) => setForm((f) => (f ? { ...f, recurring: e.target.checked } : f))}
                />
                Recurring
              </label>
              <Field label="Notes">
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.notes ?? ""}
                  onChange={(e) => setForm((f) => (f ? { ...f, notes: e.target.value || null } : f))}
                />
              </Field>
            </div>
            {typeof modal === "object" && "edit" in modal && isInternal ? (
              <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <button
                  type="button"
                  className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                  onClick={() => {
                    if (!confirm("Delete this project?")) return;
                    void (async () => {
                      const r = await deleteProjectAction(modal.edit.id);
                      if (!r.ok) setErr(r.error);
                      else {
                        setModal("closed");
                        refresh();
                      }
                    })();
                  }}
                >
                  Delete project
                </button>
              </div>
            ) : null}
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

function ProjectColumn({
  stage,
  projects: colProjects,
  clients,
  brandColor,
  onCardClick,
  onDropProject,
}: {
  stage: string;
  projects: OsProjectRow[];
  clients: OsClientRow[];
  brandColor: string;
  onCardClick: (p: OsProjectRow) => void;
  onDropProject: (projectId: string) => void;
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
        const id = e.dataTransfer.getData(PROJECT_MIME);
        if (id) onDropProject(id);
      }}
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{stage}</span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: brandColor }}
        >
          {colProjects.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2">
        {colProjects.map((p) => (
          <button
            key={p.id}
            type="button"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(PROJECT_MIME, p.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onClick={() => onCardClick(p)}
            className="rounded-lg border border-neutral-200 bg-white p-3 text-left shadow-sm transition hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:border-neutral-600"
          >
            <p className="font-medium text-neutral-900 dark:text-white">{p.project_name || "Project"}</p>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{clientLabel(clients, p.client_id)}</p>
            {p.recurring ? (
              <span className="mt-2 inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                Recurring
              </span>
            ) : null}
          </button>
        ))}
      </div>
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
