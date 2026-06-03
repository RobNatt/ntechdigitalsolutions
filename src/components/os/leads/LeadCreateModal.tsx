"use client";

import { useState } from "react";
import {
  checkLeadDuplicatesAction,
  createLeadAction,
  type LeadUpsertPayload,
} from "@/app/dashboard/leads/actions";
import { formatTagsForInput, isValidEmail, mergeTagIntoTagsInput, normalizePhoneDigits } from "@/lib/os/lead-utils";
import type { AssigneeOption } from "@/lib/os/leads-types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
      {label}
      {children}
    </label>
  );
}

export function LeadCreateModal({
  leadStages,
  leadTemperatures,
  assignees,
  isInternal,
  brandColor,
  commonTags,
  onClose,
  onSaved,
}: {
  leadStages: string[];
  leadTemperatures: string[];
  assignees: AssigneeOption[];
  isInternal: boolean;
  brandColor: string;
  commonTags: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<LeadUpsertPayload>({
    lead_name: "",
    business_name: "",
    email: null,
    phone: null,
    source: null,
    status: leadStages[0] ?? "New",
    temperature: leadTemperatures[0] ?? "Cold",
    tags: "",
    assigned_user_id: null,
    linkedin_url: null,
  });
  const [dupWarn, setDupWarn] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function checkDup() {
    if (!form.email?.trim() && !normalizePhoneDigits(form.phone)) {
      setDupWarn(null);
      return;
    }
    const r = await checkLeadDuplicatesAction(form.email, form.phone, null);
    if (!r.ok) return;
    const parts: string[] = [];
    if (r.data?.emailMatch) parts.push("email");
    if (r.data?.phoneMatch) parts.push("phone");
    setDupWarn(parts.length ? `Another lead already uses this ${parts.join(" and ")}.` : null);
  }

  async function submit() {
    setErr(null);
    if (form.email?.trim() && !isValidEmail(form.email.trim())) {
      setErr("Enter a valid email or leave email blank.");
      return;
    }
    setBusy(true);
    try {
      const r = await createLeadAction(form);
      if (!r.ok) setErr(r.error);
      else onSaved();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-950">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Add lead</h2>
          <button type="button" onClick={onClose} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
            ✕
          </button>
        </div>
        {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
        {dupWarn ? <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">{dupWarn}</p> : null}
        <div className="mt-4 space-y-3">
          <Field label="Lead name">
            <input
              className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
              value={form.lead_name}
              onChange={(e) => setForm((f) => ({ ...f, lead_name: e.target.value }))}
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
              onBlur={() => void checkDup()}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value || null }))}
            />
          </Field>
          <Field label="Phone">
            <input
              className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
              value={form.phone ?? ""}
              onBlur={() => void checkDup()}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value || null }))}
            />
          </Field>
          <Field label="LinkedIn URL">
            <input
              className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
              value={form.linkedin_url ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value || null }))}
              placeholder="https://linkedin.com/in/…"
            />
          </Field>
          <Field label="Source">
            <input
              className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
              value={form.source ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, source: e.target.value || null }))}
            />
          </Field>
          <Field label="Stage">
            <select
              className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              {leadStages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Temperature">
            <select
              className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
              value={form.temperature}
              onChange={(e) => setForm((f) => ({ ...f, temperature: e.target.value }))}
            >
              {leadTemperatures.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tags (comma-separated)">
            <input
              className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            />
          </Field>
          {commonTags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {commonTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] dark:border-neutral-600"
                  onClick={() => setForm((f) => ({ ...f, tags: mergeTagIntoTagsInput(f.tags, t) }))}
                >
                  +{t}
                </button>
              ))}
            </div>
          ) : null}
          {isInternal ? (
            <Field label="Assigned user">
              <select
                className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                value={form.assigned_user_id ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, assigned_user_id: e.target.value || null }))}
              >
                <option value="">—</option>
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-neutral-600">
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: brandColor }}
          >
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
