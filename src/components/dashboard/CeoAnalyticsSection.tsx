"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, ChevronDown, Copy, LineChart, Plus } from "lucide-react";
import { NTECH_COMPANY_ID } from "@/constants/analytics";
import { SITE_URL } from "@/constants/site";
import { cn } from "@/lib/utils";

type ClientRow = {
  id: string;
  name: string | null;
  email: string | null;
  company_id: string | null;
};

type PathRow = { path?: string; count?: number };
type RefRow = { referrer?: string; count?: number };
type UtmRow = { source?: string; count?: number };
type DayRow = { day?: string; count?: number };

type SummaryPayload = {
  totalPageviews?: number;
  inquirySubmissions?: number;
  uniqueSessions?: number;
  uniqueVisitors?: number;
  sessionsWithMultiplePageviews?: number;
  sessionsReachedContact?: number;
  topPaths?: PathRow[];
  topReferrers?: RefRow[];
  topUtmSources?: UtmRow[];
  dailyPageviews?: DayRow[];
};

type SiteKeyRow = {
  id: string;
  label: string;
  write_key: string;
  created_at: string;
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-400/40 bg-gray-300/20 p-4 shadow-inner backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-gray-900 sm:text-3xl">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-gray-600">{hint}</p> : null}
    </div>
  );
}

function RowList({
  title,
  rows,
  leftKey,
}: {
  title: string;
  rows: { left: string; count: number }[];
  leftKey: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-gray-400/30 bg-white/40 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
          {title}
        </p>
        <p className="mt-2 text-sm text-gray-600">No data in this range yet.</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-gray-400/30 bg-white/40 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {rows.map((r, i) => (
          <li
            key={`${leftKey}-${i}`}
            className="flex items-center justify-between gap-2 border-b border-gray-400/15 pb-2 last:border-0 last:pb-0"
          >
            <span className="min-w-0 truncate font-medium text-gray-800" title={r.left}>
              {r.left}
            </span>
            <span className="shrink-0 tabular-nums text-gray-700">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CeoAnalyticsSection() {
  const [mode, setMode] = useState<"ntech" | "client">("ntech");
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryPayload | null>(null);
  const [siteKeys, setSiteKeys] = useState<SiteKeyRow[]>([]);
  const [since, setSince] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [keyMessage, setKeyMessage] = useState<string | null>(null);

  const activeCompanyId = useMemo(() => {
    if (mode === "ntech") return NTECH_COMPANY_ID;
    const c = clients.find((x) => x.id === clientId);
    return c?.company_id ?? null;
  }, [mode, clients, clientId]);

  const loadClients = useCallback(async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (!res.ok) return;
      const list = Array.isArray(data.clients) ? (data.clients as ClientRow[]) : [];
      setClients(list);
    } catch {
      /* ignore */
    }
  }, []);

  const loadSummary = useCallback(async () => {
    const companyId = activeCompanyId;
    if (!companyId) {
      setSummary(null);
      setSiteKeys([]);
      setSince(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/analytics/summary?companyId=${encodeURIComponent(companyId)}&days=${days}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load.");
        setSummary(null);
        setSiteKeys([]);
        return;
      }
      setSummary((data.summary as SummaryPayload) ?? {});
      setSiteKeys(Array.isArray(data.siteKeys) ? data.siteKeys : []);
      setSince(typeof data.since === "string" ? data.since : null);
    } catch {
      setError("Failed to load analytics.");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [activeCompanyId, days]);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    if (!autoRefresh || !activeCompanyId) return;
    const id = setInterval(() => {
      void loadSummary();
    }, 45_000);
    return () => clearInterval(id);
  }, [autoRefresh, activeCompanyId, loadSummary]);

  const clientsWithCompany = useMemo(
    () => clients.filter((c) => c.company_id),
    [clients]
  );

  async function createSiteKey() {
    if (!activeCompanyId) return;
    setCreatingKey(true);
    setKeyMessage(null);
    try {
      const res = await fetch("/api/analytics/site-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: activeCompanyId,
          label: newKeyLabel.trim() || "Site",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setKeyMessage(typeof data.error === "string" ? data.error : "Could not create key.");
        return;
      }
      setNewKeyLabel("");
      setKeyMessage("New write key created. Copy it below — it won’t be shown again in full elsewhere.");
      await loadSummary();
    } catch {
      setKeyMessage("Could not create key.");
    } finally {
      setCreatingKey(false);
    }
  }

  function copy(text: string) {
    void navigator.clipboard.writeText(text);
  }

  const topPaths = useMemo(() => {
    const raw = summary?.topPaths;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((r) => ({
        left: String(r.path ?? ""),
        count: Number(r.count ?? 0),
      }))
      .filter((r) => r.left.length > 0);
  }, [summary]);

  const topRefs = useMemo(() => {
    const raw = summary?.topReferrers;
    if (!Array.isArray(raw)) return [];
    return raw.map((r) => ({
      left: String(r.referrer ?? ""),
      count: Number(r.count ?? 0),
    }));
  }, [summary]);

  const topUtm = useMemo(() => {
    const raw = summary?.topUtmSources;
    if (!Array.isArray(raw)) return [];
    return raw.map((r) => ({
      left: String(r.source ?? ""),
      count: Number(r.count ?? 0),
    }));
  }, [summary]);

  const daily = useMemo(() => {
    const raw = summary?.dailyPageviews;
    if (!Array.isArray(raw)) return [];
    return raw.map((d) => ({
      day: String(d.day ?? ""),
      count: Number(d.count ?? 0),
    }));
  }, [summary]);

  const maxDaily = useMemo(
    () => (daily.length ? Math.max(...daily.map((d) => d.count), 1) : 1),
    [daily]
  );

  const embedSnippet = (writeKey: string) =>
    `// Set in your app env: NEXT_PUBLIC_ANALYTICS_WRITE_KEY=${writeKey}\n// Or POST JSON to ${SITE_URL}/api/analytics/collect`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <LineChart className="h-4 w-4 text-sky-700" aria-hidden />
            First-party analytics
          </p>
          <p className="mt-1 max-w-xl text-sm text-gray-600">
            Traffic sources, depth (multi-page sessions), contact reach, and inquiry form
            submissions — scoped by company so you can reuse the same pipeline for clients.
          </p>
          <p className="mt-2 max-w-xl text-xs text-gray-500">
            Events are written as they happen (near real-time). This tab refetches every 45s while
            open, or use Refresh — there is no live WebSocket feed.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void loadSummary()}
            className="rounded-lg border border-gray-400/50 bg-gray-200/40 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-300/50"
          >
            Refresh
          </button>
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-gray-700">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-400"
            />
            Auto (45s)
          </label>
          {([7, 30, 90] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm",
                days === d
                  ? "border-sky-600 bg-sky-100/90 text-sky-900"
                  : "border-gray-400/50 bg-gray-200/40 text-gray-800 hover:bg-gray-300/50"
              )}
            >
              Last {d}d
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-400/40 bg-gray-300/15 p-2">
        <button
          type="button"
          onClick={() => {
            setMode("ntech");
            setClientId("");
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            mode === "ntech"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:bg-white/50"
          )}
        >
          N-Tech (us)
        </button>
        <button
          type="button"
          onClick={() => setMode("client")}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
            mode === "client"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:bg-white/50"
          )}
        >
          <Building2 className="h-4 w-4" aria-hidden />
          Clients
        </button>
        {mode === "client" ? (
          <div className="relative min-w-[220px] flex-1">
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-400/50 bg-white/90 py-2.5 pl-3 pr-10 text-sm font-medium text-gray-900 shadow-sm"
            >
              <option value="">Select a client…</option>
              {clientsWithCompany.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.email || c.id.slice(0, 8)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
          </div>
        ) : null}
      </div>

      {mode === "client" && clientsWithCompany.length === 0 && !loading ? (
        <p className="rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          No clients with a linked <code className="rounded bg-amber-100/80 px-1">company_id</code> yet.
          Set <code className="rounded bg-amber-100/80 px-1">company_id</code> on a client row in Supabase
          (one company per tenant), then create a write key below.
        </p>
      ) : null}

      {error && (
        <p className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      {mode === "client" && !clientId ? (
        <p className="rounded-lg border border-gray-400/40 bg-gray-200/30 px-4 py-8 text-center text-sm text-gray-600">
          Select a client to load their analytics (requires{" "}
          <code className="rounded bg-gray-400/25 px-1">company_id</code> on the client).
        </p>
      ) : null}

      {loading ? (
        <p className="py-12 text-center text-sm text-gray-600">Loading analytics…</p>
      ) : !activeCompanyId ? null : (
        <>
          {since ? (
            <p className="text-xs text-gray-500">
              Range from {new Date(since).toLocaleDateString()} (UTC midnight) · company{" "}
              <code className="rounded bg-gray-400/20 px-1 text-[11px]">{activeCompanyId}</code>
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Pageviews" value={summary?.totalPageviews ?? 0} />
            <StatCard
              label="Contact / inquiry submissions"
              value={summary?.inquirySubmissions ?? 0}
              hint="Successful sends from /api/inquiries"
            />
            <StatCard label="Unique sessions" value={summary?.uniqueSessions ?? 0} />
            <StatCard label="Unique visitors" value={summary?.uniqueVisitors ?? 0} />
            <StatCard
              label="Sessions with 2+ pages"
              value={summary?.sessionsWithMultiplePageviews ?? 0}
              hint="How far people browse (pageviews only)"
            />
            <StatCard
              label="Sessions touching contact or inquiry"
              value={summary?.sessionsReachedContact ?? 0}
              hint="/contact views or form submit"
            />
          </div>

          <div className="rounded-xl border border-gray-400/30 bg-white/40 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
              Pageviews by day (UTC)
            </p>
            {daily.length === 0 ? (
              <p className="mt-3 text-sm text-gray-600">No pageviews in this window.</p>
            ) : (
              <div className="mt-4 flex h-36 items-end gap-1">
                {daily.map((d) => (
                  <div
                    key={d.day}
                    className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
                    title={`${d.day}: ${d.count}`}
                  >
                    <div
                      className="w-full max-w-[28px] rounded-t bg-sky-600/80"
                      style={{
                        height: `${Math.max(6, (d.count / maxDaily) * 120)}px`,
                      }}
                    />
                    <span className="max-w-full truncate text-[9px] text-gray-600">
                      {d.day.length >= 10 ? d.day.slice(5, 10) : d.day}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <RowList title="Top paths" rows={topPaths} leftKey="p" />
            <RowList title="Top referrers" rows={topRefs} leftKey="r" />
            <RowList title="UTM sources" rows={topUtm} leftKey="u" />
          </div>

          <div className="rounded-2xl border border-gray-400/40 bg-gray-300/20 p-4 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
                Tracking keys (write_key)
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder="Label (e.g. Client landing)"
                  className="min-w-[160px] rounded-lg border border-gray-400/50 bg-white/90 px-2 py-1.5 text-xs"
                />
                <button
                  type="button"
                  disabled={creatingKey}
                  onClick={() => void createSiteKey()}
                  className="inline-flex items-center gap-1 rounded-lg border border-sky-600/50 bg-sky-100/80 px-3 py-1.5 text-xs font-semibold text-sky-900 hover:bg-sky-200/80 disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                  {creatingKey ? "Creating…" : "New key"}
                </button>
              </div>
            </div>
            {keyMessage ? (
              <p className="mt-2 text-xs text-emerald-800">{keyMessage}</p>
            ) : null}
            <ul className="mt-4 space-y-3">
              {siteKeys.length === 0 ? (
                <li className="text-sm text-gray-600">No keys yet for this company.</li>
              ) : (
                siteKeys.map((k) => (
                  <li
                    key={k.id}
                    className="rounded-lg border border-gray-400/25 bg-white/50 p-3 text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-gray-900">{k.label}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(k.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <code className="break-all rounded bg-gray-400/15 px-2 py-1 text-xs text-gray-800">
                        {k.write_key}
                      </code>
                      <button
                        type="button"
                        onClick={() => copy(k.write_key)}
                        className="inline-flex items-center gap-1 rounded border border-gray-400/50 px-2 py-1 text-xs font-semibold text-gray-800"
                      >
                        <Copy className="h-3 w-3" aria-hidden />
                        Copy
                      </button>
                    </div>
                    <pre className="mt-2 max-h-24 overflow-auto rounded bg-gray-900/5 p-2 text-[10px] text-gray-700">
                      {embedSnippet(k.write_key)}
                    </pre>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
