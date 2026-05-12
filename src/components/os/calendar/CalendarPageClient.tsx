"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createEventAction,
  deleteEventAction,
  updateEventAction,
  type EventUpsertPayload,
} from "@/app/dashboard/calendar/actions";
import { formatYmdInTimeZone } from "@/lib/os/os-revenue-range";
import type { LeadPickRow, OsClientRow, OsEventRow } from "@/lib/os/os-entity-types";
import { cn } from "@/lib/utils";

type CalendarPageClientProps = {
  initialEvents: OsEventRow[];
  brandColor: string;
  isInternal: boolean;
  timeZone: string;
  eventTypes: string[];
  eventStatuses: string[];
  leadsPick: LeadPickRow[];
  clients: OsClientRow[];
  linkedClientId: string | null;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isoToDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function localDatetimeToIso(local: string): string {
  const d = new Date(local);
  return d.toISOString();
}

function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split("-").map((x) => parseInt(x, 10));
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

function weekRangeContaining(anchorYmd: string): { from: string; to: string } {
  const parts = anchorYmd.split("-").map((x) => parseInt(x, 10));
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const start = new Date(y, m - 1, d);
  const dow = start.getDay();
  const from = addDaysYmd(anchorYmd, -dow);
  const to = addDaysYmd(from, 6);
  return { from, to };
}

function daysInMonth(year: number, month1to12: number): number {
  return new Date(year, month1to12, 0).getDate();
}

function buildMonthCells(year: number, month1to12: number): (number | null)[] {
  const first = new Date(year, month1to12 - 1, 1);
  const pad = first.getDay();
  const dim = daysInMonth(year, month1to12);
  const cells: (number | null)[] = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function clientLabel(clients: OsClientRow[], id: string | null): string {
  if (!id) return "—";
  const c = clients.find((x) => x.id === id);
  if (!c) return id.slice(0, 8);
  return c.business_name?.trim() || c.contact_name?.trim() || id.slice(0, 8);
}

export function CalendarPageClient({
  initialEvents,
  brandColor,
  isInternal,
  timeZone,
  eventTypes,
  eventStatuses,
  leadsPick,
  clients,
  linkedClientId,
}: CalendarPageClientProps) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [view, setView] = useState<"day" | "week" | "month">("month");
  const [cursorY, setCursorY] = useState(() => {
    const s = formatYmdInTimeZone(new Date(), timeZone);
    const [y] = s.split("-").map(Number);
    return y;
  });
  const [cursorM, setCursorM] = useState(() => {
    const s = formatYmdInTimeZone(new Date(), timeZone);
    const [, m] = s.split("-").map(Number);
    return m;
  });
  const [anchorYmd, setAnchorYmd] = useState(() => formatYmdInTimeZone(new Date(), timeZone));
  const [modal, setModal] = useState<"closed" | "create" | { edit: OsEventRow }>("closed");
  const [form, setForm] = useState<EventUpsertPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const eventsByYmd = useMemo(() => {
    const m = new Map<string, OsEventRow[]>();
    for (const e of events) {
      const key = formatYmdInTimeZone(new Date(e.date_start), timeZone);
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(e);
    }
    for (const arr of m.values()) arr.sort((a, b) => a.date_start.localeCompare(b.date_start));
    return m;
  }, [events, timeZone]);

  const monthCells = useMemo(() => buildMonthCells(cursorY, cursorM), [cursorY, cursorM]);

  const weekRange = useMemo(() => weekRangeContaining(anchorYmd), [anchorYmd]);

  const weekEvents = useMemo(() => {
    return events.filter((e) => {
      const ymd = formatYmdInTimeZone(new Date(e.date_start), timeZone);
      return ymd >= weekRange.from && ymd <= weekRange.to;
    });
  }, [events, timeZone, weekRange.from, weekRange.to]);

  const dayEvents = useMemo(() => {
    return events.filter((e) => formatYmdInTimeZone(new Date(e.date_start), timeZone) === anchorYmd);
  }, [events, timeZone, anchorYmd]);

  function defaultForm(): EventUpsertPayload {
    const start = new Date();
    start.setMinutes(0, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    return {
      title: "",
      date_start: start.toISOString(),
      date_end: end.toISOString(),
      event_type: eventTypes[0] ?? "Meeting",
      status: eventStatuses[0] ?? "Confirmed",
      meeting_link: null,
      related_lead_id: null,
      related_client_id: linkedClientId,
    };
  }

  function openCreate() {
    setErr(null);
    setForm(defaultForm());
    setModal("create");
  }

  function openEdit(ev: OsEventRow) {
    setErr(null);
    setForm({
      title: ev.title,
      date_start: ev.date_start,
      date_end: ev.date_end,
      event_type: ev.event_type,
      status: ev.status,
      meeting_link: ev.meeting_link,
      related_lead_id: ev.related_lead_id,
      related_client_id: ev.related_client_id,
    });
    setModal({ edit: ev });
  }

  async function submit() {
    if (!form) return;
    setErr(null);
    setBusy(true);
    try {
      if (modal === "create") {
        const r = await createEventAction(form);
        if (!r.ok) setErr(r.error);
        else {
          setModal("closed");
          refresh();
        }
      } else if (typeof modal === "object" && "edit" in modal) {
        const r = await updateEventAction(modal.edit.id, form);
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

  function prevMonth() {
    if (cursorM <= 1) {
      setCursorY((y) => y - 1);
      setCursorM(12);
    } else setCursorM((m) => m - 1);
  }

  function nextMonth() {
    if (cursorM >= 12) {
      setCursorY((y) => y + 1);
      setCursorM(1);
    } else setCursorM((m) => m + 1);
  }

  const monthTitle = `${cursorY}-${pad2(cursorM)}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">Calendar</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
            Schedule and manage your meetings
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          style={{ backgroundColor: brandColor }}
        >
          Add Event
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {(["day", "week", "month"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium capitalize",
              view === v
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                : "border-neutral-300 dark:border-neutral-600"
            )}
          >
            {v}
          </button>
        ))}
        {view === "month" ? (
          <div className="ml-auto flex items-center gap-2">
            <button type="button" className="rounded border px-2 py-1 text-sm" onClick={prevMonth}>
              ←
            </button>
            <span className="text-sm font-semibold tabular-nums text-neutral-800 dark:text-neutral-100">
              {monthTitle}
            </span>
            <button type="button" className="rounded border px-2 py-1 text-sm" onClick={nextMonth}>
              →
            </button>
          </div>
        ) : null}
      </div>

      {view === "month" ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="bg-neutral-50 px-2 py-2 text-center text-xs font-semibold text-neutral-600 dark:bg-neutral-950 dark:text-neutral-400"
              >
                {d}
              </div>
            ))}
            {monthCells.map((day, idx) => {
              const ymd = day != null ? `${cursorY}-${pad2(cursorM)}-${pad2(day)}` : null;
              const cellEvents = ymd ? eventsByYmd.get(ymd) ?? [] : [];
              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[88px] bg-white p-1.5 text-left dark:bg-neutral-900",
                    day == null && "bg-neutral-50/80 dark:bg-neutral-950/80"
                  )}
                >
                  {day != null ? (
                    <>
                      <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">{day}</p>
                      <div className="mt-1 space-y-0.5">
                        {cellEvents.slice(0, 3).map((ev) => (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() => openEdit(ev)}
                            className="block w-full truncate rounded bg-neutral-100 px-1 py-0.5 text-left text-[10px] font-medium text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                          >
                            {ev.title || "Event"}
                          </button>
                        ))}
                        {cellEvents.length > 3 ? (
                          <p className="text-[10px] text-neutral-500">+{cellEvents.length - 3} more</p>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {view === "week" ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Week {weekRange.from} → {weekRange.to} (browser-local week boundaries)
          </p>
          <ul className="mt-4 space-y-2">
            {weekEvents.length === 0 ? (
              <li className="text-sm text-neutral-500">No events this week.</li>
            ) : (
              weekEvents.map((ev) => (
                <li key={ev.id}>
                  <button
                    type="button"
                    onClick={() => openEdit(ev)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-950"
                  >
                    <span className="font-medium text-neutral-900 dark:text-white">{ev.title || "Event"}</span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {formatYmdInTimeZone(new Date(ev.date_start), timeZone)}{" "}
                      {new Date(ev.date_start).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone,
                      })}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      {view === "day" ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Day
            <input
              type="date"
              value={anchorYmd}
              onChange={(e) => setAnchorYmd(e.target.value)}
              className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            />
          </label>
          <ul className="mt-4 space-y-2">
            {dayEvents.length === 0 ? (
              <li className="text-sm text-neutral-500">No events this day.</li>
            ) : (
              dayEvents.map((ev) => (
                <li key={ev.id}>
                  <button
                    type="button"
                    onClick={() => openEdit(ev)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-950"
                  >
                    <span className="font-medium text-neutral-900 dark:text-white">{ev.title || "Event"}</span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {new Date(ev.date_start).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone,
                      })}{" "}
                      –{" "}
                      {new Date(ev.date_end).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone,
                      })}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      {modal !== "closed" && form ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-950">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {modal === "create" ? "Add event" : "Edit event"}
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
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Title
                <input
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.title}
                  onChange={(e) => setForm((f) => (f ? { ...f, title: e.target.value } : f))}
                />
              </label>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Start
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={isoToDatetimeLocal(form.date_start)}
                  onChange={(e) =>
                    setForm((f) =>
                      f ? { ...f, date_start: localDatetimeToIso(e.target.value) } : f
                    )
                  }
                />
              </label>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                End
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={isoToDatetimeLocal(form.date_end)}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, date_end: localDatetimeToIso(e.target.value) } : f))
                  }
                />
              </label>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Type
                <select
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.event_type}
                  onChange={(e) => setForm((f) => (f ? { ...f, event_type: e.target.value } : f))}
                >
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Status
                <select
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.status}
                  onChange={(e) => setForm((f) => (f ? { ...f, status: e.target.value } : f))}
                >
                  {eventStatuses.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Meeting link
                <input
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.meeting_link ?? ""}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, meeting_link: e.target.value || null } : f))
                  }
                />
              </label>
              {isInternal ? (
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Related lead
                  <select
                    className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                    value={form.related_lead_id ?? ""}
                    onChange={(e) =>
                      setForm((f) => (f ? { ...f, related_lead_id: e.target.value || null } : f))
                    }
                  >
                    <option value="">—</option>
                    {leadsPick.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Related client
                <select
                  className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
                  value={form.related_client_id ?? ""}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, related_client_id: e.target.value || null } : f))
                  }
                  disabled={!isInternal && !!linkedClientId}
                >
                  <option value="">—</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {clientLabel(clients, c.id)}
                    </option>
                  ))}
                </select>
                {!isInternal && linkedClientId ? (
                  <span className="mt-1 block text-[10px] text-neutral-500">Linked to your account.</span>
                ) : null}
              </label>
            </div>
            {typeof modal === "object" && "edit" in modal && isInternal ? (
              <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <button
                  type="button"
                  className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                  onClick={() => {
                    if (!confirm("Delete this event?")) return;
                    void (async () => {
                      const r = await deleteEventAction(modal.edit.id);
                      if (!r.ok) setErr(r.error);
                      else {
                        setModal("closed");
                        refresh();
                      }
                    })();
                  }}
                >
                  Delete event
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
