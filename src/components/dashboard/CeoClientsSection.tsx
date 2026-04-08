"use client";

import { useCallback, useEffect, useState } from "react";

type ClientRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
};

export function CeoClientsSection() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load clients.");
        setClients([]);
        return;
      }
      setClients(Array.isArray(data.clients) ? data.clients : []);
    } catch {
      setError("Failed to load clients.");
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Clients synced from your CRM database. Add or edit records via the API or Supabase for now.
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-gray-200/40 px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-neutral-200 shadow-sm hover:bg-gray-300/50 dark:hover:bg-neutral-800/50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/20 dark:bg-neutral-800/50 shadow-inner backdrop-blur-sm">
        <div className="border-b border-gray-400/30 dark:border-neutral-600/35 px-4 py-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">
            All clients
          </h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="px-4 py-8 text-center text-sm text-gray-600 dark:text-neutral-400">Loading…</p>
          ) : clients.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-600 dark:text-neutral-400">
              No clients yet. Create rows in the{" "}
              <code className="rounded bg-gray-400/20 px-1">clients</code> table or extend this
              screen with a form when you are ready.
            </p>
          ) : (
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-400/25 bg-gray-400/10 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-700 dark:text-neutral-300">
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Phone</th>
                  <th className="px-4 py-2.5">Address</th>
                  <th className="px-4 py-2.5">Added</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-400/20 dark:border-neutral-600/25 last:border-0 hover:bg-gray-400/10"
                  >
                    <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-neutral-50">
                      {c.name || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-700 dark:text-neutral-300">{c.email || "—"}</td>
                    <td className="px-4 py-2.5 text-gray-700 dark:text-neutral-300 tabular-nums">{c.phone || "—"}</td>
                    <td className="px-4 py-2.5 text-gray-700 dark:text-neutral-300">{c.address || "—"}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-neutral-400 tabular-nums">
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
