"use client";

import { useCallback, useEffect, useState } from "react";
import { DollarSign } from "lucide-react";

type ClientRow = {
  id: string;
  name: string | null;
  email: string | null;
  company_id: string | null;
};

/**
 * Placeholder: revenue rollups per client/company (see PUBLIC-TOOLS.md).
 */
export function CeoRevenueReportsSection() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [clientId, setClientId] = useState<string>("");

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

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  const selected = clients.find((c) => c.id === clientId);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <DollarSign className="h-4 w-4 text-emerald-700" aria-hidden />
          Revenue reports
        </p>
        <p className="mt-1 max-w-xl text-sm text-gray-600">
          Future: MRR, invoices, and pipeline value scoped to the selected client / company. See{" "}
          <code className="rounded bg-gray-400/20 px-1 text-xs">PUBLIC-TOOLS.md</code> for the
          roadmap.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-400/40 bg-gray-300/15 p-2">
        <span className="px-2 text-xs font-semibold text-gray-800">Client:</span>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="min-w-[220px] rounded-xl border border-gray-400/50 bg-white/90 py-2 pl-3 pr-8 text-sm font-medium text-gray-900 shadow-sm"
        >
          <option value="">Select a client…</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name || c.email || c.id.slice(0, 8)}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-400/50 bg-gray-300/10 px-6 py-12 text-center">
        <p className="text-sm text-gray-700">
          {selected ? (
            <>
              Scoped view for <strong>{selected.name || selected.email || selected.id}</strong>
              {selected.company_id ? (
                <>
                  {" "}
                  (company <code className="rounded bg-gray-400/20 px-1 text-xs">{selected.company_id}</code>
                  )
                </>
              ) : (
                <> — no company linked yet.</>
              )}
            </>
          ) : (
            "Choose a client to preview how revenue reporting will be filtered."
          )}
        </p>
        <p className="mt-3 text-xs text-gray-500">
          No billing data wired yet — this panel is intentionally a shell tied to CRM clients.
        </p>
      </div>
    </div>
  );
}
