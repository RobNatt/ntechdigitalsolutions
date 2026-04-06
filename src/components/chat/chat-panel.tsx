"use client";

import { ChatContactForm } from "@/components/chat/chat-contact-form";
import { IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";

type Msg = { role: Role; content: string };

type ChatPanelProps = {
  onClose?: () => void;
};

export function ChatPanel({ onClose }: ChatPanelProps) {
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
        }),
      });

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
    <div className="flex h-[min(32rem,70vh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-medium">Chat with us</p>
          <p className="text-xs text-muted-foreground">
            Fast answers — powered by Groq.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close chat"
          >
            <IconX className="size-5" />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            We&apos;ll ask a bit about your business and website, then we can
            help you explore options. Use{" "}
            <span className="font-medium text-foreground">
              Share contact info
            </span>{" "}
            below when you&apos;re ready for the team to follow up.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-8 rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                : "mr-8 rounded-xl bg-muted px-3 py-2 text-sm text-foreground"
            }
          >
            <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide opacity-70">
              {m.role === "user" ? "You" : "Assistant"}
            </span>
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <p className="text-xs text-muted-foreground">Thinking…</p>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatContactForm messages={messages} />

      {error && (
        <div className="border-t border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message…"
            rows={2}
            disabled={loading}
            className="min-h-[2.5rem] flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring/50 placeholder:text-muted-foreground focus:ring-2"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="self-end rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}
