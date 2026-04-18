"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { WHY_DENTAL_PRACTICES_TRUST_NTECH_FAQ } from "@/content/why-dental-practices-trust-ntech-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const AUDIT_LP_HREF = "/free-patient-flow-audit";

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta });
}

function SecondaryPatientFlowCta({ placement, className }: { placement: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        trackCta(placement, "see_how_improve_patient_flow");
        document.getElementById("how-we-work")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-center text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900",
        className
      )}
    >
      See How We Improve Patient Flow
    </button>
  );
}

export function WhyDentalPracticesTrustNtechLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-slate-50 to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-400">
            Authority funnel · Why practices trust us · Central US dental practices
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            We Don&apos;t Sell Marketing
            <span className="mt-2 block text-2xl sm:mt-3 sm:text-3xl lg:text-4xl">
              We Build Patient Acquisition Systems for Dental Practices
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            N-Tech Digital helps dental practices across the Central US turn weak websites, poor local SEO, and broken
            follow-up into predictable patient growth. We focus on what matters:{" "}
            <span className="font-semibold text-neutral-800 dark:text-neutral-100">booked patients</span>—not vanity
            metrics.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            No fluff. No bloated retainers. No agency theater.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={AUDIT_LP_HREF}
                  onClick={() => trackCta("authority_hero", "free_patient_flow_audit")}
                  className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-center text-base font-semibold text-white shadow-sm transition hover:bg-neutral-800 sm:text-lg dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
                >
                  Get My Free Patient Flow Audit
                </Link>
              </div>
              <div className="min-w-0 flex-1">
                <SecondaryPatientFlowCta placement="authority_hero" />
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-lg text-center text-[11px] font-medium text-neutral-500 dark:text-neutral-400 sm:text-xs">
              Built for dentists · Focused on booked patients · Central US growth partner
            </p>
          </div>
        </div>
      </section>

      <section id="why-trust-matters" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Choosing the Wrong Agency Is Expensive
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Bad agencies cost more than bad marketing. They quietly burn budget, patience, and months of momentum—while
            your team keeps trying to make disconnected tactics fit a dental schedule.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500/90" aria-hidden />
              <span>Lost patients—especially nights and weekends when follow-up collapses</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500/90" aria-hidden />
              <span>Wasted ad spend routed into pages and capture that were never built to convert</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500/90" aria-hidden />
              <span>Poor local rankings and weak Google Business Profile signals vs nearby competitors</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500/90" aria-hidden />
              <span>Weak follow-up—leads that exist on paper but never become consults</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500/90" aria-hidden />
              <span>Broken systems: unclear ownership, noisy CRMs, no visibility into where opportunities die</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500/90" aria-hidden />
              <span>Months of lost momentum while leadership debates dashboards instead of fixing patient flow</span>
            </li>
          </ul>
          <p className="mt-8 text-base font-semibold text-neutral-900 dark:text-white">
            Most practices don&apos;t need another vendor. They need the right operator.
          </p>
        </div>
      </section>

      <section
        id="what-makes-us-different"
        className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            We Look at What Most Agencies Ignore
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Most agencies talk about marketing. We focus on patient acquisition systems that create booked patients,
            stronger local visibility, and predictable revenue growth. Marketing reports are easy—patient acquisition is
            specific. We prioritize the inputs that actually move someone from search or referral to a booked consult,
            then we build systems your front office can sustain.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-slate-700 dark:text-slate-400">→</span>
              Patient booking behavior—mobile paths, anxiety, and “what happens next” clarity
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700 dark:text-slate-400">→</span>
              Trust signals that drive conversion—not generic stock filler
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700 dark:text-slate-400">→</span>
              Google Business Profile visibility aligned to calls, directions, and consult intent
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700 dark:text-slate-400">→</span>
              Local-intent search structure for the procedures you want on the schedule
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700 dark:text-slate-400">→</span>
              Front desk follow-up friction—speed, scripts, ownership, and after-hours reality
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700 dark:text-slate-400">→</span>
              CRM visibility so leadership sees leakage—not just lead counts
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700 dark:text-slate-400">→</span>
              Lead qualification systems that protect chair time without abandoning real opportunity
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700 dark:text-slate-400">→</span>
              High-value case acquisition framed as revenue per patient opportunity—not vanity volume
            </li>
          </ul>
        </div>
      </section>

      <section id="operating-philosophy" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Our Standard Is Simple
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 sm:text-2xl dark:text-neutral-200">
            If It Doesn&apos;t Create Booked Patients, It Doesn&apos;t Matter
          </p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            We don&apos;t optimize for busywork that photographs well in a monthly deck.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-400">
                We don&apos;t optimize for
              </p>
              <ul className="mt-4 space-y-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <li>Traffic screenshots disconnected from consults</li>
                <li>Ranking reports without local intent context</li>
                <li>“Engagement” that never becomes production</li>
                <li>Retainers built on activity instead of leverage</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-slate-50 p-6 dark:border-neutral-700 dark:bg-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-300">
                We optimize for
              </p>
              <ul className="mt-4 space-y-2 text-sm font-semibold text-neutral-900 dark:text-white">
                <li>Patient acquisition you can feel on the schedule</li>
                <li>Revenue and case mix—not noise</li>
                <li>Case value discipline for the care you want to grow</li>
                <li>Predictable growth from repeatable systems</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="how-we-work" className="scroll-mt-28 border-y border-neutral-200 bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Strategy First. Execution Second.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Calm sequencing beats chaos. You should always know why the next step exists—and what patient outcome it
            supports.
          </p>
          <ol className="mt-10 space-y-6">
            {[
              {
                step: "Step 1",
                title: "Patient Flow Audit™",
                body: "A structured diagnosis across your site, local presence, capture, follow-up, and booking path—prioritized by revenue risk, not trends.",
              },
              {
                step: "Step 2",
                title: "Identify Revenue Leaks",
                body: "We name where patients slip away before they book, and what is costing consults this month—not someday.",
              },
              {
                step: "Step 3",
                title: "Build the Right Growth System",
                body: "Execution matches leverage: conversion, local intent, GBP trust, landing pages, automation, and CRM visibility—only what your practice is ready to run.",
              },
              {
                step: "Step 4",
                title: "Optimize for Compounding Growth",
                body: "We refine what works, cut what doesn’t, and tighten the loop so improvements stack instead of resetting every quarter.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white dark:bg-white dark:text-neutral-950">
                  {item.step.replace("Step ", "")}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    {item.step}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="trust" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Contracts. No Guessing. No Generic Strategy
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent recommendations</strong> — you see the
              logic, the tradeoffs, and the sequence.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Clear deliverables</strong> — what ships, who owns it,
              and how it connects to booked patients.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No fake lead promises</strong> — we do not sell
              guaranteed rankings or miracle multiples.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No pressure sales</strong> — fit matters; the audit is
              built to earn a decision, not trap one.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No vague retainers</strong> — scope ties to leverage
              and accountability—not generic hours.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Built specifically for dentists</strong> — consult
              culture, procedure intent, and Central US competition.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Financial logic behind every decision</strong> — if
              it does not map to production risk, we do not prioritize it.
            </li>
          </ul>
        </div>
      </section>

      <section id="proof" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What Practices Actually Notice
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Believable outcomes leadership names in meetings—not inflated “wins” that fall apart under a few questions.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-slate-600 dark:text-slate-400">✓</span>
              Stronger patient inquiry quality—fewer dead-end chats, more consult-ready requests
            </li>
            <li className="flex gap-2">
              <span className="text-slate-600 dark:text-slate-400">✓</span>
              More booked consultations from the same baseline of attention
            </li>
            <li className="flex gap-2">
              <span className="text-slate-600 dark:text-slate-400">✓</span>
              Improved local visibility where high-intent patients actually decide
            </li>
            <li className="flex gap-2">
              <span className="text-slate-600 dark:text-slate-400">✓</span>
              Faster front desk follow-up—especially after hours and weekends
            </li>
            <li className="flex gap-2">
              <span className="text-slate-600 dark:text-slate-400">✓</span>
              Better case acceptance consistency when trust is sequenced before the visit
            </li>
            <li className="flex gap-2">
              <span className="text-slate-600 dark:text-slate-400">✓</span>
              Stronger trust during consultations—clear expectations and less price-only shopping
            </li>
            <li className="flex gap-2">
              <span className="text-slate-600 dark:text-slate-400">✓</span>
              More predictable growth—fewer random months explained away as “seasonality”
            </li>
          </ul>
          <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
            Trust beats hype. If an agency cannot explain the patient journey in plain language, it cannot fix it.
          </p>
        </div>
      </section>

      <section id="audit-cta" className="border-y border-neutral-200 bg-slate-900 px-4 py-14 text-slate-50 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-black">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            The Fastest Way to See If Your Practice Has Revenue Leaks
          </h2>
          <p className="mt-3 text-lg font-semibold text-white/95">
            The Free Patient Flow Audit™ shows what is quietly costing consults—before you buy more traffic or switch
            vendors again.
          </p>
          <ul className="mt-8 space-y-2 text-base font-medium text-slate-200">
            <li className="flex gap-2">
              <span className="text-emerald-400">→</span>
              What is broken in the patient path—from first click to booked appointment
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">→</span>
              What is costing patients this month (conversion, trust, follow-up, local intent)
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">→</span>
              What should be fixed first for the highest leverage
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">→</span>
              Where the biggest opportunities exist—without a laundry list nobody can execute
            </li>
          </ul>
          <div className="mx-auto mt-10 max-w-md">
            <Link
              href={AUDIT_LP_HREF}
              onClick={() => trackCta("authority_audit_block", "free_patient_flow_audit")}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 sm:text-base"
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
            Best dental marketing agency and growth partner positioning for Nebraska, Iowa, Kansas, Missouri, South
            Dakota, and the broader Central US—patient acquisition, dental SEO, conversion, and booked consults.
          </p>
          <dl className="mt-10 space-y-10">
            {WHY_DENTAL_PRACTICES_TRUST_NTECH_FAQ.map((item) => (
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
            You Don&apos;t Need More Marketing
            <span className="mt-2 block text-xl font-semibold text-neutral-200 sm:text-2xl">
              You Need Better Patient Acquisition
            </span>
          </h2>
          <div className="mx-auto mt-8 max-w-md">
            <Link
              href={AUDIT_LP_HREF}
              onClick={() => trackCta("authority_final", "free_patient_flow_audit")}
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
        aria-label="Authority page actions"
      >
        <button
          type="button"
          onClick={() => {
            trackCta("authority_sticky", "see_how_improve_patient_flow");
            document.getElementById("how-we-work")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="flex-1 rounded-lg border border-neutral-300 bg-white py-3 text-xs font-semibold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
        >
          Patient flow
        </button>
        <Link
          href={AUDIT_LP_HREF}
          onClick={() => trackCta("authority_sticky", "free_patient_flow_audit")}
          className="btn-primary flex flex-[1.3] items-center justify-center rounded-lg py-3 text-center text-xs font-bold"
        >
          Free audit
        </Link>
      </div>
      <div className="h-14 md:hidden" aria-hidden />
    </div>
  );
}
