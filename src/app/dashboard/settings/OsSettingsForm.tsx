"use client";

import { useActionState } from "react";
import type { UpdateOsSettingsState } from "@/app/dashboard/settings/actions";
import { updateOsSettingsAction } from "@/app/dashboard/settings/actions";
import type { OsSettingsRow } from "@/lib/os/types";

type OsSettingsFormProps = {
  settings: OsSettingsRow;
};

function normalizeHex(c: string): string {
  const t = c.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(t)) return t;
  return "#2563eb";
}

export function OsSettingsForm({ settings }: OsSettingsFormProps) {
  const [state, formAction, pending] = useActionState<UpdateOsSettingsState, FormData>(
    updateOsSettingsAction,
    {}
  );

  const defaultColor = normalizeHex(settings.brand_color);

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
          Settings saved.
        </p>
      ) : null}

      <div>
        <label htmlFor="os_name" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          OS name
        </label>
        <input
          id="os_name"
          name="os_name"
          defaultValue={settings.os_name}
          required
          className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
        />
      </div>

      <div>
        <label htmlFor="brand_color" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Brand color
        </label>
        <input
          id="brand_color"
          name="brand_color"
          type="color"
          defaultValue={defaultColor}
          className="mt-1.5 h-10 w-24 cursor-pointer rounded border border-neutral-300 bg-white p-0.5 dark:border-neutral-600"
        />
      </div>

      <div>
        <label htmlFor="currency" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Currency (ISO code)
        </label>
        <input
          id="currency"
          name="currency"
          defaultValue={settings.currency}
          maxLength={8}
          className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm uppercase dark:border-neutral-600 dark:bg-neutral-900"
        />
      </div>

      <div>
        <label htmlFor="timezone" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Timezone
        </label>
        <input
          id="timezone"
          name="timezone"
          defaultValue={settings.timezone}
          className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900"
          placeholder="Australia/Sydney"
        />
      </div>

      <fieldset className="space-y-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
        <legend className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Feature toggles</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="enable_content_engine" defaultChecked={settings.enable_content_engine} />
          Enable Content Engine page
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="enable_analytics" defaultChecked={settings.enable_analytics} />
          Enable Analytics page
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="enable_sops" defaultChecked={settings.enable_sops} />
          Enable SOPs page
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
        style={{ backgroundColor: defaultColor }}
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
