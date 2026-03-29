"use client";

import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShootingStarsBackground } from "@/components/ui/shooting-stars-background";

const STEPS = [
  {
    n: "01",
    title: "We audit your current presence",
    body: "We analyze your website, local SEO, and existing lead flow to identify the gaps costing you customers right now.",
  },
  {
    n: "02",
    title: "We build your growth system",
    body: "Custom website + lead funnel designed around your business goals, target customer, and local market — built fast.",
  },
  {
    n: "03",
    title: "AI agents take over lead tracking",
    body: "Our AI monitors every lead, scores their intent, automates follow-ups, and flags hot prospects to your team in real time.",
  },
  {
    n: "04",
    title: "You close. We keep optimizing.",
    body: "We continuously refine your funnel based on real conversion data. The system gets smarter — and more profitable — over time.",
  },
] as const;

const FUNNEL_ROWS = [
  {
    label: "Website Visitors",
    value: 4820,
    pct: 100,
    barClass:
      "bg-gradient-to-r from-sky-500 to-violet-500 dark:from-sky-400 dark:to-violet-400",
  },
  {
    label: "Page Engagements",
    value: 3567,
    pct: 74,
    barClass:
      "bg-gradient-to-r from-violet-500 to-sky-500 dark:from-violet-400 dark:to-sky-400",
  },
  {
    label: "Leads Captured",
    value: 1831,
    pct: 38,
    barClass:
      "bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-400 dark:to-teal-400",
  },
  {
    label: "Qualified by AI",
    value: 1061,
    pct: 22,
    barClass:
      "bg-gradient-to-r from-violet-600 to-purple-500 dark:from-violet-500 dark:to-purple-400",
  },
  {
    label: "Converted",
    value: 482,
    pct: 10,
    barClass:
      "bg-gradient-to-r from-emerald-500 to-green-400 dark:from-emerald-400 dark:to-green-400",
  },
] as const;

export function Process() {
  return (
    <section
      id="process"
      className="relative isolate w-full overflow-hidden bg-neutral-50 py-20 md:py-24 dark:bg-neutral-900"
    >
      <ShootingStarsBackground />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6">
        <h2 className="mb-14 max-w-4xl text-2xl font-bold tracking-tight text-neutral-900 md:mb-16 md:text-4xl dark:text-neutral-100">
          From first click to closed deal – automated.
        </h2>

        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Timeline */}
          <div className="relative pl-1">
            <div
              className="absolute left-[1.125rem] top-3 bottom-3 w-px bg-neutral-200 dark:bg-neutral-700"
              aria-hidden
            />
            <ul className="relative space-y-10 md:space-y-12">
              {STEPS.map((step) => (
                <li key={step.n} className="relative flex gap-5 md:gap-6">
                  <span
                    className={cn(
                      "relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold tabular-nums md:h-10 md:w-10",
                      "border-sky-300/80 bg-neutral-50 text-sky-700",
                      "dark:border-sky-500/40 dark:bg-neutral-900 dark:text-sky-300"
                    )}
                  >
                    {step.n}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Funnel card */}
          <div className="lg:sticky lg:top-28">
            <div className="rounded-2xl bg-gradient-to-r from-sky-400/50 via-violet-400/40 to-purple-500/45 p-px dark:from-sky-500/35 dark:via-violet-500/30 dark:to-purple-500/40">
              <div className="rounded-[15px] bg-white p-6 shadow-sm dark:bg-neutral-950">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                      "border-sky-400/50 bg-sky-50 text-sky-800",
                      "dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200"
                    )}
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-500 opacity-40 dark:bg-sky-400" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-600 dark:bg-sky-400" />
                    </span>
                    Live
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Your Lead Funnel — This Month
                </h3>

                <div className="mt-6 space-y-5">
                  {FUNNEL_ROWS.map((row) => (
                    <div key={row.label}>
                      <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                          {row.label}
                        </span>
                        <span className="tabular-nums text-neutral-900 dark:text-neutral-100">
                          {row.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            row.barClass
                          )}
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                    <Bot className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    AI identified{" "}
                    <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                      127 high-intent leads
                    </strong>{" "}
                    and auto-sent personalized follow-ups within 90 seconds of
                    form submission. Conversion rate:{" "}
                    <strong className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +34% this week.
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
