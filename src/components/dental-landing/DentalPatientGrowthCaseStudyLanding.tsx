"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { DENTAL_PATIENT_GROWTH_CASE_STUDY_FAQ } from "@/content/dental-patient-growth-case-study-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const AUDIT_LP_HREF = "/free-patient-flow-audit";

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta });
}

function SecondarySystemCta({ placement, className }: { placement: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        trackCta(placement, "see_how_system_works");
        document.getElementById("what-we-built")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-center text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900",
        className
      )}
    >
      See How the System Works
    </button>
  );
}

export function DentalPatientGrowthCaseStudyLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-neutral-50 to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-900 dark:text-emerald-400">
            Trust funnel · Patient growth case study · Central US dental practices
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            From Website Traffic to Booked Patients
            <span className="mt-2 block text-2xl sm:mt-3 sm:text-3xl lg:text-4xl">
              How One Dental Practice Fixed Their Patient Acquisition System
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            This practice wasn&apos;t struggling with visibility. They were struggling with conversion. Weak messaging,
            poor follow-up, and hidden booking friction were quietly costing them patients every month. Then we fixed the
            system.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            More traffic wasn&apos;t the answer. Better conversion was.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={AUDIT_LP_HREF}
                  onClick={() => trackCta("case_study_hero", "free_patient_flow_audit")}
                  className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-center text-base font-semibold text-white shadow-sm transition hover:bg-neutral-800 sm:text-lg dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
                >
                  Get My Free Patient Flow Audit
                </Link>
              </div>
              <div className="min-w-0 flex-1">
                <SecondarySystemCta placement="case_study_hero" />
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-lg text-center text-[11px] font-medium text-neutral-500 dark:text-neutral-400 sm:text-xs">
              Real strategy · Real systems · Built for dental practices
            </p>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-left text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-center">
            Composite case: anonymized patterns from Central US dental work—illustrative, not a guarantee for your
            practice. Your audit is specific to your assets and market.
          </p>
        </div>
      </section>

      <section id="before" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            The Problem Before
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            A multi-provider general dentistry group in the Central US had steady website traffic and a recognizable
            brand—but new patient flow felt inconsistent. Leadership suspected marketing, but the dashboards looked
            &quot;fine.&quot;
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Website looked dated next to newer competitors in the same ZIP.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Poor mobile conversion—high bounce on service pages after hours.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Weak trust signals: unclear proof, weak &quot;what happens next,&quot; buried phone.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>No dedicated landing pages for high-intent procedures (implants, cosmetic consults).</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Google Business Profile presence underperformed vs competitors on calls and direction requests.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Lead capture created friction; inquiries sometimes never reached the right owner.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>No follow-up automation—speed-to-lead collapsed nights and weekends.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Too much reliance on referrals while digital intent leaked to competitors.</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="what-was-broken" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What Was Actually Broken
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            The issue wasn&apos;t a lack of raw inquiries. It was leakage: attention existed, but trust, routing, and
            booking friction prevented consistent consults—especially for higher-value treatment interest.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Conversion leaks on mobile paths and key service pages
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Weak patient trust sequencing (proof, clarity, anxiety reduction)
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Local SEO and GBP gaps that capped discovery for high-intent queries
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Booking friction—too many steps, unclear next action, slow callbacks
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Poor lead handling: ownership, notifications, and CRM hygiene
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              No visibility into where opportunities died before the schedule
            </li>
          </ul>
        </div>
      </section>

      <section id="what-we-built" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What We Changed
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            A coordinated system—not a pile of disconnected tactics.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Rebuilt the website around conversion: mobile-first clarity, proof, and one obvious next step per page
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Improved local SEO structure for procedure + city intent and internal linking discipline
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Optimized GBP presence: categories, services, photo discipline, and review rhythm aligned to consult goals
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Built dedicated landing pages for high-intent services with tighter capture
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Lead capture improvements: fewer fields, clearer promise, reliable routing to the right inbox/CRM
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Automated follow-up sequences for after-hours submissions and warm lead nurture
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              CRM visibility: stages, owners, and basic reporting so accountability replaced guessing
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Reduced booking friction: click-to-call prominence, consult CTA clarity, and faster callback standards
            </li>
          </ul>
        </div>
      </section>

      <section id="results" className="border-y border-neutral-200 bg-emerald-50/40 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-emerald-950/15">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What Improved
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Believable outcomes over a multi-quarter window—what leadership actually felt on the schedule and in the
            front office.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Stronger inquiry quality: fewer dead-end chats, more consult-ready requests
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              More booked consultations from the same attention baseline—not from doubling ad spend
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Better front desk visibility: fewer &quot;lost&quot; leads and clearer ownership
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Improved local rankings and GBP-driven calls for core new-patient intent
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              More consistent follow-up after hours—fewer silent drop-offs
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Stronger high-value case flow: implant and cosmetic consult requests became easier to track and convert
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              More predictable patient acquisition: fewer random months, fewer &quot;we do not know why&quot; gaps
            </li>
          </ul>
          <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
            No fabricated multiples. The pattern is repeatable because the system—not a single tactic—changed how
            patients moved from interest to booked care.
          </p>
        </div>
      </section>

      <section id="why-it-worked" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            The Strategy Wasn&apos;t More Marketing
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">It Was Better Systems</p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Most agencies try to buy growth with more traffic and more campaigns. This engagement engineered growth by
            fixing the parts of patient flow that determine whether attention becomes production.
          </p>
          <p className="mt-6 text-base font-medium text-neutral-900 dark:text-white">
            By fixing trust, conversion, follow-up, patient flow, and booking friction—improvements become repeatable
            instead of one-off wins buried in a monthly report.
          </p>
        </div>
      </section>

      <section id="trust" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Magic Tricks. No Vanity Metrics. Just Better Patient Flow.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent strategy</strong> — priorities tied to
              consults and booked patients, not busywork.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Real patient acquisition focus</strong> — systems that
              your team can run weekly.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No fake promises</strong> — no guaranteed rankings;
              clear diagnosis and sequencing instead.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Built specifically for dentists</strong> — Central US
              competition, procedure intent, and scheduling reality.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Financial logic first</strong> — leakage framed as
              production risk, not vanity charts.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No bloated retainers</strong> — fit and leverage
              before scale.
            </li>
          </ul>
        </div>
      </section>

      <section id="audit-cta" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Your Practice Probably Has Similar Revenue Leaks
          </h2>
          <p className="mt-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            The fastest way to find them: the Free Patient Flow Audit™
          </p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            The audit identifies where patients slip away before they book—so you fix leverage first instead of buying
            more attention into a broken path.
          </p>
          <ul className="mt-8 space-y-2 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-sky-700 dark:text-sky-400">→</span>
              Missed patient opportunities and conversion weak points
            </li>
            <li className="flex gap-2">
              <span className="text-sky-700 dark:text-sky-400">→</span>
              Follow-up failures and routing gaps
            </li>
            <li className="flex gap-2">
              <span className="text-sky-700 dark:text-sky-400">→</span>
              Local SEO and GBP visibility gaps vs competitors
            </li>
            <li className="flex gap-2">
              <span className="text-sky-700 dark:text-sky-400">→</span>
              Highest-leverage improvements first—practical sequencing, not a laundry list
            </li>
          </ul>
          <div className="mx-auto mt-10 max-w-md">
            <Link
              href={AUDIT_LP_HREF}
              onClick={() => trackCta("case_study_audit_block", "free_patient_flow_audit")}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 sm:text-base"
            >
              Get My Free Patient Flow Audit
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Dental marketing case study, patient growth, SEO results, and acquisition outcomes for Nebraska, Iowa,
            Kansas, Missouri, South Dakota, and nearby Central US markets.
          </p>
          <dl className="mt-10 space-y-10">
            {DENTAL_PATIENT_GROWTH_CASE_STUDY_FAQ.map((item) => (
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
            Better Patient Flow Starts With Better Systems
          </h2>
          <div className="mx-auto mt-8 max-w-md">
            <Link
              href={AUDIT_LP_HREF}
              onClick={() => trackCta("case_study_final", "free_patient_flow_audit")}
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
        aria-label="Case study actions"
      >
        <button
          type="button"
          onClick={() => {
            trackCta("case_study_sticky", "see_how_system_works");
            document.getElementById("what-we-built")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="flex-1 rounded-lg border border-neutral-300 bg-white py-3 text-xs font-semibold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
        >
          System
        </button>
        <Link
          href={AUDIT_LP_HREF}
          onClick={() => trackCta("case_study_sticky", "free_patient_flow_audit")}
          className="btn-primary flex flex-[1.3] items-center justify-center rounded-lg py-3 text-center text-xs font-bold"
        >
          Free audit
        </Link>
      </div>
      <div className="h-14 md:hidden" aria-hidden />
    </div>
  );
}
