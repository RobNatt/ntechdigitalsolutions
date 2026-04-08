"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Mail } from "lucide-react";

type ClientRow = {
  id: string;
  name: string | null;
  email: string | null;
  company_id: string | null;
};

type SupportMessage = {
  id: string;
  from_email: string;
  from_name: string | null;
  to_email: string | null;
  subject: string | null;
  body_text: string | null;
  client_id: string | null;
  company_id: string | null;
  read_at: string | null;
  created_at: string;
};

export function CeoSupportInboxSection() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (!res.ok) return;
      setClients(Array.isArray(data.clients) ? data.clients : []);
    } catch {
      /* ignore */
    }
  }, []);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams();
      if (clientId) q.set("clientId", clientId);
      const res = await fetch(`/api/support/messages?${q.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load.");
        setMessages([]);
        return;
      }
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch {
      setError("Failed to load messages.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const clientLabel = useMemo(() => {
    const m = new Map(clients.map((c) => [c.id, c.name || c.email || c.id.slice(0, 8)]));
    return (id: string | null) => (id ? m.get(id) ?? id.slice(0, 8) : "—");
  }, [clients]);

  async function markRead(id: string, read: boolean) {
    try {
      const res = await fetch(`/api/support/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (!res.ok) return;
      await loadMessages();
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-neutral-200">
            <Inbox className="h-4 w-4 text-sky-700" aria-hidden />
            Support inbox
          </p>
          <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-neutral-400">
            Messages ingested via{" "}
            <code className="rounded bg-gray-400/20 px-1 text-xs">POST /api/support/inbound</code>{" "}
            (email routing / automation). Filter by client when{" "}
            <code className="rounded bg-gray-400/20 px-1 text-xs">client_id</code> or matching email
            is known.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void loadMessages()}
            className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-gray-200/40 px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-neutral-200 shadow-sm hover:bg-gray-300/50 dark:hover:bg-neutral-800/50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/15 dark:bg-neutral-800/25 p-2">
        <span className="px-2 text-xs font-semibold text-gray-800 dark:text-neutral-200">Client:</span>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="min-w-[200px] rounded-xl border border-gray-400/50 dark:border-neutral-600/55 bg-white/90 py-2 pl-3 pr-8 text-sm font-medium text-gray-900 dark:text-neutral-50 shadow-sm"
        >
          <option value="">All clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name || c.email || c.id.slice(0, 8)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/20 dark:bg-neutral-800/50 shadow-inner backdrop-blur-sm">
        <div className="border-b border-gray-400/30 dark:border-neutral-600/35 px-4 py-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">
            Inbound
          </h3>
        </div>
        {loading ? (
          <p className="px-4 py-10 text-center text-sm text-gray-600 dark:text-neutral-400">Loading…</p>
        ) : messages.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-gray-600 dark:text-neutral-400">
            No messages yet. Configure email routing to{" "}
            <code className="rounded bg-gray-400/20 px-1">POST /api/support/inbound</code> — see{" "}
            <code className="rounded bg-gray-400/20 px-1">SUPPORT-EMAIL-SETUP.md</code>.
          </p>
        ) : (
          <ul className="divide-y divide-gray-400/20">
            {messages.map((m) => (
              <li key={m.id} className="px-4 py-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 gap-2">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-600 dark:text-neutral-400" aria-hidden />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-neutral-50">
                        {m.subject || "(no subject)"}
                        {!m.read_at ? (
                          <span className="ml-2 rounded bg-sky-200/80 px-1.5 py-0.5 text-[10px] font-bold uppercase text-sky-900">
                            New
                          </span>
                        ) : null}
                      </p>
                      <p className="font-mono text-xs text-gray-600 dark:text-neutral-400">
                        From {m.from_name ? `${m.from_name} ` : ""}
                        &lt;{m.from_email}&gt;
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                        To: {m.to_email || "—"} · Client: {clientLabel(m.client_id)}
                      </p>
                      {m.body_text ? (
                        <p className="mt-2 whitespace-pre-wrap text-gray-800 dark:text-neutral-200">{m.body_text}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <span className="text-nowrap text-[10px] text-gray-500 dark:text-neutral-500">
                      {m.created_at
                        ? new Date(m.created_at).toLocaleString()
                        : undefined}
                    </span>
                    {m.read_at ? (
                      <button
                        type="button"
                        onClick={() => void markRead(m.id, false)}
                        className="text-xs font-semibold text-sky-800 underline"
                      >
                        Mark unread
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void markRead(m.id, true)}
                        className="text-xs font-semibold text-sky-800 underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
