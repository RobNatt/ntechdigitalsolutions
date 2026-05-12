"use client";

import { useCallback, useEffect, useState } from "react";
import {
  regenerateIntegrationWebhookSecretAction,
  saveIntegrationSettingsAction,
} from "@/app/dashboard/settings/actions";
import {
  DEFAULT_SHEETS_COLUMN_MAP,
  mergeSheetsColumnMap,
  SHEET_LEAD_FIELD_KEYS,
  type SheetLeadFieldKey,
} from "@/lib/integrations/webhook-handlers";
import type { OsSettingsRow } from "@/lib/os/types";

const FIELD_LABELS: Record<SheetLeadFieldKey, string> = {
  lead_name: "Lead name",
  business_name: "Business name",
  email: "Email",
  phone: "Phone",
  source: "Source",
  tags: "Tags",
  temperature: "Temperature",
};

const SHEETS_PAYLOAD_DOC = `{
  "sheetId": "YOUR_SPREADSHEET_ID",
  "sheetName": "Leads",
  "row": {
    "Name": "Jane Doe",
    "Business": "Acme Co",
    "Email": "jane@example.com",
    "Phone": "+61 400 000 000",
    "Source": "Google Sheet",
    "Tags": "Cold, Referral",
    "Temperature": "Cold"
  }
}`;

type IntegrationsSectionProps = {
  settings: OsSettingsRow;
  brandColor: string;
  leadStages: string[];
  webhookBaseUrl: string;
  pending: boolean;
  startTransition: (fn: () => void) => void;
  onFlash: (kind: "ok" | "err", text: string) => void;
  onRefresh: () => void;
};

export function IntegrationsSection({
  settings,
  brandColor,
  leadStages,
  webhookBaseUrl,
  pending,
  startTransition,
  onFlash,
  onRefresh,
}: IntegrationsSectionProps) {
  const base = webhookBaseUrl.replace(/\/$/, "") || "https://YOUR_DEPLOYED_APP_DOMAIN";
  const sheetsUrl = `${base}/api/webhooks/sheets`;
  const calendlyUrl = `${base}/api/webhooks/calendly`;

  const [sheetsOn, setSheetsOn] = useState(settings.integration_sheets_enabled);
  const [calOn, setCalOn] = useState(settings.integration_calendly_enabled);
  const [gcalOn, setGcalOn] = useState(settings.integration_google_calendar_enabled);
  const [bookedStage, setBookedStage] = useState(settings.integration_calendly_booked_stage);
  const [calendarId, setCalendarId] = useState(settings.integration_google_calendar_id ?? "");
  const [oauthConnected, setOauthConnected] = useState(settings.integration_google_oauth_connected);
  const [colMap, setColMap] = useState<Record<SheetLeadFieldKey, string>>(() =>
    mergeSheetsColumnMap(settings.integration_sheets_column_map)
  );
  const [displaySecret, setDisplaySecret] = useState(settings.integration_webhook_secret ?? "");
  const [icsFrom, setIcsFrom] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}-01`;
  });
  const [icsTo, setIcsTo] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setSheetsOn(settings.integration_sheets_enabled);
    setCalOn(settings.integration_calendly_enabled);
    setGcalOn(settings.integration_google_calendar_enabled);
    setBookedStage(settings.integration_calendly_booked_stage);
    setCalendarId(settings.integration_google_calendar_id ?? "");
    setOauthConnected(settings.integration_google_oauth_connected);
    setColMap(mergeSheetsColumnMap(settings.integration_sheets_column_map));
    setDisplaySecret(settings.integration_webhook_secret ?? "");
  }, [settings]);

  const save = useCallback(() => {
    startTransition(async () => {
      const r = await saveIntegrationSettingsAction({
        integration_sheets_enabled: sheetsOn,
        integration_calendly_enabled: calOn,
        integration_google_calendar_enabled: gcalOn,
        integration_calendly_booked_stage: bookedStage,
        integration_google_calendar_id: calendarId || null,
        integration_google_oauth_connected: oauthConnected,
        integration_sheets_column_map: { ...colMap },
      });
      if (r.ok) {
        onFlash("ok", "Integrations saved.");
        onRefresh();
      } else onFlash("err", r.error ?? "Save failed.");
    });
  }, [
    sheetsOn,
    calOn,
    gcalOn,
    bookedStage,
    calendarId,
    oauthConnected,
    colMap,
    onFlash,
    onRefresh,
    startTransition,
  ]);

  const appsScriptSample = `// --- Paste your webhook URL and token (from Settings → Integrations) ---
var WEBHOOK_URL = "${sheetsUrl}";
var WEBHOOK_TOKEN = "PASTE_TOKEN_FROM_SETTINGS";

/**
 * Option A: Form submit (recommended) — tie this to a Google Form "on form submit" trigger
 * so each submission sends one row to your app.
 */
function onFormSubmit(e) {
  var namedValues = e.namedValues;
  var row = {};
  for (var key in namedValues) {
    if (namedValues.hasOwnProperty(key)) {
      row[key] = (namedValues[key] && namedValues[key][0]) ? namedValues[key][0] : "";
    }
  }
  postRow_(row);
}

/**
 * Option B: After a new row is appended to a sheet (installable trigger on change).
 */
function onChangeInstallable(e) {
  if (e.changeType !== "INSERT_ROW") return;
  var sh = e.source.getActiveSheet();
  var rowIndex = e.range.getRow();
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var values = sh.getRange(rowIndex, 1, rowIndex, sh.getLastColumn()).getValues()[0];
  var row = {};
  for (var i = 0; i < headers.length; i++) {
    row[String(headers[i])] = values[i];
  }
  postRow_(row);
}

function postRow_(row) {
  var payload = {
    sheetId: SpreadsheetApp.getActive().getId(),
    sheetName: SpreadsheetApp.getActiveSheet().getName(),
    row: row
  };
  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    headers: { "X-Webhook-Token": WEBHOOK_TOKEN },
    payload: JSON.stringify(payload)
  });
}`;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Integrations (optional)</h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Connect external tools with webhooks. The app runs normally if you leave everything off. Never commit API keys;
        only the shared webhook token is stored here (rotate anytime).
      </p>

      <div className="mt-4 space-y-3 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm dark:border-neutral-600 dark:bg-neutral-950/60">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={sheetsOn} onChange={(e) => setSheetsOn(e.target.checked)} />
          Enable Google Sheets lead sync (incoming)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={calOn} onChange={(e) => setCalOn(e.target.checked)} />
          Enable Calendly booking sync (incoming)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={gcalOn} onChange={(e) => setGcalOn(e.target.checked)} />
          Enable Google Calendar sync (outgoing — placeholder; OAuth not wired yet)
        </label>
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Webhook endpoints</p>
        <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300">{sheetsUrl}</p>
        <p className="font-mono text-xs text-neutral-700 dark:text-neutral-300">{calendlyUrl}</p>
        <p className="text-xs text-neutral-500">
          Send <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">POST</code> JSON with header{" "}
          <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">X-Webhook-Token</code> equal to your secret
          below. Invalid token → 401.
        </p>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Webhook secret token</p>
        <p className="mt-1 text-xs text-neutral-500">
          Auto-created when you first enable Sheets or Calendly and save. Use the same token for both endpoints.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            readOnly
            value={displaySecret}
            placeholder="(generated after save when an inbound integration is enabled)"
            className="min-w-[16rem] flex-1 rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 font-mono text-xs dark:border-neutral-600 dark:bg-neutral-900"
          />
          <button
            type="button"
            disabled={pending}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium dark:border-neutral-600"
            onClick={() =>
              startTransition(async () => {
                const r = await regenerateIntegrationWebhookSecretAction();
                if (r.ok && r.data) {
                  setDisplaySecret(r.data.secret);
                  onFlash("ok", "New webhook token generated. Update your Apps Script / Calendly relay.");
                  onRefresh();
                } else if (!r.ok) onFlash("err", r.error);
              })
            }
          >
            Regenerate token
          </button>
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Sheets → lead field mapping</h3>
        <p className="mt-1 text-xs text-neutral-500">
          Enter the <strong>exact column header</strong> text from your sheet for each CRM field. Defaults match the
          sample payload below.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {SHEET_LEAD_FIELD_KEYS.map((key) => (
            <label key={key} className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
              {FIELD_LABELS[key]} → sheet column
              <input
                value={colMap[key]}
                onChange={(e) => setColMap((m) => ({ ...m, [key]: e.target.value }))}
                placeholder={DEFAULT_SHEETS_COLUMN_MAP[key]}
                className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-950"
              />
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
          <strong>New leads from Sheets</strong> use your pipeline setting{" "}
          <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">uncontacted_stage</code> (
          {settings.uncontacted_stage}). Existing leads match by email, else phone.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/80">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Expected Sheets JSON</p>
        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
          {SHEETS_PAYLOAD_DOC}
        </pre>
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Sample Google Apps Script</p>
        <p className="mt-1 text-xs text-neutral-500">
          Extensions → Apps Script → paste, set{" "}
          <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">WEBHOOK_TOKEN</code> from above, then add a
          trigger (form submit or spreadsheet on change).
        </p>
        <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-neutral-800 dark:text-neutral-200">
          {appsScriptSample}
        </pre>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Calendly status mapping</h3>
        <p className="mt-1 text-xs text-neutral-500">
          When a booking webhook is processed, the lead moves to this pipeline stage (defaults to Booked).
        </p>
        <select
          value={leadStages.includes(bookedStage) ? bookedStage : (leadStages[0] ?? "Booked")}
          onChange={(e) => setBookedStage(e.target.value)}
          className="mt-2 w-full max-w-md rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-950"
        >
          {leadStages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-neutral-500">
          Calendly sends varied JSON shapes. This endpoint tries common paths for invitee email, times, and meeting
          links. For production, use a Calendly webhook subscription or a small relay that posts the minimal JSON your
          agency prefers.
        </p>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Google Calendar (optional)</h3>
        <p className="mt-1 text-xs text-neutral-500">
          OAuth push to Google Calendar is not implemented yet (no client secrets in repo). Use{" "}
          <strong>ICS export</strong> to pull dashboard events into any calendar app, or store a target calendar ID for
          when OAuth is added.
        </p>
        <label className="mt-3 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Calendar ID (placeholder, e.g. primary or group calendar email)
          <input
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            className="mt-1 w-full max-w-xl rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            placeholder="you@group.calendar.google.com"
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <input type="checkbox" checked={oauthConnected} onChange={(e) => setOauthConnected(e.target.checked)} />
          OAuth connected (manual checkbox — wire Google OAuth later)
        </label>
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Export from
            <input
              type="date"
              value={icsFrom}
              onChange={(e) => setIcsFrom(e.target.value)}
              className="mt-1 block rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            to
            <input
              type="date"
              value={icsTo}
              onChange={(e) => setIcsTo(e.target.value)}
              className="mt-1 block rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-600 dark:bg-neutral-950"
            />
          </label>
          <a
            href={`/api/integrations/calendar.ics?from=${encodeURIComponent(icsFrom)}&to=${encodeURIComponent(icsTo)}`}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            Download .ics (signed-in)
          </a>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          disabled={pending}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: brandColor }}
          onClick={() => save()}
        >
          Save integrations
        </button>
      </div>
    </section>
  );
}
