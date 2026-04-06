"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, RefreshCw, Server } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusPayload = {
  ok: boolean;
  env: { hasPublicUrl: boolean; hasServiceRole: boolean; hasAnonKey: boolean };
  projectHost: string | null;
  projectRef: string | null;
  dashboardHref: string | null;
  databaseReachable: boolean;
  counts: {
    leads: number | null;
    clients: number | null;
    calendar_events: number | null;
  };
  probeErrors?: string[];
};

function CheckRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gray-400/20 py-2 text-sm last:border-0">
      <span className="text-gray-700">{label}</span>
      <span
        className={cn(
          "rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
          ok ? "bg-emerald-100/90 text-emerald-900" : "bg-red-100/90 text-red-900"
        )}
      >
        {ok ? "OK" : "Missing / error"}
      </span>
    </div>
  );
}

export function CeoSupabaseSection() {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/supabase-status");
      const json = (await res.json()) as StatusPayload & { error?: string };
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Failed to load status.");
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setError("Failed to load status.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Server className="h-4 w-4 text-sky-700" />
            Supabase &amp; data backend
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            This dashboard talks to your database through the app&apos;s server (service role). Use
            this panel to confirm env vars and connectivity. Schema changes still run in the{" "}
            <span className="font-medium text-gray-800">Supabase SQL Editor</span> or CLI from{" "}
            <code className="rounded bg-gray-400/25 px-1 text-xs">supabase/migrations</code>.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void load()}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-400/50 bg-gray-200/50 px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm hover:bg-gray-300/60 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh status
        </button>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {loading && !data ? (
        <p className="text-sm text-gray-600">Checking Supabase…</p>
      ) : data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-400/40 bg-gray-300/20 p-4 shadow-inner backdrop-blur-sm">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
              Configuration
            </h3>
            <div className="mt-2">
              <CheckRow label="NEXT_PUBLIC_SUPABASE_URL" ok={data.env.hasPublicUrl} />
              <CheckRow label="SUPABASE_SERVICE_ROLE_KEY (server)" ok={data.env.hasServiceRole} />
              <CheckRow label="NEXT_PUBLIC_SUPABASE_ANON_KEY" ok={data.env.hasAnonKey} />
              <CheckRow label="Database reachable (leads table)" ok={data.databaseReachable} />
            </div>
            {data.projectHost ? (
              <p className="mt-3 break-all font-mono text-[11px] text-gray-600">
                Host: {data.projectHost}
              </p>
            ) : null}
            {data.dashboardHref ? (
              <a
                href={data.dashboardHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-800 underline decoration-sky-400 underline-offset-2 hover:text-sky-950"
              >
                Open Supabase project dashboard
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <p className="mt-3 text-xs text-gray-500">
                Dashboard link appears when the public URL uses{" "}
                <code className="rounded bg-gray-400/20 px-1">*.supabase.co</code>.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-400/40 bg-gray-300/20 p-4 shadow-inner backdrop-blur-sm">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
              Live counts (service role)
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between gap-2 border-b border-gray-400/15 pb-2">
                <span className="text-gray-700">Leads</span>
                <span className="tabular-nums font-semibold text-gray-900">
                  {data.counts.leads ?? "—"}
                </span>
              </li>
              <li className="flex justify-between gap-2 border-b border-gray-400/15 pb-2">
                <span className="text-gray-700">Clients</span>
                <span className="tabular-nums font-semibold text-gray-900">
                  {data.counts.clients ?? "—"}
                </span>
              </li>
              <li className="flex justify-between gap-2">
                <span className="text-gray-700">Calendar events</span>
                <span className="tabular-nums font-semibold text-gray-900">
                  {data.counts.calendar_events ?? "—"}
                </span>
              </li>
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-gray-600">
              CRM actions (leads, clients, calendar) in other tabs use these same server routes. If
              counts stay empty while the app errors, run pending files under{" "}
              <code className="rounded bg-gray-400/25 px-1">supabase/migrations</code>.
            </p>
          </div>

          {data.probeErrors?.length ? (
            <div className="rounded-xl border border-amber-300/60 bg-amber-50/90 p-3 text-sm text-amber-950 lg:col-span-2">
              <p className="font-semibold">Probe notes</p>
              <ul className="mt-2 list-inside list-disc text-xs">
                {data.probeErrors.map((e) => (
                  <li key={e} className="font-mono">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-semibold lg:col-span-2",
              data.ok
                ? "border-emerald-400/50 bg-emerald-50/80 text-emerald-950"
                : "border-red-400/50 bg-red-50/80 text-red-950"
            )}
          >
            {data.ok
              ? "Supabase is wired for this deployment and the database answered a live query."
              : "Something is not configured or the database did not respond. Fix env vars in Vercel (or .env) and migrations in Supabase."}
          </div>
        </div>
      ) : null}
    </div>
  );
}
