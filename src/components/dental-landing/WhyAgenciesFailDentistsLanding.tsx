"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { WHY_AGENCIES_FAIL_DENTISTS_FAQ } from "@/content/why-agencies-fail-dentists-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const AUDIT_LP_HREF = "/free-patient-flow-audit";

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta });
}

function SecondaryScrollCta({ placement, className }: { placement: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        trackCta(placement, "see_what_agencies_miss");
        document.getElementById("what-agencies-miss")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-center text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900",
        className
      )}
    >
      See What Most Agencies Miss
    </button>
  );
}

export function WhyAgenciesFailDentistsLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-slate-50 to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-400">
            Trust funnel · Central US dental practices
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            Most Marketing Agencies Don&apos;t Fail Because They&apos;re Bad
            <span className="mt-2 block sm:mt-3">They Fail Because They Don&apos;t Understand Dentistry</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            Pretty websites, ranking reports, and &quot;more leads&quot; mean nothing if patients don&apos;t trust,
            convert, and book. Most agencies stop at traffic. We focus on patient acquisition.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Booked patients &gt; marketing activity
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={AUDIT_LP_HREF}
                  onClick={() => trackCta("agency_fail_hero", "free_patient_flow_audit")}
                  className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-center text-base font-semibold text-white shadow-sm transition hover:bg-neutral-800 sm:text-lg dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
                >
                  Get My Free Patient Flow Audit
                </Link>
              </div>
              <div className="min-w-0 flex-1">
                <SecondaryScrollCta placement="agency_fail_hero" />
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-lg text-center text-[11px] font-medium text-neutral-500 dark:text-neutral-400 sm:text-xs">
              No contracts · No vague retainers · Built for dental practices only
            </p>
          </div>
        </div>
      </section>

      <section id="the-real-problem" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Agencies Sell Activity
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">Not Outcomes</p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            If you have been marketed to before, this rhythm will feel familiar: busy monthly updates, charts that look
            productive, and a calendar that still does not feel predictable.
          </p>
          <ul className="mt-8 space-y-2 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-neutral-400" aria-hidden>
                —
              </span>
              Monthly reports that celebrate motion
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400" aria-hidden>
                —
              </span>
              SEO screenshots disconnected from consult volume
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400" aria-hidden>
                —
              </span>
              Traffic charts that do not tie to booked new patients
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400" aria-hidden>
                —
              </span>
              Redesign cycles that reset momentum without fixing follow-up
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400" aria-hidden>
                —
              </span>
              Ads dashboards that rise while show rates and case value do not
            </li>
          </ul>
          <p className="mt-8 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            And still: patient flow feels inconsistent, high-value cases feel random, front desk follow-up breaks, and
            real revenue does not improve the way you expect from the spend.
          </p>
          <p className="mt-6 text-lg font-semibold text-neutral-900 dark:text-white">
            Because activity isn&apos;t growth. It is the easiest thing to sell—and the easiest thing to hide behind.
          </p>
        </div>
      </section>

      <section
        id="what-agencies-miss"
        className="scroll-mt-28 border-y border-neutral-200 bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What Most Agencies Ignore
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            These are the patient acquisition realities that determine whether marketing turns into production. When
            they are skipped, &quot;more leads&quot; often means more noise.
          </p>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {[
              "Patient trust signals",
              "Booking friction",
              "Front desk follow-up",
              "Local intent conversion",
              "Landing page psychology",
              "Google Business Profile optimization",
              "High-value procedure pages",
              "Lead qualification systems",
              "CRM visibility",
              "Patient acquisition economics",
            ].map((item) => (
              <li
                key={item}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg font-semibold text-neutral-900 dark:text-white">
            If nobody looked here, it is not a mystery why growth felt busy but unreliable.
          </p>
        </div>
      </section>

      <section id="dentists-frustrated" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            More Leads Doesn&apos;t Mean More Patients
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Many agencies celebrate inputs you can screenshot: traffic, clicks, even raw form fills. Those can matter,
            but they are not substitutes for the outcomes that pay payroll: qualified patients, consults that show,
            case acceptance on the right procedures, and booked appointments that match intent.
          </p>
          <p className="mt-6 text-lg font-semibold text-neutral-900 dark:text-white">
            We optimize for revenue and booked patients—not dashboard theater.
          </p>
        </div>
      </section>

      <section id="how-were-different" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            We Build Patient Acquisition Systems
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">Not Marketing Campaigns</p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            A campaign ends. A system compounds. We focus on the infrastructure that turns attention into booked care:
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Conversion-first websites and pages patients actually use on mobile
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Dedicated patient funnels for high-intent procedures
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Lead capture systems your team can trust
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Automated follow-up that protects speed-to-lead
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              CRM visibility so accountability replaces guessing
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Local SEO and GBP strength tied to real patient discovery
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Outcomes measured by booked patients—not vanity metrics
            </li>
          </ul>
        </div>
      </section>

      <section id="trust" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Agency Theater. No Vanity Metrics. No Guessing.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">No fake lead promises</strong> — we do not sell
              guaranteed rankings or magic volume.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No bloated retainers</strong> — clarity first, fit
              second, execution third.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No generic strategy decks</strong> — dental patient
              behavior and Central US competition are the baseline.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Clear financial logic</strong> — leakage framed in
              production reality, not buzzwords.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent recommendations</strong> — prioritized
              fixes you can act on—even if you do not hire us for all of it.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Dental-specific systems only</strong> — not
              repurposed local-SMB playbooks.
            </li>
          </ul>
        </div>
      </section>

      <section id="patient-flow-audit" className="border-y border-neutral-200 bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            The Fastest Way to See What&apos;s Actually Broken
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            The Patient Flow Audit™ is the low-risk next step after a bad agency experience: a structured diagnosis
            before you spend more on traffic, redesigns, or another retainer.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-sky-700 dark:text-sky-400">→</span>
              Revenue leaks and where they show up in the patient journey
            </li>
            <li className="flex gap-2">
              <span className="text-sky-700 dark:text-sky-400">→</span>
              Conversion bottlenecks on mobile and high-intent pages
            </li>
            <li className="flex gap-2">
              <span className="text-sky-700 dark:text-sky-400">→</span>
              Missed patient opportunities in capture and routing
            </li>
            <li className="flex gap-2">
              <span className="text-sky-700 dark:text-sky-400">→</span>
              Weak local visibility and GBP gaps vs competitors
            </li>
            <li className="flex gap-2">
              <span className="text-sky-700 dark:text-sky-400">→</span>
              Booking friction that kills consults
            </li>
            <li className="flex gap-2">
              <span className="text-sky-700 dark:text-sky-400">→</span>
              Follow-up failures that erase intent after hours
            </li>
          </ul>
          <div className="mx-auto mt-10 max-w-md">
            <Link
              href={AUDIT_LP_HREF}
              onClick={() => trackCta("agency_fail_audit_section", "free_patient_flow_audit")}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 sm:text-base"
            >
              Get My Free Patient Flow Audit
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Dental marketing agency failure, patient acquisition, and growth partner questions for Nebraska, Iowa,
            Kansas, Missouri, South Dakota, and nearby Central US markets.
          </p>
          <dl className="mt-10 space-y-10">
            {WHY_AGENCIES_FAIL_DENTISTS_FAQ.map((item) => (
              <div key={item.q}>
                <dt className="text-lg font-semibold text-neutral-900 dark:text-white">{item.q}</dt>
                <dd className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="final-cta"
        className="border-t border-neutral-200 bg-neutral-900 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-black"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            You Don&apos;t Need Another Agency
            <span className="mt-2 block text-lg font-medium text-neutral-300 sm:text-xl">You Need the Right System</span>
          </h2>
          <div className="mx-auto mt-8 max-w-md">
            <Link
              href={AUDIT_LP_HREF}
              onClick={() => trackCta("agency_fail_final", "free_patient_flow_audit")}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 sm:text-base"
            >
              Get My Free Patient Flow Audit
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
              No pressure · No contracts · Built for Central US dental practices · Focused on booked patients
            </p>
          </div>
        </div>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-950/95"
        role="region"
        aria-label="Trust funnel actions"
      >
        <button
          type="button"
          onClick={() => {
            trackCta("agency_fail_sticky", "see_what_agencies_miss");
            document.getElementById("what-agencies-miss")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="flex-1 rounded-lg border border-neutral-300 bg-white py-3 text-xs font-semibold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
        >
          What they miss
        </button>
        <Link
          href={AUDIT_LP_HREF}
          onClick={() => trackCta("agency_fail_sticky", "free_patient_flow_audit")}
          className="btn-primary flex flex-[1.3] items-center justify-center rounded-lg py-3 text-center text-xs font-bold"
        >
          Free audit
        </Link>
      </div>
      <div className="h-14 md:hidden" aria-hidden />
    </div>
  );
}
