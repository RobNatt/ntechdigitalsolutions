"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import {
  getNtechAccountabilityPack,
  weekdaySlotLabel,
} from "@/lib/dashboard/pa-assignments-defaults";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import {
  DEFAULT_PA_TIMEZONE,
  evaluatePaAssignments,
  loadPaAssignments,
  mergeAssistantContext,
  mergeDefaultPack,
  type PaAssignment,
  type PaAssignmentFrequency,
  savePaAssignments,
} from "@/lib/dashboard/pa-assignments";

type Role = "user" | "assistant";
type Msg = { role: Role; content: string };
type ShortTermMemoryTurn = {
  role: Role;
  content: string;
  createdAt: string;
};
type AssistantContext = {
  hash: string;
  snapshot: Record<string, unknown>;
  timeZone: string;
  longTermMemory?: Array<Record<string, unknown>>;
};

const AUTO_BRIEF_DELAY_MS = 3000;
const CONTEXT_POLL_MS = 45_000;
const SHORT_TERM_MEMORY_KEY = "ntech_dashboard_assistant_short_memory_v1";
const SHORT_TERM_MEMORY_LIMIT = 60;
const SHORT_TERM_MEMORY_RETENTION_DAYS = 7;

function statusBadgeClass(s: "ok" | "due" | "overdue") {
  if (s === "ok")
    return "border border-emerald-400/40 bg-emerald-100 text-emerald-900";
  if (s === "due")
    return "border border-amber-400/40 bg-amber-100 text-amber-900";
  return "border border-red-400/40 bg-red-100 text-red-900";
}

function assignmentCadenceLabel(a: PaAssignment): string {
  if (a.frequency === "daily") return "Daily";
  if (a.frequency === "weekly") return "Weekly · rolling 7-day";
  return `Weekly · ${weekdaySlotLabel(a.weekdaySlot ?? 0)}`;
}

function loadShortMemory(): ShortTermMemoryTurn[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SHORT_TERM_MEMORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const cutoff = Date.now() - SHORT_TERM_MEMORY_RETENTION_DAYS * 86_400_000;
    return parsed
      .filter((r): r is ShortTermMemoryTurn => {
        if (!r || typeof r !== "object") return false;
        const o = r as Record<string, unknown>;
        return (
          (o.role === "user" || o.role === "assistant") &&
          typeof o.content === "string" &&
          typeof o.createdAt === "string"
        );
      })
      .filter((r) => {
        const t = new Date(r.createdAt).getTime();
        return Number.isFinite(t) && t >= cutoff;
      })
      .slice(-SHORT_TERM_MEMORY_LIMIT);
  } catch {
    return [];
  }
}

export function DashboardAssistantPanel() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextMeta, setContextMeta] = useState<{
    hash: string;
    updatedAt: string | null;
  } | null>(null);

  const [assignments, setAssignments] = useState<PaAssignment[]>([]);
  const [assignmentsHydrated, setAssignmentsHydrated] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFrequency, setNewFrequency] =
    useState<PaAssignmentFrequency>("daily");
  const [newWeekdaySlot, setNewWeekdaySlot] = useState(0);
  const [assignmentsOpen, setAssignmentsOpen] = useState(true);
  const [assistantTimeZone, setAssistantTimeZone] = useState(DEFAULT_PA_TIMEZONE);
  const [shortTermMemory, setShortTermMemory] = useState<ShortTermMemoryTurn[]>([]);

  const evaluatedAssignments = useMemo(
    () => evaluatePaAssignments(assignments, assistantTimeZone),
    [assignments, assistantTimeZone]
  );

  /** Scroll only the chat transcript — never `scrollIntoView` (it scrolls parent dashboard panes). */
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Msg[]>([]);
  const loadingRef = useRef(false);
  const contextRef = useRef<AssistantContext | null>(null);
  const assignmentsRef = useRef<PaAssignment[]>([]);
  const shortMemoryRef = useRef<ShortTermMemoryTurn[]>([]);
  const initialBriefSentRef = useRef(false);
  const autoBriefTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    assignmentsRef.current = assignments;
  }, [assignments]);

  useEffect(() => {
    shortMemoryRef.current = shortTermMemory;
  }, [shortTermMemory]);

  useEffect(() => {
    const loaded = loadPaAssignments();
    setAssignments(
      loaded.length > 0 ? loaded : getNtechAccountabilityPack()
    );
    setShortTermMemory(loadShortMemory());
    setAssignmentsHydrated(true);
  }, []);

  useEffect(() => {
    if (!assignmentsHydrated) return;
    savePaAssignments(assignments);
  }, [assignments, assignmentsHydrated]);

  useEffect(() => {
    if (!assignmentsHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(
      SHORT_TERM_MEMORY_KEY,
      JSON.stringify(shortTermMemory.slice(-SHORT_TERM_MEMORY_LIMIT))
    );
  }, [shortTermMemory, assignmentsHydrated]);

  const fetchContext = useCallback(async (): Promise<AssistantContext | null> => {
    try {
      const res = await fetch("/api/dashboard-assistant/context", {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = (await res.json()) as {
        hash?: string;
        snapshot?: Record<string, unknown>;
        timeZone?: string;
        longTermMemory?: Array<Record<string, unknown>>;
      };
      if (!data.hash || !data.snapshot) return null;
      const timeZone =
        typeof data.timeZone === "string" && data.timeZone.trim()
          ? data.timeZone.trim()
          : DEFAULT_PA_TIMEZONE;
      return {
        hash: data.hash,
        snapshot: data.snapshot,
        timeZone,
        longTermMemory: Array.isArray(data.longTermMemory)
          ? data.longTermMemory
          : [],
      };
    } catch {
      return null;
    }
  }, []);

  const buildContextPayload = useCallback(() => {
    const tz = contextRef.current?.timeZone ?? DEFAULT_PA_TIMEZONE;
    const base = mergeAssistantContext(
      contextRef.current?.snapshot ?? null,
      assignmentsRef.current,
      tz
    );
    return {
      ...base,
      longTermMemory: contextRef.current?.longTermMemory ?? [],
      shortTermConversationMemory: shortMemoryRef.current.slice(-14),
    };
  }, []);

  const runAssistant = useCallback(async (text: string, showUserBubble: boolean) => {
    if (!text.trim() || loadingRef.current) return;
    setError(null);
    const base = messagesRef.current;
    const history: Msg[] = showUserBubble
      ? [...base, { role: "user", content: text }]
      : base;
    const requestMessages: Msg[] = showUserBubble
      ? history
      : [...history, { role: "user", content: text }];
    if (showUserBubble) {
      setInput("");
      setMessages(history);
      setShortTermMemory((prev) =>
        [
          ...prev,
          {
            role: "user" as const,
            content: text,
            createdAt: new Date().toISOString(),
          },
        ].slice(-SHORT_TERM_MEMORY_LIMIT)
      );
    }

    loadingRef.current = true;
    setLoading(true);
    let assistantContent = "";

    try {
      const res = await fetch("/api/dashboard-assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: requestMessages,
          context: buildContextPayload(),
        }),
      });

      if (res.status === 401) {
        throw new Error("Session expired — refresh or sign in again.");
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      if (!res.body) throw new Error("No response body");

      setMessages([...history, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: assistantContent }]);
      }
      if (assistantContent.trim()) {
        setShortTermMemory((prev) =>
          [
            ...prev,
            {
              role: "assistant" as const,
              content: assistantContent,
              createdAt: new Date().toISOString(),
            },
          ].slice(-SHORT_TERM_MEMORY_LIMIT)
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages(history);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [buildContextPayload]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loadingRef.current) return;
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.PA_INTERACTION, {
      action: "send_message",
    });
    await runAssistant(text, true);
  }, [input, runAssistant]);

  function addAssignment() {
    const title = newTitle.trim();
    if (!title) return;
    if (newFrequency === "weekday" && (newWeekdaySlot < 0 || newWeekdaySlot > 6)) {
      return;
    }
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const desc = newDescription.trim();
    const row: PaAssignment = {
      id,
      title,
      frequency: newFrequency,
      lastCompletedAt: null,
      createdAt,
      ...(desc ? { description: desc } : {}),
      ...(newFrequency === "weekday" ? { weekdaySlot: newWeekdaySlot } : {}),
    };
    setAssignments((prev) => [...prev, row]);
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.PA_INTERACTION, {
      action: "add_assignment",
    });
    setNewTitle("");
    setNewDescription("");
  }

  function addNtechDefaultPack() {
    setAssignments((prev) => mergeDefaultPack(prev, getNtechAccountabilityPack()));
  }

  function markAssignmentDone(id: string) {
    const now = new Date().toISOString();
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, lastCompletedAt: now } : a))
    );
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.PA_INTERACTION, {
      action: "mark_assignment_done",
    });
  }

  function removeAssignment(id: string) {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const ctx = await fetchContext();
      if (!mounted) return;
      if (ctx) {
        contextRef.current = ctx;
        setAssistantTimeZone(ctx.timeZone);
        setContextMeta({
          hash: ctx.hash,
          updatedAt: String(
            (ctx.snapshot.generatedAt as string | undefined) ?? ""
          ),
        });
      }
      if (autoBriefTimerRef.current) window.clearTimeout(autoBriefTimerRef.current);
      autoBriefTimerRef.current = window.setTimeout(() => {
        if (initialBriefSentRef.current || loadingRef.current) return;
        initialBriefSentRef.current = true;
        void runAssistant(
          "Give me my executive briefing now: summarize yesterday, today ahead, missed lead follow-ups, traffic milestones, AND my PA assignment checklist (due/overdue items by title). Keep it concise and action-first.",
          false
        );
      }, AUTO_BRIEF_DELAY_MS);
    })();

    return () => {
      mounted = false;
      if (autoBriefTimerRef.current) window.clearTimeout(autoBriefTimerRef.current);
    };
  }, [fetchContext, runAssistant]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void (async () => {
        const latest = await fetchContext();
        if (!latest) return;
        const prevHash = contextRef.current?.hash;
        contextRef.current = latest;
        setAssistantTimeZone(latest.timeZone);
        setContextMeta({
          hash: latest.hash,
          updatedAt: String(
            (latest.snapshot.generatedAt as string | undefined) ?? ""
          ),
        });
        if (!prevHash || prevHash === latest.hash) return;
        if (!initialBriefSentRef.current || loadingRef.current) return;
        void runAssistant(
          "New updates just landed in my dashboard context. Give me a short delta report, what changed, my top 3 next actions, and re-check my PA assignment checklist.",
          false
        );
      })();
    }, CONTEXT_POLL_MS);
    return () => clearInterval(id);
  }, [fetchContext, runAssistant]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-gray-400/45 bg-white/95 shadow-inner">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-400/35 bg-gradient-to-r from-sky-50/90 to-gray-100/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-400/40 bg-white shadow-sm">
            <Bot className="h-5 w-5 text-sky-700" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Executive assistant</p>
            <p className="text-[11px] text-gray-600">
              Planning, accountability &amp; business rhythm — Groq (private)
            </p>
          </div>
        </div>
        {contextMeta?.hash ? (
          <div className="text-right text-[10px] text-gray-500">
            <p>Live context: {contextMeta.hash}</p>
            <p>
              {contextMeta.updatedAt
                ? new Date(contextMeta.updatedAt).toLocaleTimeString()
                : ""}
            </p>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-b border-gray-400/25 px-4 py-3">
        <div className="rounded-xl border border-gray-400/35 bg-white/90 shadow-sm">
          <button
            type="button"
            onClick={() => setAssignmentsOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-semibold text-gray-900"
          >
            <span>PA assignment checklist</span>
            <span className="text-xs font-normal text-gray-500">
              {assignmentsOpen ? "Hide" : "Show"} · {assignments.length} item
              {assignments.length === 1 ? "" : "s"}
            </span>
          </button>
          {assignmentsOpen ? (
            <div className="max-h-[min(42vh,24rem)] space-y-3 overflow-y-auto overscroll-contain border-t border-gray-400/25 px-3 py-3">
              <p className="text-xs text-gray-600">
                <strong className="font-semibold text-gray-800">Daily</strong> — due
                each calendar day ({assistantTimeZone}).{" "}
                <strong className="font-semibold text-gray-800">
                  Weekly · rolling
                </strong>{" "}
                — next due 7 days after you last mark done.{" "}
                <strong className="font-semibold text-gray-800">
                  Weekly · fixed day
                </strong>{" "}
                — due on the same weekday every week (pick below). Stored on this
                browser only. First visit loads the N-Tech accountability pack; merge
                defaults with the button if needed.
              </p>
              <button
                type="button"
                onClick={addNtechDefaultPack}
                className="w-full rounded-lg border border-sky-400/50 bg-sky-50 px-3 py-2 text-left text-xs font-semibold text-sky-950 sm:w-auto"
              >
                Add N-Tech default pack (merge missing items)
              </button>
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">
                  New assignment title
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Review stale leads in CRM"
                    className="mt-1 w-full rounded-lg border border-gray-400/45 bg-white px-2 py-1.5 text-sm text-gray-900"
                  />
                </label>
                <label className="block text-xs text-gray-600">
                  Notes for the PA (optional)
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Checklist bullets, links, or scope…"
                    rows={2}
                    className="mt-1 w-full resize-y rounded-lg border border-gray-400/45 bg-white px-2 py-1.5 text-sm text-gray-900"
                  />
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                    <label className="text-xs text-gray-600">
                      Cadence
                      <select
                        value={newFrequency}
                        onChange={(e) =>
                          setNewFrequency(e.target.value as PaAssignmentFrequency)
                        }
                        className="mt-1 block w-full min-w-[12rem] rounded-lg border border-gray-400/45 bg-white px-2 py-1.5 text-sm text-gray-900 sm:w-auto"
                      >
                        <option value="daily">Daily · each calendar day</option>
                        <option value="weekly">Weekly · rolling (7 days after done)</option>
                        <option value="weekday">Weekly · same weekday</option>
                      </select>
                    </label>
                    {newFrequency === "weekday" ? (
                      <label className="text-xs text-gray-600">
                        Day
                        <select
                          value={newWeekdaySlot}
                          onChange={(e) =>
                            setNewWeekdaySlot(Number(e.target.value))
                          }
                          className="mt-1 block w-full min-w-[9rem] rounded-lg border border-gray-400/45 bg-white px-2 py-1.5 text-sm text-gray-900 sm:w-auto"
                        >
                          {[0, 1, 2, 3, 4, 5, 6].map((slot) => (
                            <option key={slot} value={slot}>
                              {weekdaySlotLabel(slot)}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={addAssignment}
                    disabled={!newTitle.trim()}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>
              {assignments.length === 0 ? (
                <p className="text-xs text-gray-500">No assignments yet.</p>
              ) : (
                <ul className="space-y-2">
                  {evaluatedAssignments.map((a) => (
                    <li
                      key={a.id}
                      className="flex flex-col gap-2 rounded-lg border border-gray-400/30 bg-gray-50/90 p-2 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass(a.status)}`}
                          >
                            {a.status}
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {a.title}
                          </p>
                        </div>
                        <p className="mt-0.5 text-[11px] text-gray-600">
                          {assignmentCadenceLabel(a)} · {a.reason}
                        </p>
                        {a.lastCompletedAt ? (
                          <p className="mt-0.5 text-[10px] text-gray-500">
                            Last marked done{" "}
                            {new Date(a.lastCompletedAt).toLocaleString(undefined, {
                              timeZone: assistantTimeZone,
                            })}
                          </p>
                        ) : null}
                        {a.description ? (
                          <details className="mt-1.5 text-[11px] text-gray-700">
                            <summary className="cursor-pointer font-medium text-gray-800">
                              Details
                            </summary>
                            <pre className="mt-1 max-h-40 overflow-y-auto whitespace-pre-wrap rounded border border-gray-400/25 bg-white/80 p-2 font-sans text-[11px] leading-snug">
                              {a.description}
                            </pre>
                          </details>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 gap-2 sm:flex-col sm:items-stretch">
                        <button
                          type="button"
                          onClick={() => markAssignmentDone(a.id)}
                          className="rounded-lg border border-emerald-500/50 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-900"
                        >
                          Mark done
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAssignment(a.id)}
                          className="rounded-lg border border-gray-400/45 px-2 py-1 text-[11px] text-gray-700"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div
        ref={messagesScrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-3"
      >
        {messages.length === 0 && (
          <div className="rounded-xl border border-gray-400/30 bg-gray-100/60 p-4 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Getting your briefing ready…</p>
            <p className="mt-2 text-gray-600">
              In ~3 seconds I will summarize yesterday, today ahead, missed follow-ups,
              traffic milestones, and your PA assignment checklist. Add commitments
              above so I can hold you accountable.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-6 rounded-xl border border-gray-400/35 bg-gray-800 px-3 py-2 text-sm text-white"
                : "mr-6 rounded-xl border border-gray-400/30 bg-gray-100/90 px-3 py-2 text-sm text-gray-900"
            }
          >
            <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide opacity-70">
              {m.role === "user" ? "You" : "Assistant"}
            </span>
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <p className="text-xs text-gray-500">Thinking…</p>
        )}
      </div>

      {error && (
        <div className="shrink-0 border-t border-red-300/60 bg-red-50 px-4 py-2 text-xs text-red-900">
          {error}
        </div>
      )}

      <div className="shrink-0 border-t border-gray-400/35 bg-gray-50/90 p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask for priorities, follow-up list, or today's schedule…"
            rows={2}
            disabled={loading}
            className="min-h-[2.5rem] flex-1 resize-none rounded-xl border border-gray-400/45 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-sky-500/30 placeholder:text-gray-400 focus:ring-2"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="self-end rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-40"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-[10px] text-gray-500">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
