"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { NEW_PATIENT_LEAK_FUNNEL_FAQ } from "@/content/new-patient-leak-funnel-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const AUDIT_LP_HREF = "/free-patient-flow-audit";

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta });
}

export function NewPatientLeakFunnelLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-amber-50/60 via-white to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-amber-950/20 dark:via-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900/90 dark:text-amber-400/90">
            Pain → relief funnel · New patient leaks · Central US dental practices
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            Your Practice Probably Isn&apos;t Short on Patients
            <span className="mt-2 block text-2xl sm:mt-3 sm:text-3xl lg:text-4xl">It&apos;s Leaking Them</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            Weak websites, poor follow-up, low local visibility, and hidden booking friction quietly cost dental
            practices new patients every single week. Most owners feel it. Few know exactly where it&apos;s happening.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            More leads won&apos;t fix a broken patient flow system.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={AUDIT_LP_HREF}
                  onClick={() => trackCta("leak_hero", "find_my_new_patient_leaks")}
                  className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-center text-base font-semibold text-white shadow-sm transition hover:bg-neutral-800 sm:text-lg dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
                >
                  Find My New Patient Leaks
                </Link>
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={AUDIT_LP_HREF}
                  onClick={() => trackCta("leak_hero", "get_my_free_patient_flow_audit")}
                  className={cn(
                    "inline-flex h-14 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-center text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 sm:text-lg",
                    "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
                    "dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
                  )}
                >
                  Get My Free Patient Flow Audit
                </Link>
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-lg text-center text-[11px] font-medium text-neutral-500 dark:text-neutral-400 sm:text-xs">
              10-minute review · No pressure · Built for dental practices
            </p>
          </div>
        </div>
      </section>

      <section id="pain" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            It Feels Like Growth Should Be Easier Than This
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Nothing here is dramatic—it&apos;s the quiet friction that makes good teams feel stuck. If this reads like
            your Monday meeting, you are not alone.
          </p>
          <ul className="mt-10 space-y-4 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="border-l-2 border-amber-400/80 pl-4 dark:border-amber-500/60">
              You&apos;re getting traffic… but not enough booked appointments.
            </li>
            <li className="border-l-2 border-amber-400/80 pl-4 dark:border-amber-500/60">
              Patients inquire… then disappear.
            </li>
            <li className="border-l-2 border-amber-400/80 pl-4 dark:border-amber-500/60">
              Your team works hard… but patient flow still feels inconsistent.
            </li>
            <li className="border-l-2 border-amber-400/80 pl-4 dark:border-amber-500/60">
              Competitors seem to grow faster in the same ZIP codes.
            </li>
            <li className="border-l-2 border-amber-400/80 pl-4 dark:border-amber-500/60">
              High-value cases feel random—not something you can plan around.
            </li>
            <li className="border-l-2 border-amber-400/80 pl-4 dark:border-amber-500/60">
              Marketing feels expensive relative to what lands on the schedule.
            </li>
            <li className="border-l-2 border-amber-400/80 pl-4 dark:border-amber-500/60">
              Growth feels harder than it should—like something invisible is working against you.
            </li>
          </ul>
        </div>
      </section>

      <section
        id="where-leaks"
        className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most New Patient Loss Happens Before Anyone Calls
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Patients decide fast—often on a phone, often after hours. If trust, clarity, and next steps are not
            obvious, they choose the practice that makes booking feel effortless.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-neutral-500 dark:text-neutral-500">—</span>
              Outdated websites kill trust before the front desk ever gets a chance
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500 dark:text-neutral-500">—</span>
              Weak forms create friction—extra fields, unclear promises, slow confirmation
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500 dark:text-neutral-500">—</span>
              Poor mobile experience creates drop-off on the pages that matter most
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500 dark:text-neutral-500">—</span>
              Local SEO visibility is weak for the procedures you actually want to grow
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500 dark:text-neutral-500">—</span>
              Google Business Profile signals underperform vs nearby competitors on calls and directions
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500 dark:text-neutral-500">—</span>
              Front desk follow-up is inconsistent—especially nights and weekends
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500 dark:text-neutral-500">—</span>
              No automated nurture—speed-to-lead collapses when your best closer is off the clock
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500 dark:text-neutral-500">—</span>
              Patients choose easier competitors—not always “better” dentists, just a smoother path to a consult
            </li>
          </ul>
        </div>
      </section>

      <section id="cost" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Small Leaks Become Big Revenue Problems
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            You do not need a horror story—just honest math. High-value consults are sensitive to small friction. When
            a few slip per month, the annual line item gets leadership&apos;s attention fast.
          </p>
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/50">
            <ul className="space-y-3 text-base font-medium text-neutral-900 dark:text-white">
              <li className="flex gap-2">
                <span className="text-amber-700 dark:text-amber-400">→</span>
                One missed implant case can represent <span className="font-semibold">$4,500+</span> in production
                opportunity (illustrative—use your own fee structure)
              </li>
              <li className="flex gap-2">
                <span className="text-amber-700 dark:text-amber-400">→</span>
                Two missed high-value patients per month can quietly approach{" "}
                <span className="font-semibold">$100,000+ annually</span>—not because math is “scary,” but because
                compounding is real
              </li>
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Poor conversion does not feel like a line item on a P&amp;L—it shows up as “we were so close” and empty
              chair time. Most practices never calculate it until they map the leaks.
            </p>
          </div>
        </div>
      </section>

      <section
        id="misdiagnose"
        className="border-y border-neutral-200 bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            &ldquo;We Need More Leads&rdquo; Is Usually the Wrong Answer
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            The problem usually isn&apos;t awareness. It&apos;s what happens after attention arrives—when trust,
            clarity, and follow-up either convert intent into a booked consult… or don&apos;t.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Conversion: pages, proof, and next steps aligned to how patients actually decide
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Trust: anxiety reduction, credibility, and clear expectations before the phone rings
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Follow-up: ownership, speed, and consistency when it matters most
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Booking friction: fewer steps, clearer CTAs, faster callbacks
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Local visibility: the queries and map behaviors that drive real consult intent
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-500">→</span>
              Patient confidence: the difference between “interested” and “scheduled”
            </li>
          </ul>
          <p className="mt-8 text-base font-semibold text-neutral-900 dark:text-neutral-100">
            More traffic into a weak system creates more waste—not more production.
          </p>
        </div>
      </section>

      <section
        id="patient-flow-audit-relief"
        className="scroll-mt-28 border-y border-neutral-200 bg-emerald-50/50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-emerald-950/20"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            This Is Exactly What the Patient Flow Audit™ Solves
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Relief starts with clarity—not pressure. The audit is a diagnostic: where patients slip away, what it is
            costing you in practical terms, and what to fix first so improvements compound.
          </p>
          <p className="mt-4 text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Most practices think they need more leads. Often they already have enough opportunities—they&apos;re just
            leaking patients before they ever book.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Patient leaks across site, capture, and booking paths
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Weak conversion paths and trust gaps that cap consults
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Poor local visibility and GBP friction vs real competitor behavior
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Follow-up failures and routing gaps that quietly delete opportunity
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Revenue leaks framed as production risk—not vanity metrics
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Highest-leverage growth opportunities with a practical sequence
            </li>
          </ul>
          <p className="mt-8 text-base text-neutral-700 dark:text-neutral-300">
            Then we show what to fix first—so you regain control without buying another generic marketing package.
          </p>
          <div className="mx-auto mt-10 max-w-md">
            <Link
              href={AUDIT_LP_HREF}
              onClick={() => trackCta("leak_relief_block", "find_my_new_patient_leaks")}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 sm:text-base"
            >
              Find My New Patient Leaks
            </Link>
          </div>
        </div>
      </section>

      <section id="why-us" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Agencies Try to Get More Traffic
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            We Fix What Makes Traffic Valuable
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Most agencies focus on
              </p>
              <ul className="mt-4 space-y-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <li>Ads and spend increases</li>
                <li>SEO reports disconnected from booked consults</li>
                <li>Website redesigns without a patient-flow diagnosis</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/25">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900 dark:text-emerald-300">
                We focus on
              </p>
              <ul className="mt-4 space-y-2 text-sm font-semibold text-neutral-900 dark:text-white">
                <li>Patient conversion that survives mobile reality</li>
                <li>Booked appointments—not “more leads” as a vanity score</li>
                <li>Follow-up systems your team can sustain</li>
                <li>Revenue growth tied to case mix and schedule outcomes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="trust"
        className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Guessing. No Vanity Metrics. No Generic Marketing Advice.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Dental-specific systems</strong> — built around
              consult booking, procedure intent, and Central US competition—not B2B templates.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Real financial logic</strong> — we prioritize what
              impacts production risk, not screenshots that look good in a deck.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent recommendations</strong> — clear
              sequencing, tradeoffs, and what not to do yet.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No pressure sales</strong> — fit matters; the goal
              is a better decision, not a trapped signature.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Focused on booked patients</strong> — if it
              doesn&apos;t improve consults and schedule outcomes, it is not the priority.
            </li>
          </ul>
        </div>
      </section>

      <section id="faq" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Dental new patient loss, patient leakage, conversion problems, and practice growth issues for Nebraska,
            Iowa, Kansas, Missouri, South Dakota, and nearby Central US markets.
          </p>
          <dl className="mt-10 space-y-10">
            {NEW_PATIENT_LEAK_FUNNEL_FAQ.map((item) => (
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
            Your Next Patients Are Already Looking
            <span className="mt-3 block text-xl font-semibold text-neutral-200 sm:text-2xl">
              Let&apos;s Make Sure They Don&apos;t End Up Somewhere Else
            </span>
          </h2>
          <div className="mx-auto mt-8 max-w-md">
            <Link
              href={AUDIT_LP_HREF}
              onClick={() => trackCta("leak_final", "get_my_free_patient_flow_audit")}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 sm:text-base"
            >
              Get My Free Patient Flow Audit
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
              10-minute review · No pressure · Built for Central US dental practices · Focused on booked patients
            </p>
          </div>
        </div>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-950/95"
        role="region"
        aria-label="Patient leak funnel actions"
      >
        <Link
          href={AUDIT_LP_HREF}
          onClick={() => trackCta("leak_sticky", "find_my_new_patient_leaks")}
          className="btn-primary flex flex-[1.2] items-center justify-center rounded-lg py-3 text-center text-xs font-bold"
        >
          Find leaks
        </Link>
        <Link
          href={AUDIT_LP_HREF}
          onClick={() => trackCta("leak_sticky", "get_my_free_patient_flow_audit")}
          className="flex flex-1 items-center justify-center rounded-lg border border-neutral-300 bg-white py-3 text-center text-xs font-semibold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
        >
          Free audit
        </Link>
      </div>
      <div className="h-14 md:hidden" aria-hidden />
    </div>
  );
}
