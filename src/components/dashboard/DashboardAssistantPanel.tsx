"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";

type Role = "user" | "assistant";
type Msg = { role: Role; content: string };

export function DashboardAssistantPanel() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setInput("");
    const nextUser: Msg = { role: "user", content: text };
    const history: Msg[] = [...messages, nextUser];
    setMessages(history);
    setLoading(true);

    let assistantContent = "";

    try {
      const res = await fetch("/api/dashboard-assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
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
        setMessages([
          ...history,
          { role: "assistant", content: assistantContent },
        ]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages(history);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-gray-400/45 bg-white/95 shadow-inner">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-400/35 bg-gradient-to-r from-sky-50/90 to-gray-100/80 px-4 py-3">
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

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-3">
        {messages.length === 0 && (
          <div className="rounded-xl border border-gray-400/30 bg-gray-100/60 p-4 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Start anywhere</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
              <li>
                &quot;Plan my day&quot; — priorities and time blocks
              </li>
              <li>
                &quot;What should I verify in the CRM this week?&quot;
              </li>
              <li>
                Hold me accountable: I said I&apos;d follow up with X…
              </li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              I can&apos;t read your database or send mail — I&apos;ll tell you
              what to check and log in the dashboard.
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
        <div ref={bottomRef} />
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
            placeholder="Ask for a daily plan, CRM check-in, or accountability…"
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
