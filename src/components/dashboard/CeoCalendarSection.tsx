"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Columns2,
  LayoutGrid,
  Plus,
  Square,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALERT_MINUTES_OPTIONS,
  CALENDAR_EVENT_TYPES,
  EVENT_TYPE_LABELS,
  RECURRENCE_LABELS,
  RECURRENCE_TYPES,
  isRecurrenceType,
  type CalendarEventType,
  type RecurrenceType,
} from "@/lib/calendar/eventTypes";
import { computeRemindAtIso } from "@/lib/calendar/recurrence";

type ApiCalendarEvent = {
  id: string;
  title: string;
  date: string;
  hour: number;
  start_minutes: number;
  end_minutes: number;
  duration: number;
  notes: string | null;
  color: string | null;
  event_type: string | null;
  lead_id: string | null;
  client_id: string | null;
  remind_at: string | null;
  notification_sent_at: string | null;
  recurrence?: string | null;
  recurrence_until?: string | null;
  reminder_minutes_before?: number | null;
  instance_id?: string;
  series_start_date?: string;
  occurrence_date?: string;
};

type PickerOption = { id: string; label: string };

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseYMD(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function visibleMonthGridRange(year: number, month: number): { from: string; to: string } {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const end = new Date(last);
  end.setDate(last.getDate() + (6 - last.getDay()));
  return { from: toYMD(start), to: toYMD(end) };
}

function weekRangeContaining(d: Date): { from: string; to: string } {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { from: toYMD(start), to: toYMD(end) };
}

function dayRange(d: Date): { from: string; to: string } {
  const ymd = toYMD(d);
  return { from: ymd, to: ymd };
}

type CalendarViewMode = "month" | "week" | "day";

function eventTimeLabel(ev: ApiCalendarEvent): string {
  const sh = ev.hour ?? 0;
  const sm = ev.start_minutes ?? 0;
  const endM = ev.end_minutes ?? sh * 60 + sm + 30;
  const eh = Math.floor(endM / 60) % 24;
  const em = endM % 60;
  return `${pad2(sh)}:${pad2(sm)}–${pad2(eh)}:${pad2(em)}`;
}

function formatRemindLocal(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function useCalendarReminders(
  events: ApiCalendarEvent[],
  onAcknowledged: () => void
) {
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    const tick = async () => {
      const now = Date.now();
      for (const ev of events) {
        if (!ev.remind_at || ev.notification_sent_at) continue;
        const when = new Date(ev.remind_at).getTime();
        if (when > now) continue;
        const key = ev.instance_id ?? `${ev.id}::${String(ev.date).slice(0, 10)}`;
        if (firedRef.current.has(key)) continue;
        firedRef.current.add(key);

        if (Notification.permission === "granted") {
          try {
            new Notification(ev.title, {
              body: `${EVENT_TYPE_LABELS[(ev.event_type as CalendarEventType) || "other"]} · ${ev.date} ${eventTimeLabel(ev)}`,
              tag: `ntech-cal-${key}`,
            });
          } catch {
            /* ignore */
          }
        }

        const isRecurring = ev.recurrence && ev.recurrence !== "none";
        if (!isRecurring) {
          try {
            await fetch(`/api/calendar/events/${ev.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notification_sent_at: true }),
            });
          } catch {
            firedRef.current.delete(key);
          }
          onAcknowledged();
        }
      }
    };

    const id = window.setInterval(() => void tick(), 12_000);
    void tick();
    return () => window.clearInterval(id);
  }, [events, onAcknowledged]);
}

export function CeoCalendarSection() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewDate, setViewDate] = useState(() => new Date(today));
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  const [events, setEvents] = useState<ApiCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(() => toYMD(today));

  const [leadOptions, setLeadOptions] = useState<PickerOption[]>([]);
  const [clientOptions, setClientOptions] = useState<PickerOption[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<CalendarEventType>("lead_call");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  const [notes, setNotes] = useState("");
  const [leadId, setLeadId] = useState("");
  const [clientId, setClientId] = useState("");
  const [alertMinutes, setAlertMinutes] = useState<number>(15);
  const [eventAnchorDate, setEventAnchorDate] = useState(() => toYMD(today));
  const [recurrence, setRecurrence] = useState<RecurrenceType>("none");
  const [recurrenceUntil, setRecurrenceUntil] = useState("");

  const range = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    switch (viewMode) {
      case "month":
        return visibleMonthGridRange(y, m);
      case "week":
        return weekRangeContaining(viewDate);
      case "day":
        return dayRange(viewDate);
      default:
        return visibleMonthGridRange(y, m);
    }
  }, [viewDate, viewMode]);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({ from: range.from, to: range.to });
      const res = await fetch(`/api/calendar/events?${q}`);
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load calendar.");
        setEvents([]);
        return;
      }
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch {
      setError("Failed to load calendar.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (viewMode === "day") {
      setSelectedDay(toYMD(viewDate));
    }
  }, [viewMode, viewDate]);

  const loadPickers = useCallback(async () => {
    try {
      const [lr, cr] = await Promise.all([
        fetch("/api/leads?limit=150"),
        fetch("/api/clients?limit=150"),
      ]);
      const lj = await lr.json();
      const cj = await cr.json();
      if (lr.ok && Array.isArray(lj.leads)) {
        setLeadOptions(
          lj.leads.map((l: { id: string; name?: string | null; email?: string | null }) => ({
            id: l.id,
            label: [l.name, l.email].filter(Boolean).join(" · ") || l.id.slice(0, 8),
          }))
        );
      }
      if (cr.ok && Array.isArray(cj.clients)) {
        setClientOptions(
          cj.clients.map((c: { id: string; name?: string | null; email?: string | null }) => ({
            id: c.id,
            label: [c.name, c.email].filter(Boolean).join(" · ") || c.id.slice(0, 8),
          }))
        );
      }
    } catch {
      /* optional */
    }
  }, []);

  useEffect(() => {
    void loadPickers();
  }, [loadPickers]);

  const refreshAfterReminder = useCallback(() => {
    void loadEvents();
  }, [loadEvents]);

  useCalendarReminders(events, refreshAfterReminder);

  const eventsByDate = useMemo(() => {
    const m = new Map<string, ApiCalendarEvent[]>();
    for (const ev of events) {
      const d = String(ev.date).slice(0, 10);
      const list = m.get(d) ?? [];
      list.push(ev);
      m.set(d, list);
    }
    for (const [, list] of m) {
      list.sort(
        (a, b) =>
          (a.hour * 60 + a.start_minutes) - (b.hour * 60 + b.start_minutes)
      );
    }
    return m;
  }, [events]);

  const upcomingAlerts = useMemo(() => {
    const now = Date.now();
    return events
      .filter(
        (e) =>
          e.remind_at &&
          !e.notification_sent_at &&
          new Date(e.remind_at).getTime() > now
      )
      .sort(
        (a, b) =>
          new Date(a.remind_at!).getTime() - new Date(b.remind_at!).getTime()
      )
      .slice(0, 8);
  }, [events]);

  const periodLabel = useMemo(() => {
    if (viewMode === "month") {
      return new Intl.DateTimeFormat(undefined, {
        month: "long",
        year: "numeric",
      }).format(new Date(viewDate.getFullYear(), viewDate.getMonth(), 1));
    }
    if (viewMode === "week") {
      const ws = new Date(viewDate);
      ws.setHours(0, 0, 0, 0);
      ws.setDate(ws.getDate() - ws.getDay());
      const we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      const short: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
      const endOpts: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      return `${ws.toLocaleDateString(undefined, short)} – ${we.toLocaleDateString(undefined, endOpts)}`;
    }
    return viewDate.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [viewDate, viewMode]);

  const monthGridDays = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const first = new Date(y, m, 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [viewDate]);

  const weekDays = useMemo(() => {
    const ws = new Date(viewDate);
    ws.setHours(0, 0, 0, 0);
    ws.setDate(ws.getDate() - ws.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(ws);
      d.setDate(ws.getDate() + i);
      return d;
    });
  }, [viewDate]);

  function navigatePeriod(dir: -1 | 1) {
    setViewDate((d) => {
      const n = new Date(d);
      n.setHours(0, 0, 0, 0);
      if (viewMode === "month") {
        n.setMonth(n.getMonth() + dir);
      } else if (viewMode === "week") {
        n.setDate(n.getDate() + dir * 7);
      } else {
        n.setDate(n.getDate() + dir);
      }
      return n;
    });
  }

  function goToday() {
    setViewDate(new Date(today));
    setSelectedDay(toYMD(today));
  }

  function changeViewMode(mode: CalendarViewMode) {
    setViewMode(mode);
    if (mode === "day" && selectedDay) {
      setViewDate(parseYMD(selectedDay));
    }
  }

  function openNewForDay(ymd: string) {
    setSelectedDay(ymd);
    setEventAnchorDate(ymd);
    setEditingId(null);
    setTitle("");
    setEventType("lead_call");
    setStartTime("09:00");
    setEndTime("09:30");
    setNotes("");
    setLeadId("");
    setClientId("");
    setAlertMinutes(15);
    setRecurrence("none");
    setRecurrenceUntil("");
    setFormOpen(true);
  }

  function openEdit(ev: ApiCalendarEvent) {
    const day = String(ev.date).slice(0, 10);
    const anchor = (ev.series_start_date ?? day).slice(0, 10);
    setSelectedDay(day);
    setEventAnchorDate(anchor);
    setEditingId(ev.id);
    setTitle(ev.title);
    setEventType((ev.event_type as CalendarEventType) || "other");
    setStartTime(`${pad2(ev.hour)}:${pad2(ev.start_minutes ?? 0)}`);
    const endM = ev.end_minutes ?? ev.hour * 60 + (ev.start_minutes ?? 0) + 30;
    setEndTime(`${pad2(Math.floor(endM / 60) % 24)}:${pad2(endM % 60)}`);
    setNotes(ev.notes ?? "");
    setLeadId(ev.lead_id ?? "");
    setClientId(ev.client_id ?? "");
    setRecurrence(
      typeof ev.recurrence === "string" && isRecurrenceType(ev.recurrence)
        ? ev.recurrence
        : "none"
    );
    setRecurrenceUntil(
      ev.recurrence_until ? String(ev.recurrence_until).slice(0, 10) : ""
    );
    if (typeof ev.reminder_minutes_before === "number" && ev.reminder_minutes_before >= 0) {
      setAlertMinutes(ev.reminder_minutes_before);
    } else if (!ev.remind_at) {
      setAlertMinutes(-1);
    } else {
      const startMs = new Date(
        `${day}T${pad2(ev.hour)}:${pad2(ev.start_minutes ?? 0)}:00`
      ).getTime();
      const remMs = new Date(ev.remind_at).getTime();
      const diffMin = Math.round((startMs - remMs) / 60_000);
      const preset = [0, 5, 15, 30, 60].includes(diffMin) ? diffMin : 15;
      setAlertMinutes(preset);
    }
    setFormOpen(true);
  }

  async function saveEvent() {
    if (!selectedDay) return;
    setSaving(true);
    setError(null);
    try {
      const isRecurring = recurrence !== "none";
      const [sh, sm] = startTime.split(":").map((x) => parseInt(x, 10));
      const remindAt =
        alertMinutes < 0 || isRecurring || Number.isNaN(sh) || Number.isNaN(sm)
          ? null
          : computeRemindAtIso(eventAnchorDate, sh, sm, alertMinutes);

      const payload = {
        title,
        date: eventAnchorDate,
        start_time: startTime,
        end_time: endTime,
        event_type: eventType,
        notes: notes || null,
        lead_id: leadId || null,
        client_id: clientId || null,
        recurrence,
        recurrence_until:
          isRecurring && recurrenceUntil.trim()
            ? recurrenceUntil.trim().slice(0, 10)
            : null,
        reminder_minutes_before:
          alertMinutes < 0 ? null : Math.floor(alertMinutes),
        remind_at: remindAt,
      };

      const url = editingId
        ? `/api/calendar/events/${editingId}`
        : "/api/calendar/events";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Save failed.");
        return;
      }
      setFormOpen(false);
      await loadEvents();
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id: string) {
    if (
      !confirm(
        recurrence !== "none"
          ? "Delete the entire repeating series? All occurrences will be removed."
          : "Delete this event?"
      )
    ) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/calendar/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Delete failed.");
        return;
      }
      setFormOpen(false);
      await loadEvents();
    } catch {
      setError("Delete failed.");
    }
  }

  async function requestNotifyPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    await Notification.requestPermission();
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-gray-400/45 dark:border-neutral-600/50 bg-white/90 px-2.5 py-1.5 text-sm text-gray-900 dark:text-neutral-50 shadow-sm focus:border-sky-500/60 focus:outline-none focus:ring-1 focus:ring-sky-500/40";

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="max-w-xl text-sm text-gray-600 dark:text-neutral-400">
            Schedule <span className="font-medium text-gray-800 dark:text-neutral-200">lead calls</span>,{" "}
            <span className="font-medium text-gray-800 dark:text-neutral-200">onboarding</span>, and{" "}
            <span className="font-medium text-gray-800 dark:text-neutral-200">follow-ups</span>. Enable browser
            notifications for reminders; we also show upcoming alerts below.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void requestNotifyPermission()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-50/90 px-2.5 py-1.5 text-[11px] font-semibold text-amber-950 hover:bg-amber-100/90"
            >
              <Bell className="h-3.5 w-3.5" />
              {typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted"
                ? "Alerts enabled"
                : "Enable alert notifications"}
            </button>
            <button
              type="button"
              onClick={() => void loadEvents()}
              className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-gray-200/40 px-2.5 py-1.5 text-[11px] font-semibold text-gray-800 dark:text-neutral-200 hover:bg-gray-300/50 dark:hover:bg-neutral-800/50"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="overflow-hidden rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/20 dark:bg-neutral-800/50 shadow-inner backdrop-blur-sm">
          <div className="flex flex-col gap-2 border-b border-gray-400/30 dark:border-neutral-600/35 px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-gray-700 dark:text-neutral-300" />
              <span className="truncate text-sm font-bold text-gray-900 dark:text-neutral-50">{periodLabel}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <div
                className="flex rounded-lg border border-gray-400/45 dark:border-neutral-600/50 bg-gray-200/40 p-0.5"
                role="tablist"
                aria-label="Calendar view"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "month"}
                  onClick={() => changeViewMode("month")}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors",
                    viewMode === "month"
                      ? "bg-white text-gray-900 dark:text-neutral-50 shadow-sm"
                      : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:text-neutral-50"
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Month
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "week"}
                  onClick={() => changeViewMode("week")}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors",
                    viewMode === "week"
                      ? "bg-white text-gray-900 dark:text-neutral-50 shadow-sm"
                      : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:text-neutral-50"
                  )}
                >
                  <Columns2 className="h-3.5 w-3.5" />
                  Week
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "day"}
                  onClick={() => changeViewMode("day")}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors",
                    viewMode === "day"
                      ? "bg-white text-gray-900 dark:text-neutral-50 shadow-sm"
                      : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:text-neutral-50"
                  )}
                >
                  <Square className="h-3.5 w-3.5" />
                  Day
                </button>
              </div>
              <button
                type="button"
                onClick={() => goToday()}
                className="rounded-md border border-sky-500/35 bg-sky-50/90 px-2 py-1 text-[11px] font-semibold text-sky-900 hover:bg-sky-100/90"
              >
                Today
              </button>
              <button
                type="button"
                aria-label={viewMode === "month" ? "Previous month" : viewMode === "week" ? "Previous week" : "Previous day"}
                className="rounded-md border border-gray-400/50 dark:border-neutral-600/55 p-1 text-gray-700 dark:text-neutral-300 hover:bg-gray-400/20"
                onClick={() => navigatePeriod(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={viewMode === "month" ? "Next month" : viewMode === "week" ? "Next week" : "Next day"}
                className="rounded-md border border-gray-400/50 dark:border-neutral-600/55 p-1 text-gray-700 dark:text-neutral-300 hover:bg-gray-400/20"
                onClick={() => navigatePeriod(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {viewMode === "month" ? (
            <>
              <div className="grid grid-cols-7 border-b border-gray-400/25 bg-gray-400/15 text-center text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                {weekdayLabels.map((w) => (
                  <div key={w} className="py-2">
                    {w}
                  </div>
                ))}
              </div>

              <div className="relative grid grid-cols-7 gap-px bg-gray-400/25 p-px">
                {loading ? (
                  <div className="absolute inset-0 z-[1] flex items-center justify-center bg-neutral-50/70 text-sm text-gray-600 dark:text-neutral-400">
                    Loading…
                  </div>
                ) : null}
                {monthGridDays.map((d) => {
                  const ymd = toYMD(d);
                  const inMonth =
                    d.getMonth() === viewDate.getMonth() &&
                    d.getFullYear() === viewDate.getFullYear();
                  const isToday = ymd === toYMD(today);
                  const sel = selectedDay === ymd;
                  const dayEvents = eventsByDate.get(ymd) ?? [];
                  return (
                    <button
                      key={ymd}
                      type="button"
                      onClick={() => {
                        setSelectedDay(ymd);
                        setFormOpen(false);
                      }}
                      onDoubleClick={() => openNewForDay(ymd)}
                      className={cn(
                        "flex min-h-[72px] flex-col gap-0.5 bg-neutral-50/95 p-1 text-left transition-colors hover:bg-sky-50/60",
                        !inMonth && "opacity-40",
                        isToday && "ring-1 ring-sky-500/50 ring-inset",
                        sel && "bg-sky-100/50"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[11px] font-semibold tabular-nums",
                          isToday ? "text-sky-800" : "text-gray-800 dark:text-neutral-200"
                        )}
                      >
                        {d.getDate()}
                      </span>
                      <div className="flex flex-wrap gap-0.5">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <span
                            key={ev.instance_id ?? `${ev.id}-${ev.date}`}
                            title={ev.title}
                            className="block max-w-full truncate rounded px-0.5 text-[9px] font-medium text-white"
                            style={{ backgroundColor: ev.color || "#64748b" }}
                          >
                            {pad2(ev.hour)}:{pad2(ev.start_minutes ?? 0)}
                          </span>
                        ))}
                        {dayEvents.length > 3 ? (
                          <span className="text-[9px] text-gray-500 dark:text-neutral-500">+{dayEvents.length - 3}</span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {viewMode === "week" ? (
            <>
              <div className="grid grid-cols-7 border-b border-gray-400/25 bg-gray-400/15 text-center text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                {weekDays.map((d) => (
                  <div key={toYMD(d)} className="py-2">
                    <span className="block">{weekdayLabels[d.getDay()]}</span>
                    <span className="mt-0.5 block text-[11px] font-semibold tabular-nums text-gray-800 dark:text-neutral-200">
                      {d.getMonth() + 1}/{d.getDate()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative grid grid-cols-7 gap-px bg-gray-400/25 p-px">
                {loading ? (
                  <div className="absolute inset-0 z-[1] flex items-center justify-center bg-neutral-50/70 text-sm text-gray-600 dark:text-neutral-400">
                    Loading…
                  </div>
                ) : null}
                {weekDays.map((d) => {
                  const ymd = toYMD(d);
                  const isToday = ymd === toYMD(today);
                  const sel = selectedDay === ymd;
                  const dayEvents = eventsByDate.get(ymd) ?? [];
                  return (
                    <button
                      key={ymd}
                      type="button"
                      onClick={() => {
                        setSelectedDay(ymd);
                        setFormOpen(false);
                      }}
                      onDoubleClick={() => openNewForDay(ymd)}
                      className={cn(
                        "flex min-h-[140px] flex-col gap-1 bg-neutral-50/95 p-1.5 text-left transition-colors hover:bg-sky-50/60",
                        isToday && "ring-1 ring-sky-500/50 ring-inset",
                        sel && "bg-sky-100/50"
                      )}
                    >
                      <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
                        {dayEvents.map((ev) => (
                          <li key={ev.instance_id ?? `${ev.id}-${ev.date}`}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(ev);
                              }}
                              className="w-full rounded border border-gray-400/30 dark:border-neutral-600/35 bg-white/90 px-1 py-0.5 text-left text-[10px] font-medium text-gray-900 dark:text-neutral-50 hover:bg-gray-50"
                              style={{ borderLeftWidth: 3, borderLeftColor: ev.color || "#64748b" }}
                            >
                              <span className="block truncate text-gray-600 dark:text-neutral-400 tabular-nums">
                                {pad2(ev.hour)}:{pad2(ev.start_minutes ?? 0)}
                              </span>
                              <span className="block truncate">{ev.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {viewMode === "day" ? (
            <div className="relative min-h-[min(52vh,420px)] p-3">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-sm text-gray-600 dark:text-neutral-400">
                  Loading…
                </div>
              ) : (
                <ul className="mx-auto max-w-lg space-y-2">
                  {(eventsByDate.get(toYMD(viewDate)) ?? []).length ? (
                    (eventsByDate.get(toYMD(viewDate)) ?? []).map((ev) => (
                      <li key={ev.instance_id ?? `${ev.id}-${ev.date}`}>
                        <button
                          type="button"
                          onClick={() => openEdit(ev)}
                          className="flex w-full gap-3 rounded-xl border border-gray-400/35 dark:border-neutral-600/40 bg-white/90 px-3 py-2.5 text-left shadow-sm hover:bg-gray-50"
                        >
                          <span
                            className="w-1 shrink-0 self-stretch rounded-full"
                            style={{ backgroundColor: ev.color || "#64748b" }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-neutral-50">{ev.title}</p>
                            <p className="mt-0.5 text-xs text-gray-600 dark:text-neutral-400">
                              {eventTimeLabel(ev)} ·{" "}
                              {EVENT_TYPE_LABELS[(ev.event_type as CalendarEventType) || "other"]}
                              {typeof ev.recurrence === "string" &&
                              isRecurrenceType(ev.recurrence) &&
                              ev.recurrence !== "none" ? (
                                <span className="text-sky-700">
                                  {" "}
                                  · {RECURRENCE_LABELS[ev.recurrence]}
                                </span>
                              ) : null}
                            </p>
                            {ev.notes ? (
                              <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-neutral-500">{ev.notes}</p>
                            ) : null}
                          </div>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="py-12 text-center text-sm text-gray-500 dark:text-neutral-500">
                      No events scheduled this day. Use Add or double-click a day in month/week view.
                    </li>
                  )}
                </ul>
              )}
            </div>
          ) : null}

          <p className="border-t border-gray-400/25 px-3 py-2 text-[10px] text-gray-500 dark:text-neutral-500">
            {viewMode === "month"
              ? "Double-click a day to add an event. Single click selects the day for the list and form."
              : viewMode === "week"
                ? "Click a day to select it; double-click to add. Event chips open the editor."
                : "Use arrows to change days. Add from the sidebar or switch to month/week to pick another day."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-amber-50/40 p-3 shadow-inner">
            <h3 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-900">
              <Bell className="h-3.5 w-3.5" />
              Upcoming alerts
            </h3>
            {upcomingAlerts.length === 0 ? (
              <p className="mt-2 text-xs text-gray-600 dark:text-neutral-400">No scheduled reminders ahead.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-xs">
                {upcomingAlerts.map((e) => (
                  <li key={e.instance_id ?? `${e.id}-${e.date}`}>
                    <button
                      type="button"
                      onClick={() => openEdit(e)}
                      className="w-full rounded-md border border-amber-200/60 bg-white/80 px-2 py-1.5 text-left hover:bg-amber-100/50"
                    >
                      <span className="font-semibold text-gray-900 dark:text-neutral-50">{e.title}</span>
                      <span className="mt-0.5 block text-[10px] text-gray-600 dark:text-neutral-400">
                        {formatRemindLocal(e.remind_at!)} ·{" "}
                        {EVENT_TYPE_LABELS[(e.event_type as CalendarEventType) || "other"]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="min-h-0 flex-1 rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/20 dark:bg-neutral-800/50 p-3 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">
                {selectedDay ? parseYMD(selectedDay).toLocaleDateString() : "Pick a day"}
              </h3>
              <button
                type="button"
                disabled={!selectedDay}
                onClick={() => selectedDay && openNewForDay(selectedDay)}
                className="inline-flex items-center gap-1 rounded-md border border-sky-500/40 bg-sky-100/80 px-2 py-1 text-[11px] font-semibold text-sky-950 disabled:opacity-40"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
            <ul className="mt-2 max-h-[200px] space-y-1.5 overflow-y-auto">
              {(selectedDay && eventsByDate.get(selectedDay))?.length ? (
                eventsByDate.get(selectedDay)!.map((ev) => (
                  <li key={ev.instance_id ?? `${ev.id}-${ev.date}`}>
                    <button
                      type="button"
                      onClick={() => openEdit(ev)}
                      className="w-full rounded-lg border border-gray-400/35 dark:border-neutral-600/40 bg-white/85 px-2 py-1.5 text-left text-xs hover:bg-gray-50"
                    >
                      <span className="font-semibold text-gray-900 dark:text-neutral-50">{ev.title}</span>
                      <span className="block text-[10px] text-gray-600 dark:text-neutral-400">
                        {eventTimeLabel(ev)} ·{" "}
                        {EVENT_TYPE_LABELS[(ev.event_type as CalendarEventType) || "other"]}
                        {typeof ev.recurrence === "string" &&
                        isRecurrenceType(ev.recurrence) &&
                        ev.recurrence !== "none" ? (
                          <span className="text-sky-700">
                            {" "}
                            · {RECURRENCE_LABELS[ev.recurrence]}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-xs text-gray-500 dark:text-neutral-500">No events this day.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {formOpen && selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-3 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cal-form-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setFormOpen(false);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-400/50 dark:border-neutral-600/55 bg-neutral-100 p-4 shadow-xl">
            <h2 id="cal-form-title" className="text-base font-bold text-gray-900 dark:text-neutral-50">
              {editingId ? "Edit event" : "New event"}
            </h2>
            <p className="text-xs text-gray-600 dark:text-neutral-400">
              {editingId && recurrence !== "none" && selectedDay !== eventAnchorDate
                ? `This instance: ${selectedDay} · Series start: ${eventAnchorDate}`
                : selectedDay}
            </p>

            <div className="mt-3 space-y-3">
              <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                Date (series start)
                <input
                  type="date"
                  className={inputClass}
                  value={eventAnchorDate}
                  onChange={(e) => setEventAnchorDate(e.target.value)}
                />
              </label>
              <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                Title
                <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                Type
                <select
                  className={cn(inputClass, "cursor-pointer")}
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as CalendarEventType)}
                >
                  {CALENDAR_EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {EVENT_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                  Start
                  <input
                    type="time"
                    className={inputClass}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </label>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                  End
                  <input
                    type="time"
                    className={inputClass}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </label>
              </div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                Repeat
                <select
                  className={cn(inputClass, "cursor-pointer")}
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                >
                  {RECURRENCE_TYPES.map((r) => (
                    <option key={r} value={r}>
                      {RECURRENCE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </label>
              {recurrence !== "none" ? (
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                  Repeat until (optional)
                  <input
                    type="date"
                    className={inputClass}
                    value={recurrenceUntil}
                    onChange={(e) => setRecurrenceUntil(e.target.value)}
                  />
                  <span className="mt-0.5 block text-[10px] font-normal text-gray-500 dark:text-neutral-500">
                    Leave empty to repeat far into the future (capped when loading the calendar).
                  </span>
                </label>
              ) : null}
              <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                Link lead (optional)
                <select
                  className={cn(inputClass, "cursor-pointer")}
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                >
                  <option value="">—</option>
                  {leadOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                Link client (optional)
                <select
                  className={cn(inputClass, "cursor-pointer")}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  <option value="">—</option>
                  {clientOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                Alert
                <select
                  className={cn(inputClass, "cursor-pointer")}
                  value={alertMinutes}
                  onChange={(e) => setAlertMinutes(Number(e.target.value))}
                >
                  {ALERT_MINUTES_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                Notes
                <textarea
                  className={cn(inputClass, "min-h-[72px] resize-y")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-400/30 dark:border-neutral-600/35 pt-3">
              <button
                type="button"
                disabled={saving || !title.trim()}
                onClick={() => void saveEvent()}
                className="rounded-lg border border-gray-500/40 bg-gray-200/90 px-3 py-2 text-xs font-semibold text-gray-900 dark:text-neutral-50 disabled:opacity-40"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-lg border border-transparent px-3 py-2 text-xs font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-200/60"
              >
                Cancel
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => void deleteEvent(editingId)}
                  className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-400/50 bg-red-50 px-3 py-2 text-xs font-semibold text-red-900"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
