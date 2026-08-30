"use client";

import Link from "next/link";
import type { CommandCenterGoalProgress, CommandCenterSnapshot } from "@/lib/os/command-center-types";
import { formatOsCurrency } from "@/lib/os/format-os-currency";
import { cn } from "@/lib/utils";

type Props = {
  snapshot: CommandCenterSnapshot;
};

function healthStyles(label: CommandCenterSnapshot["healthLabel"]) {
  if (label === "Strong") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200";
  }
  if (label === "Steady") {
    return "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200";
  }
  return "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200";
}

function GoalBar({
  goal,
  brandColor,
  currency,
}: {
  goal: CommandCenterGoalProgress;
  brandColor: string;
  currency: string;
}) {
  const currentLabel =
    goal.unit === "currency"
      ? formatOsCurrency(goal.current, currency)
      : goal.unit === "percent"
        ? `${goal.current}%`
        : String(goal.current);
  const targetLabel =
    goal.unit === "currency"
      ? formatOsCurrency(goal.target, currency)
      : goal.unit === "percent"
        ? `${goal.target}%`
        : String(goal.target);

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium text-neutral-800 dark:text-neutral-200">{goal.label}</span>
        <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
          {currentLabel} / {targetLabel}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${goal.progress}%`, backgroundColor: brandColor }}
        />
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  href,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {title}
          </h2>
          {subtitle ? <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-500">{subtitle}</p> : null}
        </div>
        {href ? (
          <Link href={href} className="text-xs font-medium text-neutral-600 hover:underline dark:text-neutral-400">
            Open →
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function SparkBars({ rows, brandColor }: { rows: { day: string; count: number }[]; brandColor: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  const last14 = rows.slice(-14);
  if (last14.length === 0) {
    return <p className="text-sm text-neutral-500">No traffic data yet.</p>;
  }
  return (
    <div className="flex h-16 items-end gap-1">
      {last14.map((r) => (
        <div
          key={r.day}
          title={`${r.day}: ${r.count}`}
          className="min-w-0 flex-1 rounded-t-sm opacity-90"
          style={{
            height: `${Math.max(8, (r.count / max) * 100)}%`,
            backgroundColor: brandColor,
          }}
        />
      ))}
    </div>
  );
}

export function CommandCenterClient({ snapshot }: Props) {
  const {
    brandColor,
    currency,
    healthLabel,
    healthSummary,
    todayYmd,
    timeZone,
    todayActions,
    kpis,
    shortTermGoals,
    longTermGoals,
    traffic,
    pipeline,
    projectStages,
    followUpBlock,
    todayMeetings,
    recentActivity,
    isInternal,
  } = snapshot;

  const pipelineMax = Math.max(1, ...pipeline.map((p) => p.count));
  const formattedDate = new Date(`${todayYmd}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  });

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Command center
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Business health
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{formattedDate}</p>
        </div>
        <div
          className={cn(
            "max-w-md rounded-xl border px-4 py-3 text-sm",
            healthStyles(healthLabel)
          )}
        >
          <p className="font-semibold">{healthLabel}</p>
          <p className="mt-0.5 text-xs opacity-90">{healthSummary}</p>
        </div>
      </header>

      {isInternal ? (
        <>
          <SectionCard title="Today" subtitle="What needs your attention right now">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {todayActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={cn(
                    "group rounded-lg border p-4 transition hover:shadow-md",
                    action.urgent
                      ? "border-red-200 bg-red-50/80 dark:border-red-900/50 dark:bg-red-950/30"
                      : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:border-neutral-700"
                  )}
                >
                  <p className="font-semibold text-neutral-900 group-hover:underline dark:text-white">
                    {action.label}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{action.detail}</p>
                </Link>
              ))}
            </div>
            {(followUpBlock || todayMeetings.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-4 border-t border-neutral-100 pt-4 text-sm dark:border-neutral-800">
                {followUpBlock ? (
                  <div>
                    <span className="text-neutral-500">Calendar block · </span>
                    <Link href="/dashboard/calendar" className="font-medium hover:underline" style={{ color: brandColor }}>
                      {followUpBlock.title}
                    </Link>
                  </div>
                ) : null}
                {todayMeetings.map((m) => (
                  <div key={`${m.time}-${m.title}`}>
                    <span className="text-neutral-500">{m.time} · </span>
                    <Link href={m.href} className="font-medium hover:underline">
                      {m.title}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              KPIs
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((kpi) => (
                <Link
                  key={kpi.key}
                  href={kpi.href ?? "#"}
                  className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-neutral-300 hover:shadow dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-neutral-900 dark:text-white">
                    {kpi.value}
                  </p>
                  {kpi.hint ? (
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">{kpi.hint}</p>
                  ) : null}
                  {kpi.delta ? (
                    <p
                      className={cn(
                        "mt-1 text-xs",
                        kpi.deltaUp === false ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"
                      )}
                    >
                      {kpi.delta}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Short-term goals" subtitle="This month & quarter">
              <div className="space-y-4">
                {shortTermGoals.map((g) => (
                  <GoalBar key={g.key} goal={g} brandColor={brandColor} currency={currency} />
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Long-term goals" subtitle="Year & growth targets">
              <div className="space-y-4">
                {longTermGoals.map((g) => (
                  <GoalBar key={g.key} goal={g} brandColor={brandColor} currency={currency} />
                ))}
              </div>
            </SectionCard>
          </div>

          {traffic.enabled ? (
            <div className="grid gap-6 lg:grid-cols-3">
              <SectionCard title="Traffic" subtitle={`Last ${traffic.periodDays} days`} href="/dashboard/analytics">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">Pageviews</p>
                    <p className="text-xl font-semibold tabular-nums">{traffic.pageviews.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Visitors</p>
                    <p className="text-xl font-semibold tabular-nums">{traffic.visitors.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Sessions</p>
                    <p className="text-xl font-semibold tabular-nums">{traffic.sessions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Inquiries</p>
                    <p className="text-xl font-semibold tabular-nums">{traffic.inquiries.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-xs text-neutral-500">Daily pageviews</p>
                  <SparkBars rows={traffic.dailyPageviews} brandColor={brandColor} />
                </div>
              </SectionCard>

              <SectionCard title="Where traffic goes" subtitle="Top pages">
                <ul className="space-y-2 text-sm">
                  {traffic.topPaths.slice(0, 8).map((row) => (
                    <li key={row.path} className="flex justify-between gap-2">
                      <span className="truncate font-mono text-xs text-neutral-700 dark:text-neutral-300">
                        {row.path}
                      </span>
                      <span className="shrink-0 tabular-nums text-neutral-500">{row.count}</span>
                    </li>
                  ))}
                  {traffic.topPaths.length === 0 ? (
                    <li className="text-neutral-500">No pageviews recorded.</li>
                  ) : null}
                </ul>
              </SectionCard>

              <SectionCard title="Acquisition" subtitle="Referrers & UTM">
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-medium text-neutral-500">Top referrers</p>
                    <ul className="space-y-1.5 text-sm">
                      {traffic.topReferrers.slice(0, 5).map((r) => (
                        <li key={r.referrer} className="flex justify-between gap-2">
                          <span className="truncate">{r.referrer}</span>
                          <span className="tabular-nums text-neutral-500">{r.count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium text-neutral-500">UTM sources</p>
                    <ul className="space-y-1.5 text-sm">
                      {traffic.topUtmSources.slice(0, 5).map((r) => (
                        <li key={r.source} className="flex justify-between gap-2">
                          <span className="truncate">{r.source}</span>
                          <span className="tabular-nums text-neutral-500">{r.count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {traffic.customEvents.length > 0 ? (
                    <div>
                      <p className="mb-2 text-xs font-medium text-neutral-500">Custom events</p>
                      <ul className="space-y-1.5 text-sm">
                        {traffic.customEvents.slice(0, 5).map((e) => (
                          <li key={e.eventType} className="flex justify-between gap-2">
                            <span className="truncate">{e.eventType}</span>
                            <span className="tabular-nums text-neutral-500">{e.count}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </SectionCard>
            </div>
          ) : null}

          {traffic.enabled ? (
            <SectionCard title="Conversion funnel" subtitle="Visitor journey (30d)">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {[
                  { label: "Visitors", value: traffic.visitors },
                  { label: "Sessions", value: traffic.sessions },
                  { label: "Pageviews", value: traffic.pageviews },
                  { label: "Inquiries", value: traffic.inquiries },
                ].map((step, i, arr) => (
                  <div key={step.label} className="flex flex-1 items-center gap-2">
                    <div className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-center dark:border-neutral-800">
                      <p className="text-xs text-neutral-500">{step.label}</p>
                      <p className="text-lg font-semibold tabular-nums">{step.value.toLocaleString()}</p>
                    </div>
                    {i < arr.length - 1 ? (
                      <span className="hidden text-neutral-300 sm:inline">→</span>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                Inquiry rate: {traffic.conversionRate}% of pageviews · tune goals in Settings when targets are ready.
              </p>
            </SectionCard>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Lead pipeline" subtitle="Active stages" href="/dashboard/leads">
              <div className="space-y-3">
                {pipeline.map((row) => (
                  <div key={row.stage}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{row.stage}</span>
                      <span className="tabular-nums text-neutral-500">{row.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(row.count / pipelineMax) * 100}%`,
                          backgroundColor: brandColor,
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  </div>
                ))}
                {pipeline.length === 0 ? (
                  <p className="text-sm text-neutral-500">No active leads in pipeline.</p>
                ) : null}
              </div>
            </SectionCard>

            <SectionCard title="Delivery" subtitle="Projects by stage" href="/dashboard/projects">
              <div className="flex flex-wrap gap-2">
                {projectStages
                  .filter((p) => p.count > 0)
                  .map((p) => (
                    <span
                      key={p.stage}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-sm dark:border-neutral-700"
                    >
                      {p.stage}
                      <span className="font-semibold tabular-nums" style={{ color: brandColor }}>
                        {p.count}
                      </span>
                    </span>
                  ))}
                {projectStages.every((p) => p.count === 0) ? (
                  <p className="text-sm text-neutral-500">No projects yet.</p>
                ) : null}
              </div>
            </SectionCard>
          </div>

          {recentActivity.length > 0 ? (
            <SectionCard title="Recent activity" subtitle="Latest OS events">
              <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {recentActivity.map((a) => (
                  <li key={a.id} className="flex flex-col gap-0.5 py-2.5 text-sm first:pt-0 last:pb-0 sm:flex-row sm:justify-between">
                    <div>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">{a.action}</span>
                      {a.message ? (
                        <span className="text-neutral-600 dark:text-neutral-400"> — {a.message}</span>
                      ) : null}
                    </div>
                    <time className="shrink-0 text-xs text-neutral-500">
                      {new Date(a.created_at).toLocaleString(undefined, { timeZone })}
                    </time>
                  </li>
                ))}
              </ul>
            </SectionCard>
          ) : null}
        </>
      ) : (
        <SectionCard title="Your workspace" subtitle="Projects and calendar">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Use Projects and Calendar from the sidebar for your active work. Internal command center metrics are for the
            N-Tech team.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/dashboard/projects"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: brandColor }}
            >
              Projects
            </Link>
            <Link
              href="/dashboard/calendar"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold dark:border-neutral-600"
            >
              Calendar
            </Link>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
