"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { importSpreadsheetToOsLeadsAction } from "@/app/dashboard/leads/sheets-import-actions";

export function LeadSpreadsheetSync({
  brandColor,
  settingsUrl,
  sheetsEnabled,
}: {
  brandColor: string;
  settingsUrl: string;
  sheetsEnabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white"
      >
        Import from spreadsheet
        <span className="text-neutral-400">{open ? "▲" : "▼"}</span>
      </button>
      {open ? (
        <div className="border-t border-neutral-200 px-4 py-4 text-sm dark:border-neutral-800">
          <p className="text-neutral-600 dark:text-neutral-400">
            Pull leads from the same Google Sheet you use today, or upload an Excel/CSV export. Rows match by{" "}
            <strong>email</strong> or <strong>phone</strong> — existing leads update, new ones go to your{" "}
            <strong>New</strong> stage.
          </p>

          <div className="mt-4 rounded-lg bg-neutral-50 p-3 text-xs dark:bg-neutral-950">
            <p className="font-semibold text-neutral-800 dark:text-neutral-200">One-time or occasional import</p>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              Export your sheet as .xlsx or .csv, or upload the file directly. Column headers should match the mapping
              in Settings (defaults: Name, Business, Email, Phone, Source, Tags, Temperature).
            </p>
            <form
              className="mt-3 flex flex-wrap items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setErr(null);
                setMessage(null);
                const fd = new FormData(e.currentTarget);
                startTransition(async () => {
                  const r = await importSpreadsheetToOsLeadsAction(fd);
                  if (!r.ok) {
                    setErr(r.error);
                    return;
                  }
                  const d = r.data!;
                  const parts = [
                    `${d.created} new`,
                    `${d.updated} updated`,
                    d.skipped ? `${d.skipped} skipped` : null,
                  ].filter(Boolean);
                  setMessage(`Import complete: ${parts.join(", ")}.`);
                  if (d.warnings.length) setMessage((m) => `${m} ${d.warnings[0]}`);
                  if (d.errors.length) setErr(d.errors.join(" "));
                  e.currentTarget.reset();
                });
              }}
            >
              <input type="file" name="file" accept=".xlsx,.xls,.csv" required className="text-xs" />
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: brandColor }}
              >
                {pending ? "Importing…" : "Upload & import"}
              </button>
            </form>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-neutral-300 p-3 text-xs dark:border-neutral-600">
            <p className="font-semibold text-neutral-800 dark:text-neutral-200">Live sync from Google Sheets</p>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              For automatic imports when a new row is added, enable the Google Sheets webhook in{" "}
              <Link href={settingsUrl} className="font-medium text-sky-700 underline dark:text-sky-400">
                Settings → Integrations
              </Link>
              , paste the Apps Script, and add a trigger (new row or form submit).
              {sheetsEnabled ? (
                <span className="ml-1 text-emerald-700 dark:text-emerald-400">Sheets sync is enabled.</span>
              ) : (
                <span className="ml-1 text-amber-700 dark:text-amber-400">Sheets sync is off until you enable it.</span>
              )}
            </p>
          </div>

          {message ? <p className="mt-3 text-xs text-emerald-800 dark:text-emerald-300">{message}</p> : null}
          {err ? <p className="mt-2 text-xs text-red-600">{err}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
