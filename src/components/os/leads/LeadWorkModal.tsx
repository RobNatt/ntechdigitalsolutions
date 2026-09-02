"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  checkLeadDuplicatesAction,
  convertLeadToClientAction,
  convertLeadToProjectAction,
  deleteLeadAction,
  moveLeadStatusAction,
  updateLeadAction,
  type LeadUpsertPayload,
} from "@/app/dashboard/leads/actions";
import {
  createLeadMeetingAction,
  deleteLeadDocumentAction,
  getLeadDocumentDownloadUrlAction,
  getLeadWorkspaceAction,
  logLeadTouchAction,
  refreshLeadRowAction,
  saveLeadPipelineNotesAction,
  toggleLeadChecklistAction,
  updateLeadMeetingStatusAction,
  uploadLeadDocumentAction,
} from "@/app/dashboard/leads/workflow-actions";
import { formatTagsForInput, isValidEmail, mergeTagIntoTagsInput, normalizePhoneDigits } from "@/lib/os/lead-utils";
import {
  EVENT_MEETING_STATUSES,
  TOUCH_CHANNELS,
  TOUCH_OUTCOMES,
  defaultNextFollowUpAt,
  followUpCadenceDays,
  formatFollowUpDue,
  touchChannelLabel,
} from "@/lib/os/lead-workflow";
import { GhlBookingButton } from "@/components/scheduling/GhlBookingButton";
import {
  buildGhlBookingUrl,
  ghlEventLabelForLead,
  type OsGhlBookingConfig,
} from "@/lib/os/ghl-booking";
import {
  defaultNextFollowUpDateValue,
  followUpAtFromDateOnly,
} from "@/lib/os/leads-follow-up-calendar";
import type { AssigneeOption, OsLeadRow } from "@/lib/os/leads-types";
import type { LeadWorkspaceData } from "@/lib/os/leads-workflow-types";
import { cn } from "@/lib/utils";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
      {label}
      {children}
    </label>
  );
}

function cardTitle(lead: OsLeadRow): string {
  const n = lead.lead_name?.trim();
  if (n) return n;
  return lead.business_name?.trim() || "Lead";
}

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocalValue(v: string): string {
  return new Date(v).toISOString();
}

function defaultMeetingRange(): { start: string; end: string } {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30);
  return { start: start.toISOString(), end: end.toISOString() };
}

function phoneTelHref(phone: string | null | undefined): string | null {
  const digits = normalizePhoneDigits(phone);
  if (digits.length < 10) return null;
  return `tel:+${digits}`;
}

function smsHref(phone: string | null | undefined): string | null {
  const digits = normalizePhoneDigits(phone);
  if (digits.length < 10) return null;
  return `sms:+${digits}`;
}

export function LeadWorkModal({
  lead: initialLead,
  leadStages,
  leadTemperatures,
  assignees,
  isInternal,
  brandColor,
  commonTags,
  ghlBookingConfig,
  timezone,
  onClose,
  onSaved,
  onDeleted,
  onLeadUpdated,
}: {
  lead: OsLeadRow;
  leadStages: string[];
  leadTemperatures: string[];
  assignees: AssigneeOption[];
  isInternal: boolean;
  brandColor: string;
  commonTags: string[];
  ghlBookingConfig: OsGhlBookingConfig | null;
  timezone: string;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: (id: string) => void;
  onLeadUpdated?: (lead: OsLeadRow) => void;
}) {
  const leadId = initialLead.id;
  const onLeadUpdatedRef = useRef(onLeadUpdated);
  onLeadUpdatedRef.current = onLeadUpdated;

  const [lead, setLead] = useState(initialLead);
  const [workspace, setWorkspace] = useState<LeadWorkspaceData | null>(null);
  const [loadingWs, setLoadingWs] = useState(true);
  const notesDirtyRef = useRef(false);
  const [showEdit, setShowEdit] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [touchChannel, setTouchChannel] = useState<string>("call");
  const [touchOutcome, setTouchOutcome] = useState<string>("connected");
  const [touchNotes, setTouchNotes] = useState("");
  const [touchNextDate, setTouchNextDate] = useState("");
  const [touchMoveStage, setTouchMoveStage] = useState("");

  const [pipelineNotes, setPipelineNotes] = useState("");
  const [notesDirty, setNotesDirty] = useState(false);

  const [meetingTitle, setMeetingTitle] = useState("Discovery call");
  const [meetingStart, setMeetingStart] = useState("");
  const [meetingEnd, setMeetingEnd] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [showManualMeeting, setShowManualMeeting] = useState(false);
  const docUploadFormRef = useRef<HTMLFormElement>(null);
  const [docFileName, setDocFileName] = useState("");
  const [docUploadMsg, setDocUploadMsg] = useState<string | null>(null);

  const bookingUrl = useMemo(() => {
    if (!ghlBookingConfig) return "";
    return buildGhlBookingUrl(lead, ghlBookingConfig);
  }, [lead, ghlBookingConfig]);

  const bookingLabel = useMemo(() => {
    return ghlEventLabelForLead(lead.status);
  }, [lead.status]);

  const [form, setForm] = useState<LeadUpsertPayload>(() => ({
    lead_name: lead.lead_name,
    business_name: lead.business_name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    status: lead.status,
    temperature: lead.temperature,
    tags: formatTagsForInput(lead.tags),
    assigned_user_id: lead.assigned_user_id,
    linkedin_url: lead.linkedin_url,
  }));
  const [dupWarn, setDupWarn] = useState<string | null>(null);

  const cadenceDays = followUpCadenceDays(lead.temperature);
  const lastTouch = workspace?.touchpoints[0] ?? null;

  const stageChecklist = useMemo(() => {
    if (!workspace) return [];
    return workspace.checklist.filter((c) => c.stage === lead.status);
  }, [workspace, lead.status]);

  const reloadWorkspace = useCallback(
    async (options?: { background?: boolean }) => {
      if (!options?.background) setLoadingWs(true);
      try {
        const r = await getLeadWorkspaceAction(leadId);
        if (r.ok && r.data) {
          setWorkspace(r.data);
          if (!notesDirtyRef.current) setPipelineNotes(r.data.pipeline_notes ?? "");
        } else if (!r.ok) setErr(r.error);
        const row = await refreshLeadRowAction(leadId);
        if (row.ok && row.data) {
          setLead(row.data.lead);
          onLeadUpdatedRef.current?.(row.data.lead);
        }
      } finally {
        setLoadingWs(false);
      }
    },
    [leadId]
  );

  useEffect(() => {
    setLead(initialLead);
    setWorkspace(null);
    setNotesDirty(false);
    notesDirtyRef.current = false;
    setErr(null);
    void reloadWorkspace();
    // Only re-fetch when opening a different lead (not when parent syncs the same row).
  }, [leadId, reloadWorkspace]);

  useEffect(() => {
    setTouchNextDate(defaultNextFollowUpDateValue(lead.temperature, timezone));
  }, [lead.temperature, lead.id, timezone]);

  useEffect(() => {
    const { start, end } = defaultMeetingRange();
    setMeetingStart(toDatetimeLocalValue(start));
    setMeetingEnd(toDatetimeLocalValue(end));
    if (lead.status === "Proposal Meeting") setMeetingTitle("Proposal meeting");
    else if (lead.status === "Discovery Call") setMeetingTitle("Discovery call");
  }, [lead.id, lead.status]);

  async function submitTouch() {
    setErr(null);
    if (!touchNotes.trim() && touchOutcome === "other") {
      setErr("Add a short note about what happened.");
      return;
    }
    setBusy(true);
    try {
      const r = await logLeadTouchAction(lead.id, {
        channel: touchChannel,
        outcome: touchOutcome,
        notes: touchNotes.trim() || null,
        next_follow_up_at: touchNextDate ? followUpAtFromDateOnly(touchNextDate, timezone) : null,
        move_to_stage: touchMoveStage || null,
      });
      if (!r.ok) {
        setErr(r.error);
        return;
      }
      setTouchNotes("");
      setTouchMoveStage("");
      await reloadWorkspace({ background: true });
    } finally {
      setBusy(false);
    }
  }

  async function saveNotes() {
    setBusy(true);
    const r = await saveLeadPipelineNotesAction(lead.id, pipelineNotes);
    setBusy(false);
    if (!r.ok) setErr(r.error);
    else {
      setNotesDirty(false);
      await reloadWorkspace({ background: true });
    }
  }

  async function submitEdit() {
    setErr(null);
    if (form.email?.trim() && !isValidEmail(form.email.trim())) {
      setErr("Enter a valid email or leave email blank.");
      return;
    }
    setBusy(true);
    const r = await updateLeadAction(lead.id, form);
    setBusy(false);
    if (!r.ok) setErr(r.error);
    else {
      setShowEdit(false);
      onSaved();
      await reloadWorkspace({ background: true });
    }
  }

  const telHref = phoneTelHref(lead.phone);
  const smsLink = smsHref(lead.phone);
  const linkedIn = lead.linkedin_url?.trim() || workspace?.linkedin_url?.trim() || null;

  const nextDueIso = workspace?.next_follow_up_at ?? lead.next_follow_up_at;
  const isOverdue = nextDueIso ? new Date(nextDueIso).getTime() < Date.now() : false;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{cardTitle(lead)}</h2>
            {lead.business_name && lead.lead_name ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{lead.business_name}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: brandColor }}
              >
                {lead.status}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium uppercase text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {lead.temperature}
              </span>
              {isOverdue ? (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-950 dark:text-red-300">
                  Follow-up overdue
                </span>
              ) : null}
            </div>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-neutral-500 hover:text-neutral-800">
            ✕
          </button>
        </div>

        {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}

        {/* Contact methods — always visible for logging outreach */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Contact</p>
          <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <span className="w-14 shrink-0 text-xs text-neutral-500">Phone</span>
              {lead.phone ? (
                <div className="min-w-0">
                  <a href={telHref ?? undefined} className="font-medium text-sky-700 hover:underline dark:text-sky-400">
                    {lead.phone}
                  </a>
                </div>
              ) : (
                <span className="text-neutral-400">—</span>
              )}
            </div>
            <div className="flex items-start gap-2">
              <span className="w-14 shrink-0 text-xs text-neutral-500">Email</span>
              {lead.email ? (
                <a
                  href={`mailto:${lead.email}`}
                  className="min-w-0 break-all font-medium text-sky-700 hover:underline dark:text-sky-400"
                >
                  {lead.email}
                </a>
              ) : (
                <span className="text-neutral-400">—</span>
              )}
            </div>
            <div className="flex items-start gap-2 sm:col-span-2">
              <span className="w-14 shrink-0 text-xs text-neutral-500">LinkedIn</span>
              {linkedIn ? (
                <a
                  href={linkedIn.startsWith("http") ? linkedIn : `https://${linkedIn}`}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 break-all font-medium text-sky-700 hover:underline dark:text-sky-400"
                >
                  {linkedIn.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                <span className="text-neutral-400">—</span>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {telHref ? (
              <a
                href={telHref}
                onClick={() => setTouchChannel("call")}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                Call
              </a>
            ) : null}
            {smsLink ? (
              <a
                href={smsLink}
                onClick={() => setTouchChannel("sms")}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                Text
              </a>
            ) : null}
            {lead.email ? (
              <a
                href={`mailto:${lead.email}`}
                onClick={() => setTouchChannel("email")}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                Email
              </a>
            ) : null}
            {linkedIn ? (
              <a
                href={linkedIn.startsWith("http") ? linkedIn : `https://${linkedIn}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setTouchChannel("linkedin")}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                LinkedIn
              </a>
            ) : null}
            {!lead.phone && !lead.email && !linkedIn ? (
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Add phone, email, or LinkedIn under Edit lead details to use quick contact actions.
              </p>
            ) : null}
          </div>
        </div>

        {/* Snapshot */}
        <div className="mt-4 grid gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900/60 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Last touch</p>
            {loadingWs ? (
              <p className="mt-1 text-neutral-400">Loading…</p>
            ) : lastTouch ? (
              <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                <span className="font-medium">{touchChannelLabel(lastTouch.channel)}</span>
                {lastTouch.outcome ? ` · ${lastTouch.outcome}` : ""}
                <span className="block text-xs text-neutral-500">
                  {new Date(lastTouch.touched_at).toLocaleString()}
                </span>
                {lastTouch.notes ? (
                  <span className="mt-1 block text-xs text-neutral-600 dark:text-neutral-400">{lastTouch.notes}</span>
                ) : null}
              </p>
            ) : (
              <p className="mt-1 text-neutral-500">No outreach logged yet.</p>
            )}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">What&apos;s next</p>
            <p className={cn("mt-1 font-medium", isOverdue ? "text-red-700 dark:text-red-400" : "text-neutral-900 dark:text-white")}>
              {formatFollowUpDue(nextDueIso)}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {lead.temperature} leads: follow up every {cadenceDays} day{cadenceDays === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* Quick stage move */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Move pipeline stage</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {leadStages.map((s) => (
              <button
                key={s}
                type="button"
                disabled={busy || s === lead.status}
                onClick={async () => {
                  setBusy(true);
                  const r = await moveLeadStatusAction(lead.id, s);
                  setBusy(false);
                  if (!r.ok) setErr(r.error);
                  else await reloadWorkspace({ background: true });
                }}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-xs font-medium transition",
                  s === lead.status
                    ? "border-transparent text-white"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
                )}
                style={s === lead.status ? { backgroundColor: brandColor } : undefined}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Log follow-up — primary action */}
        <section className="mt-6 rounded-xl border-2 border-dashed border-neutral-300 p-4 dark:border-neutral-700">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Log follow-up</h3>
          <p className="mt-1 text-xs text-neutral-500">
            How did you reach out? Pick the next follow-up <strong>date</strong> only — use the daily Leads follow-up
            block on your calendar for timing.
          </p>
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Outreach type</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {TOUCH_CHANNELS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setTouchChannel(c)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-medium transition",
                    touchChannel === c
                      ? "border-transparent text-white"
                      : "border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  )}
                  style={touchChannel === c ? { backgroundColor: brandColor } : undefined}
                >
                  {touchChannelLabel(c)}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Outcome">
              <select
                className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                value={touchOutcome}
                onChange={(e) => setTouchOutcome(e.target.value)}
              >
                {TOUCH_OUTCOMES.map((o) => (
                  <option key={o} value={o}>
                    {o.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="What happened?">
            <textarea
              className="mt-1 min-h-[72px] w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
              value={touchNotes}
              onChange={(e) => setTouchNotes(e.target.value)}
              placeholder="e.g. Left VM, booked discovery for Thursday…"
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={`Next follow-up date (+${cadenceDays}d suggested)`}>
              <input
                type="date"
                className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                value={touchNextDate}
                onChange={(e) => setTouchNextDate(e.target.value)}
              />
            </Field>
            <Field label="Move to stage (optional)">
              <select
                className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                value={touchMoveStage}
                onChange={(e) => setTouchMoveStage(e.target.value)}
              >
                <option value="">Keep current stage</option>
                {leadStages.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submitTouch()}
            className="mt-3 w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto sm:px-6"
            style={{ backgroundColor: brandColor }}
          >
            {busy ? "Saving…" : "Save follow-up"}
          </button>
        </section>

        {/* Touch history */}
        {workspace && workspace.touchpoints.length > 0 ? (
          <section className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Outreach history</h3>
            <ul className="mt-2 max-h-36 space-y-2 overflow-y-auto text-xs">
              {workspace.touchpoints.map((t) => (
                <li key={t.id} className="rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-900">
                  <span className="font-medium">{touchChannelLabel(t.channel)}</span>
                  {t.outcome ? ` · ${t.outcome}` : ""}
                  <span className="text-neutral-400"> · {new Date(t.touched_at).toLocaleString()}</span>
                  {t.notes ? <p className="mt-0.5 text-neutral-600 dark:text-neutral-400">{t.notes}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Meetings */}
        <section className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Scheduled meetings</h3>
          {workspace?.events.length ? (
            <ul className="mt-2 space-y-2 text-sm">
              {workspace.events.map((ev) => (
                <li
                  key={ev.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-700"
                >
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{ev.title}</p>
                    <p className="text-xs text-neutral-500">{new Date(ev.date_start).toLocaleString()}</p>
                  </div>
                  <select
                    className="rounded border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-600 dark:bg-neutral-900"
                    value={ev.status}
                    disabled={busy}
                    onChange={async (e) => {
                      setBusy(true);
                      const r = await updateLeadMeetingStatusAction(lead.id, ev.id, e.target.value);
                      setBusy(false);
                      if (!r.ok) setErr(r.error);
                      else await reloadWorkspace({ background: true });
                    }}
                  >
                    {EVENT_MEETING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s === "Missed" ? "No-show" : s}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-neutral-500">No meetings scheduled for this lead.</p>
          )}
          {isInternal ? (
            <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/60">
              {ghlBookingConfig ? (
                <>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Book {bookingLabel.toLowerCase()}
                  </p>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    Opens GHL calendar with{" "}
                    {lead.lead_name?.trim() || lead.business_name?.trim() ? (
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {lead.lead_name?.trim() || lead.business_name?.trim()}
                      </span>
                    ) : (
                      "the lead"
                    )}
                    {lead.email ? (
                      <>
                        {" "}
                        · <span className="font-medium text-neutral-800 dark:text-neutral-200">{lead.email}</span>
                      </>
                    ) : (
                      " — add an email under Edit lead details for prefill"
                    )}
                    .
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <GhlBookingButton
                      bookingUrl={bookingUrl}
                      label={`Book ${bookingLabel.toLowerCase()}`}
                      brandColor={brandColor}
                      disabled={busy}
                    />
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-sky-700 hover:underline dark:text-sky-400"
                    >
                      Open in new tab
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  GHL calendar booking is not configured. Set up GHL booking IDs in{" "}
                  <a href="/dashboard/settings" className="font-medium text-sky-700 hover:underline dark:text-sky-400">
                    Settings → Integrations
                  </a>
                  .
                </p>
              )}
            </div>
          ) : null}

          {isInternal ? (
            <button
              type="button"
              className="mt-3 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
              onClick={() => setShowManualMeeting((v) => !v)}
            >
              {showManualMeeting ? "Hide manual scheduling" : "Add meeting manually instead"}
            </button>
          ) : null}

          {isInternal && showManualMeeting ? (
            <>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Field label="Meeting title">
                  <input
                    className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                  />
                </Field>
                <Field label="Meeting link (optional)">
                  <input
                    className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="Zoom / Meet URL"
                  />
                </Field>
                <Field label="Starts">
                  <input
                    type="datetime-local"
                    className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                    value={meetingStart}
                    onChange={(e) => setMeetingStart(e.target.value)}
                  />
                </Field>
                <Field label="Ends">
                  <input
                    type="datetime-local"
                    className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                    value={meetingEnd}
                    onChange={(e) => setMeetingEnd(e.target.value)}
                  />
                </Field>
              </div>
              <button
                type="button"
                disabled={busy || !meetingStart || !meetingEnd}
                className="mt-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold dark:border-neutral-600"
                onClick={async () => {
                  setBusy(true);
                  const r = await createLeadMeetingAction(lead.id, {
                    title: meetingTitle,
                    date_start: fromDatetimeLocalValue(meetingStart),
                    date_end: fromDatetimeLocalValue(meetingEnd),
                    event_type: lead.status.includes("Proposal") ? "Meeting" : "Call",
                    status: "Confirmed",
                    meeting_link: meetingLink || null,
                  });
                  setBusy(false);
                  if (!r.ok) setErr(r.error);
                  else await reloadWorkspace({ background: true });
                }}
              >
                Save manual meeting
              </button>
            </>
          ) : null}
        </section>

        {/* Stage checklist */}
        {stageChecklist.length > 0 ? (
          <section className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Checklist — {lead.status}
            </h3>
            <ul className="mt-2 space-y-2">
              {stageChecklist.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={Boolean(item.completed_at)}
                    disabled={busy}
                    onChange={async (e) => {
                      setBusy(true);
                      const r = await toggleLeadChecklistAction(lead.id, item.id, e.target.checked);
                      setBusy(false);
                      if (!r.ok) setErr(r.error);
                      else await reloadWorkspace({ background: true });
                    }}
                  />
                  <span className={item.completed_at ? "text-neutral-500 line-through" : "text-neutral-800 dark:text-neutral-200"}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Notes & documents */}
        <section className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Notes & documents</h3>
          <Field label="Pipeline notes (reference on next open)">
            <textarea
              className="mt-1 min-h-[80px] w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
              value={pipelineNotes}
              onChange={(e) => {
                setPipelineNotes(e.target.value);
                setNotesDirty(true);
                notesDirtyRef.current = true;
              }}
            />
          </Field>
          <button
            type="button"
            disabled={busy}
            className="mt-1 text-xs font-semibold text-sky-700 dark:text-sky-400"
            onClick={() => void saveNotes()}
          >
            Save notes
          </button>
          {lead.linkedin_url ? (
            <p className="mt-2 text-xs">
              <a href={lead.linkedin_url} target="_blank" rel="noreferrer" className="text-sky-700 underline dark:text-sky-400">
                Open LinkedIn profile
              </a>
            </p>
          ) : null}
          {workspace?.documents.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {workspace.documents.map((doc) => (
                <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-700">
                  <div>
                    <p className="font-medium">{doc.file_name}</p>
                    <p className="text-[10px] text-neutral-500">
                      Updated {new Date(doc.updated_at).toLocaleString()}
                      {doc.stage ? ` · ${doc.stage}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      className="text-xs font-semibold text-sky-700 hover:underline disabled:opacity-50 dark:text-sky-400"
                      onClick={async () => {
                        setErr(null);
                        setBusy(true);
                        const r = await getLeadDocumentDownloadUrlAction(lead.id, doc.id);
                        setBusy(false);
                        if (!r.ok || !r.data?.url) {
                          setErr(r.ok ? "Could not generate download link." : r.error);
                          return;
                        }
                        const a = document.createElement("a");
                        a.href = r.data.url;
                        a.download = doc.file_name;
                        a.rel = "noopener noreferrer";
                        a.target = "_blank";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                      }}
                    >
                      Download
                    </button>
                    {isInternal ? (
                      <button
                        type="button"
                        className="text-xs text-red-600"
                        disabled={busy}
                        onClick={async () => {
                          if (!confirm("Delete this file?")) return;
                          setBusy(true);
                          const r = await deleteLeadDocumentAction(lead.id, doc.id);
                          setBusy(false);
                          if (!r.ok) setErr(r.error);
                          else await reloadWorkspace({ background: true });
                        }}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
          {docUploadMsg ? (
            <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">{docUploadMsg}</p>
          ) : null}
          <form
            ref={docUploadFormRef}
            className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end"
            encType="multipart/form-data"
            onSubmit={(e) => {
              e.preventDefault();
              setErr(null);
              setDocUploadMsg(null);
              const form = docUploadFormRef.current;
              if (!form) return;
              const fd = new FormData(form);
              fd.set("leadId", lead.id);
              fd.set("stage", lead.status);
              setBusy(true);
              void (async () => {
                const r = await uploadLeadDocumentAction(fd);
                setBusy(false);
                if (!r.ok) {
                  setErr(r.error);
                  return;
                }
                setDocFileName("");
                docUploadFormRef.current?.reset();
                setDocUploadMsg("Document uploaded.");
                await reloadWorkspace({ background: true });
              })();
            }}
          >
            <label className="flex min-w-0 flex-1 cursor-pointer flex-col gap-1 text-xs text-neutral-600 dark:text-neutral-400">
              <span className="font-medium">Choose file</span>
              <input
                type="file"
                name="file"
                className="text-xs file:mr-2 file:rounded file:border-0 file:bg-neutral-200 file:px-2 file:py-1 file:text-xs dark:file:bg-neutral-700"
                required
                onChange={(e) => setDocFileName(e.target.files?.[0]?.name ?? "")}
              />
              {docFileName ? (
                <span className="truncate text-neutral-500 dark:text-neutral-400">Selected: {docFileName}</span>
              ) : null}
            </label>
            <button
              type="submit"
              disabled={busy}
              className="shrink-0 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold disabled:opacity-50 dark:border-neutral-600"
            >
              {busy ? "Uploading…" : "Upload document"}
            </button>
          </form>
        </section>

        {/* Edit lead — collapsed */}
        <section className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <button
            type="button"
            className="flex w-full items-center justify-between text-sm font-semibold text-neutral-800 dark:text-neutral-200"
            onClick={() => setShowEdit((v) => !v)}
          >
            Edit lead details
            <span className="text-neutral-400">{showEdit ? "▲" : "▼"}</span>
          </button>
          {showEdit ? (
            <div className="mt-4 space-y-3">
              {dupWarn ? <p className="text-sm text-amber-700 dark:text-amber-400">{dupWarn}</p> : null}
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
                  onBlur={async () => {
                    if (!form.email?.trim() && !normalizePhoneDigits(form.phone)) {
                      setDupWarn(null);
                      return;
                    }
                    const r = await checkLeadDuplicatesAction(form.email, form.phone, lead.id);
                    if (!r.ok) return;
                    const parts: string[] = [];
                    if (r.data?.emailMatch) parts.push("email");
                    if (r.data?.phoneMatch) parts.push("phone");
                    setDupWarn(parts.length ? `Duplicate ${parts.join(" and ")}.` : null);
                  }}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value || null }))}
                />
              </Field>
              <Field label="Phone">
                <input
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.phone ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value || null }))}
                />
              </Field>
              <Field label="LinkedIn URL">
                <input
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.linkedin_url ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value || null }))}
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
                  onChange={(e) => {
                    setForm((f) => ({ ...f, temperature: e.target.value }));
                    setTouchNextDate(defaultNextFollowUpDateValue(e.target.value, timezone));
                  }}
                >
                  {leadTemperatures.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tags">
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
                      className="rounded-full border px-2 py-0.5 text-[11px] dark:border-neutral-600"
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
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void submitEdit()}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: brandColor }}
                >
                  Save details
                </button>
                {isInternal ? (
                  <>
                    <button
                      type="button"
                      className="rounded-lg border px-3 py-1.5 text-sm dark:border-neutral-600"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        const r = await convertLeadToClientAction(lead.id);
                        setBusy(false);
                        if (!r.ok) setErr(r.error);
                        else onSaved();
                      }}
                    >
                      Convert to client
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border px-3 py-1.5 text-sm dark:border-neutral-600"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        const r = await convertLeadToProjectAction(lead.id);
                        setBusy(false);
                        if (!r.ok) setErr(r.error);
                        else onSaved();
                      }}
                    >
                      Convert to project
                    </button>
                    <button
                      type="button"
                      className="ml-auto rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 dark:border-red-900 dark:text-red-400"
                      disabled={busy}
                      onClick={async () => {
                        if (!confirm("Delete this lead?")) return;
                        setBusy(true);
                        const r = await deleteLeadAction(lead.id);
                        setBusy(false);
                        if (!r.ok) setErr(r.error);
                        else onDeleted(lead.id);
                      }}
                    >
                      Delete lead
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
