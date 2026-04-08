"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";

type Role = "user" | "assistant";
type Msg = { role: Role; content: string };
type AssistantContext = {
  hash: string;
  snapshot: Record<string, unknown>;
};

const AUTO_BRIEF_DELAY_MS = 3000;
const CONTEXT_POLL_MS = 45_000;

export function DashboardAssistantPanel() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextMeta, setContextMeta] = useState<{ hash: string; updatedAt: string | null } | null>(
    null
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Msg[]>([]);
  const loadingRef = useRef(false);
  const contextRef = useRef<AssistantContext | null>(null);
  const initialBriefSentRef = useRef(false);
  const autoBriefTimerRef = useRef<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const fetchContext = useCallback(async (): Promise<AssistantContext | null> => {
    try {
      const res = await fetch("/api/dashboard-assistant/context", { cache: "no-store" });
      if (!res.ok) return null;
      const data = (await res.json()) as {
        hash?: string;
        snapshot?: Record<string, unknown>;
      };
      if (!data.hash || !data.snapshot) return null;
      return { hash: data.hash, snapshot: data.snapshot };
    } catch {
      return null;
    }
  }, []);

  const runAssistant = useCallback(
    async (text: string, showUserBubble: boolean) => {
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
            context: contextRef.current?.snapshot ?? null,
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
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setMessages(history);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    []
  );

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loadingRef.current) return;
    await runAssistant(text, true);
  }, [input, runAssistant]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const ctx = await fetchContext();
      if (!mounted) return;
      if (ctx) {
        contextRef.current = ctx;
        setContextMeta({
          hash: ctx.hash,
          updatedAt: String((ctx.snapshot.generatedAt as string | undefined) ?? ""),
        });
      }
      if (autoBriefTimerRef.current) window.clearTimeout(autoBriefTimerRef.current);
      autoBriefTimerRef.current = window.setTimeout(() => {
        if (initialBriefSentRef.current || loadingRef.current) return;
        initialBriefSentRef.current = true;
        void runAssistant(
          "Give me my executive briefing now: summarize yesterday, today ahead, missed lead follow-ups, and traffic milestones using the live dashboard context. Keep it concise and action-first.",
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
        setContextMeta({
          hash: latest.hash,
          updatedAt: String((latest.snapshot.generatedAt as string | undefined) ?? ""),
        });
        if (!prevHash || prevHash === latest.hash) return;
        if (!initialBriefSentRef.current || loadingRef.current) return;
        void runAssistant(
          "New updates just landed in my dashboard context. Give me a short delta report, what changed, and my top 3 next actions.",
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
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-gray-400/45 dark:border-neutral-600/50 bg-white/95 shadow-inner dark:bg-neutral-950/95">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-400/35 dark:border-neutral-600/40 bg-gradient-to-r from-sky-50/90 to-gray-100/80 px-4 py-3 dark:from-sky-950/50 dark:to-neutral-900/85">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-400/40 bg-white shadow-sm dark:border-sky-500/35 dark:bg-neutral-900">
            <Bot className="h-5 w-5 text-sky-700 dark:text-sky-400" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-neutral-50">Executive assistant</p>
            <p className="text-[11px] text-gray-600 dark:text-neutral-400">
              Planning, accountability &amp; business rhythm — Groq (private)
            </p>
          </div>
        </div>
        {contextMeta?.hash ? (
          <div className="text-right text-[10px] text-gray-500 dark:text-neutral-500">
            <p>Live context: {contextMeta.hash}</p>
            <p>{contextMeta.updatedAt ? new Date(contextMeta.updatedAt).toLocaleTimeString() : ""}</p>
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-3">
        {messages.length === 0 && (
          <div className="rounded-xl border border-gray-400/30 dark:border-neutral-600/35 bg-gray-100/60 p-4 text-sm text-gray-700 dark:bg-neutral-800/50 dark:text-neutral-300">
            <p className="font-semibold text-gray-900 dark:text-neutral-50">Getting your briefing ready…</p>
            <p className="mt-2 text-gray-600 dark:text-neutral-400">
              3 seconds after login, I will summarize yesterday, today ahead, missed
              follow-ups, and traffic milestones. I also watch for new updates throughout the day.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-6 rounded-xl border border-gray-400/35 dark:border-neutral-600/40 bg-gray-800 px-3 py-2 text-sm text-white"
                : "mr-6 rounded-xl border border-gray-400/30 dark:border-neutral-600/35 bg-gray-100/90 px-3 py-2 text-sm text-gray-900 dark:bg-neutral-800/90 dark:text-neutral-100"
            }
          >
            <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide opacity-70">
              {m.role === "user" ? "You" : "Assistant"}
            </span>
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <p className="text-xs text-gray-500 dark:text-neutral-500">Thinking…</p>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="shrink-0 border-t border-red-300/60 bg-red-50 px-4 py-2 text-xs text-red-900 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="shrink-0 border-t border-gray-400/35 dark:border-neutral-600/40 bg-gray-50/90 p-3 dark:bg-neutral-900/90">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask for priorities, follow-up list, or today's schedule…"
            rows={2}
            disabled={loading}
            className="min-h-[2.5rem] flex-1 resize-none rounded-xl border border-gray-400/45 dark:border-neutral-600/50 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-sky-500/30 placeholder:text-gray-400 focus:ring-2 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="self-end rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-40 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-[10px] text-gray-500 dark:text-neutral-500">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
