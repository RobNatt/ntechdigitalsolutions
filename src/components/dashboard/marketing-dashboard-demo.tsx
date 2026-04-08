"use client";

import { cn } from "@/lib/utils";

function DemoStatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-400/40 bg-gray-300/20 p-3 shadow-inner backdrop-blur-sm dark:border-neutral-600/45 dark:bg-neutral-800/50 sm:p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-neutral-50 sm:text-2xl">
        {value}
      </p>
      {hint ? <p className="mt-1 text-[11px] text-gray-600 dark:text-neutral-400">{hint}</p> : null}
    </div>
  );
}

function DemoRowList({
  title,
  rows,
}: {
  title: string;
  rows: { left: string; count: number }[];
}) {
  return (
    <div className="rounded-xl border border-gray-400/30 bg-white/40 p-3 dark:border-neutral-600/35 dark:bg-neutral-900/40">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">
        {title}
      </p>
      <ul className="mt-2 space-y-1.5 text-[13px]">
        {rows.map((r, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-2 border-b border-gray-400/10 pb-1.5 last:border-0 last:pb-0 dark:border-neutral-600/20"
          >
            <span className="min-w-0 truncate font-medium text-gray-800 dark:text-neutral-200">{r.left}</span>
            <span className="shrink-0 tabular-nums text-gray-700 dark:text-neutral-300">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScorePill({
  label,
  score,
  good,
}: {
  label: string;
  score: number;
  good?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border px-3 py-2 text-center",
        good !== false
          ? "border-emerald-500/35 bg-emerald-50/90 dark:border-emerald-500/25 dark:bg-emerald-950/35"
          : "border-amber-500/35 bg-amber-50/90 dark:border-amber-500/25 dark:bg-amber-950/35"
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
        {label}
      </span>
      <span className="mt-0.5 text-lg font-bold tabular-nums text-gray-900 dark:text-white">{score}</span>
    </div>
  );
}

/** Lighthouse-style quality targets aligned with how we ship the marketing site. */
export function MarketingLighthousePanel() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700 dark:text-sky-400">
          Lighthouse &amp; Core Web Vitals
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">
          Targets we build toward (example readout)
        </p>
        <p className="mt-1 max-w-xl text-xs text-gray-600 dark:text-neutral-400">
          Real scores vary by page and deploy. This tab reflects the bar we optimize for: fast LCP, low
          interaction delay, stable layout, and clean audits.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <ScorePill label="Performance" score={97} />
        <ScorePill label="Accessibility" score={100} />
        <ScorePill label="Best practices" score={100} />
        <ScorePill label="SEO" score={100} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DemoStatCard label="LCP (Largest Contentful Paint)" value="1.1s" hint={"Target < 2.5s"} />
        <DemoStatCard label="INP (Interaction to Next Paint)" value="108 ms" hint={"Target < 200 ms"} />
        <DemoStatCard label="CLS (Cumulative Layout Shift)" value="0.02" hint={"Target < 0.1"} />
      </div>

      <div className="rounded-xl border border-gray-400/30 bg-white/50 p-3 text-xs text-gray-700 dark:border-neutral-600/35 dark:bg-neutral-900/50 dark:text-neutral-300">
        <p className="font-semibold text-gray-900 dark:text-white">Build practices in play</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-[11px] leading-relaxed">
          <li>Code-splitting for below-the-fold and non-critical UI</li>
          <li>Deferred third-party scripts (analytics after load)</li>
          <li>Font subsetting and fewer blocking resources on landing</li>
          <li>Image optimization and stable dimensions where it matters for CLS</li>
        </ul>
      </div>
    </div>
  );
}

const DEMO_DAILY = [
  { day: "04-01", count: 1420 },
  { day: "04-02", count: 1580 },
  { day: "04-03", count: 1390 },
  { day: "04-04", count: 1710 },
  { day: "04-05", count: 1890 },
  { day: "04-06", count: 2100 },
  { day: "04-07", count: 2240 },
];

/** Mirrors CEO analytics layout with aspirational demo numbers (not live data). */
export function MarketingAnalyticsDemoPanel() {
  const maxD = Math.max(...DEMO_DAILY.map((d) => d.count), 1);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-neutral-200">
            First-party analytics
          </p>
          <p className="mt-1 max-w-xl text-xs text-gray-600 dark:text-neutral-400">
            Example projection — same views as your live dashboard: traffic, depth, inquiries, and sources.
          </p>
        </div>
        <span className="rounded-full border border-sky-500/40 bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-900 dark:border-sky-500/30 dark:bg-sky-950/50 dark:text-sky-200">
          Last 30 days (demo)
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <DemoStatCard label="Pageviews" value="48,200" />
        <DemoStatCard
          label="Contact / inquiry submissions"
          value="312"
          hint="Successful sends from your site forms"
        />
        <DemoStatCard label="Unique sessions" value="12,400" />
        <DemoStatCard label="Unique visitors" value="9,800" />
        <DemoStatCard
          label="Sessions with 2+ pages"
          value="6,100"
          hint="Browse depth (pageviews only)"
        />
        <DemoStatCard
          label="Sessions touching contact or inquiry"
          value="2,400"
          hint="/contact views or form submit"
        />
      </div>

      <div className="rounded-xl border border-gray-400/30 bg-white/40 p-3 dark:border-neutral-600/35 dark:bg-neutral-900/40">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">
          Pageviews by day (demo)
        </p>
        <div className="mt-3 flex h-28 items-end gap-1 sm:h-32">
          {DEMO_DAILY.map((d) => (
            <div key={d.day} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <div
                className="w-full max-w-[24px] rounded-t bg-sky-600/85 dark:bg-sky-500/80"
                style={{ height: `${Math.max(8, (d.count / maxD) * 100)}px` }}
              />
              <span className="max-w-full truncate text-[9px] text-gray-600 dark:text-neutral-500">
                {d.day.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <DemoRowList
          title="Top paths"
          rows={[
            { left: "/", count: 18200 },
            { left: "/growth-system", count: 6240 },
            { left: "/contact", count: 4180 },
            { left: "/services", count: 3950 },
            { left: "/book-call", count: 2120 },
          ]}
        />
        <DemoRowList
          title="Top referrers"
          rows={[
            { left: "google / organic", count: 21400 },
            { left: "direct / none", count: 12100 },
            { left: "linkedin.com", count: 4200 },
            { left: "bing / organic", count: 3100 },
            { left: "facebook.com", count: 1800 },
          ]}
        />
        <DemoRowList
          title="UTM sources"
          rows={[
            { left: "google", count: 8900 },
            { left: "newsletter", count: 2400 },
            { left: "meta", count: 1900 },
            { left: "partner", count: 1100 },
          ]}
        />
      </div>

      <DemoRowList
        title="Custom events (by type)"
        rows={[
          { left: "cta_click", count: 8420 },
          { left: "pricing_plan_click", count: 2960 },
          { left: "form_start", count: 1880 },
          { left: "calendar_booking_click", count: 940 },
          { left: "chat_open", count: 720 },
          { left: "call_click", count: 510 },
        ]}
      />
    </div>
  );
}

function FunnelCard({
  name,
  hypothesis,
  stages,
  analytics,
}: {
  name: string;
  hypothesis: string;
  stages: { label: string; count: number }[];
  analytics: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl border border-gray-400/40 bg-gray-300/15 p-3 shadow-inner dark:border-neutral-600/45 dark:bg-neutral-800/40 sm:p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700 dark:text-sky-400">
        {name}
      </p>
      <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">{hypothesis}</p>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-500">
        Funnel stages
      </p>
      <ul className="mt-2 space-y-1 text-[12px]">
        {stages.map((s, i) => (
          <li key={i} className="flex justify-between gap-2 border-b border-gray-400/10 pb-1 dark:border-neutral-600/20">
            <span className="text-gray-800 dark:text-neutral-200">{s.label}</span>
            <span className="tabular-nums text-gray-700 dark:text-neutral-300">{s.count.toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-500">
        Traffic snapshot (same metrics, funnel-scoped)
      </p>
      <ul className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
        {analytics.map((a, i) => (
          <li
            key={i}
            className="rounded-lg border border-gray-400/25 bg-white/50 px-2 py-1.5 dark:border-neutral-600/30 dark:bg-neutral-900/50"
          >
            <span className="block text-gray-500 dark:text-neutral-500">{a.label}</span>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-white">{a.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingFunnelsDemoPanel() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200">Funnel experiments</p>
        <p className="mt-1 max-w-2xl text-xs text-gray-600 dark:text-neutral-400">
          Three live-style tests: each funnel tracks the same core analytics (sessions, depth, CTAs, bookings)
          so you can compare variants without mixing traffic.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <FunnelCard
          name="Funnel A · Growth System headline test"
          hypothesis="Variant A emphasizes speed to lead; B emphasizes ROI — split 50/50 on /growth-system."
          stages={[
            { label: "Landing pageviews", count: 18400 },
            { label: "Scroll to pricing", count: 9200 },
            { label: "CTA clicks (plan / book)", count: 3100 },
            { label: "Book-a-call completed", count: 412 },
          ]}
          analytics={[
            { label: "Sessions", value: "6,420" },
            { label: "2+ page sessions", value: "2,890" },
            { label: "Inquiries", value: "86" },
            { label: "Custom: pricing_plan_click", value: "1,240" },
          ]}
        />
        <FunnelCard
          name="Funnel B · Paid search → contact"
          hypothesis="Google Ads to dedicated landing; measure form starts vs submits vs SMS follow-up."
          stages={[
            { label: "Ad landing views", count: 12200 },
            { label: "Form started", count: 2180 },
            { label: "Form submitted", count: 640 },
            { label: "Qualified (manual review)", count: 198 },
          ]}
          analytics={[
            { label: "Sessions", value: "9,100" },
            { label: "2+ page sessions", value: "1,450" },
            { label: "Inquiries", value: "640" },
            { label: "Custom: form_start", value: "2,180" },
          ]}
        />
        <FunnelCard
          name="Funnel C · Blog → nurture → consult"
          hypothesis="Longer path: content first, email capture, then consult request — lower volume, higher intent."
          stages={[
            { label: "Article pageviews", count: 8400 },
            { label: "Newsletter / lead magnet", count: 1120 },
            { label: "Nurture sequence open", count: 780 },
            { label: "Consult requests", count: 94 },
          ]}
          analytics={[
            { label: "Sessions", value: "3,200" },
            { label: "2+ page sessions", value: "1,890" },
            { label: "Inquiries", value: "124" },
            { label: "Custom: cta_click", value: "2,010" },
          ]}
        />
      </div>
    </div>
  );
}

function AgentCard({
  title,
  schedule,
  bullets,
}: {
  title: string;
  schedule?: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-2xl border border-gray-400/40 bg-gradient-to-b from-white/80 to-gray-100/40 p-3 dark:border-neutral-600/45 dark:from-neutral-900/80 dark:to-neutral-950/60 sm:p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-700 dark:text-violet-400">
        AI agent
      </p>
      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
      {schedule ? (
        <p className="mt-1 text-[11px] font-medium text-sky-700 dark:text-sky-400">{schedule}</p>
      ) : null}
      <ul className="mt-3 list-inside list-disc space-y-1.5 text-[12px] text-gray-700 dark:text-neutral-300">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingAiAgentsDemoPanel() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200">AI agents on a rhythm</p>
        <p className="mt-1 max-w-2xl text-xs text-gray-600 dark:text-neutral-400">
          Illustrative automation lanes — outbound research, pipeline personalization, and ops/CX monitoring.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <AgentCard
          title="Outbound research & market intel"
          schedule="Scheduled · e.g. 7:00 AM daily"
          bullets={[
            "Google / web discovery pass for new prospects in target verticals and service areas.",
            "Secondary run: ranking & SERP spot-checks on priority keywords (alerts on big moves).",
            "Outputs structured lead candidates into your pipeline for review or auto-enrichment.",
          ]}
        />
        <AgentCard
          title="Lead nurture &amp; 1:1 outreach"
          bullets={[
            "Takes qualified leads and drafts personalized cold email sequences in your voice.",
            "Pairs with SMS follow-ups where appropriate (compliance-aware templates).",
            "Handoff hooks: calendar links, reply detection, and CRM field updates.",
          ]}
        />
        <AgentCard
          title="Dashboard monitoring &amp; customer service"
          bullets={[
            "Watches dashboards and key metrics; flags anomalies (traffic drops, form errors, booking gaps).",
            "Customer service email triage: categorize, draft replies, and escalate when needed.",
            "Post-touch follow-ups to keep response times tight without living in the inbox.",
          ]}
        />
      </div>
    </div>
  );
}
