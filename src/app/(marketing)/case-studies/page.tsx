import type { Metadata } from "next";
import { ScheduleCtaLink } from "@/components/scheduling/ScheduleCtaLink";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const caseStudiesDesc =
  "N-Tech is onboarding its first five case-study clients now. Results — call volume recovered, leads followed up, reviews earned — will be published here as they land.";

export const metadata: Metadata = {
  title: "Case Studies | N-Tech Digital Solutions",
  description: caseStudiesDesc,
  alternates: { canonical: canonicalUrl("/case-studies") },
  openGraph: ogForPath("/case-studies", "Case Studies | N-Tech Digital Solutions", caseStudiesDesc),
};

const PLACEHOLDER_SLOTS = [1, 2, 3, 4, 5] as const;

export default function CaseStudiesPage() {
  return (
    <MarketingPageShell
      title="Our first five case studies are being written right now."
      subtitle="We're intentionally underpricing the infrastructure system to get honest, verifiable results from five real businesses before raising rates. Here's where those results will live."
      cta="compact"
    >
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/80 p-6 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-950/50 sm:p-8">
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          No results are published yet — the businesses in this first cohort are still mid-rollout. Each
          case study will cover call volume recovered, leads followed up automatically, and reviews
          earned, with real numbers, not projections.
        </p>
        <div className="mt-6">
          <ScheduleCtaLink className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
            Become one of the first five
          </ScheduleCtaLink>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLACEHOLDER_SLOTS.map((slot) => (
          <div
            key={slot}
            className="flex min-h-[160px] flex-col justify-between rounded-2xl border border-neutral-200 bg-white/60 p-5 text-neutral-400 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-neutral-600"
            aria-hidden
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
              Case study {slot}
            </span>
            <span className="text-sm">Results coming soon</span>
          </div>
        ))}
      </div>
    </MarketingPageShell>
  );
}
