"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { DENTAL_HOME_FAQ } from "@/content/dental-home-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const AUDIT_HREF = `${CONSTANTS.CONTACT_PATH}?plan=patient-flow-audit`;

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
    placement,
    cta,
  });
}

const HERO_CTA_MICRO =
  "Takes 10 minutes · No obligation · No PHI required · No pressure sales call";

function PrimaryCta({
  className,
  placement,
  size = "default",
  showMicroCopy = true,
  linkClassName,
}: {
  className?: string;
  placement: string;
  size?: "default" | "large";
  /** When false, render only the button (e.g. hero row puts micro copy below both CTAs). */
  showMicroCopy?: boolean;
  linkClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col items-stretch gap-2", className)}>
      <Link
        href={AUDIT_HREF}
        onClick={() => trackCta(placement, "patient_flow_audit")}
        className={cn(
          "inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 text-center font-semibold text-white shadow-sm transition hover:bg-neutral-800",
          "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          "dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 dark:focus-visible:ring-offset-neutral-950",
          size === "large"
            ? "h-14 px-6 text-lg sm:px-8"
            : "px-6 py-3.5 text-base",
          linkClassName
        )}
      >
        Get My Free Patient Flow Audit
      </Link>
      {showMicroCopy ? (
        <p className="text-center text-[11px] font-medium leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-xs">
          {HERO_CTA_MICRO}
        </p>
      ) : null}
    </div>
  );
}

function SecondaryCta({ placement, className }: { placement: string; className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-base font-semibold text-neutral-900 transition hover:bg-neutral-50",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900",
        className
      )}
      onClick={() => {
        trackCta(placement, "see_how_it_works");
        document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      See How It Works
    </button>
  );
}

export function DentalHomeLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Hero */}
      <section
        id="dental-hero"
        className="relative border-b border-neutral-200/80 bg-gradient-to-b from-neutral-50 to-white px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8 lg:pb-24 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-950"
      >
        <div className="mx-auto max-w-4xl text-center lg:max-w-5xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-400">
            The Central US Dental Growth Partner
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-[1.1] lg:text-5xl xl:text-[3.25rem] dark:text-white">
            Your Dental Website Should Be Booking Patients—Not Just Sitting There Looking Pretty
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            We build high-converting websites, local SEO systems, and automated patient acquisition funnels that help
            dental practices across the Central US turn traffic into booked appointments.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-200">
            No fluff. No vanity metrics. No “brand awareness” nonsense. Just predictable patient growth.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
              <PrimaryCta
                placement="dental_hero"
                size="large"
                showMicroCopy={false}
                className="min-w-0 flex-1"
              />
              <SecondaryCta
                placement="dental_hero"
                className="h-14 flex-1 px-6 text-lg font-semibold"
              />
            </div>
            <p className="mx-auto mt-4 max-w-lg text-center text-[11px] font-medium leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-xs">
              {HERO_CTA_MICRO}
            </p>
          </div>
        </div>
      </section>

      {/* Pain */}
      <section id="pain" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Getting Traffic But Still Not Getting Patients?
          </h2>
          <p className="mt-4 text-lg font-medium text-neutral-800 dark:text-neutral-200">
            Most practices don&apos;t have a traffic problem.
          </p>
          <p className="mt-2 text-lg font-medium text-neutral-800 dark:text-neutral-200">
            They have a <span className="text-neutral-950 dark:text-white">conversion problem</span>.
          </p>
          <p className="mt-8 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Here&apos;s what that pain actually looks like on the ground—month after month:
          </p>
          <ul className="mt-6 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/90" aria-hidden />
              <span>
                <strong className="text-neutral-900 dark:text-white">Missed implant cases</strong> — high-value
                treatment plans that never make it to the schedule because the patient never got clarity, speed, or
                trust online.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/90" aria-hidden />
              <span>
                <strong className="text-neutral-900 dark:text-white">High-value procedures slipping away</strong> —
                the patient “shops” three sites and books the practice that answers fastest with the clearest next step.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/90" aria-hidden />
              <span>
                <strong className="text-neutral-900 dark:text-white">Expensive Google Ads going nowhere</strong> —
                clicks without calls, calls without booked new patients, and no closed-loop tracking to fix it.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/90" aria-hidden />
              <span>
                <strong className="text-neutral-900 dark:text-white">Front desk follow-up gaps</strong> — after-hours
                voicemails, form fills that sit in an inbox, and speed-to-lead that loses to a competitor by minutes.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/90" aria-hidden />
              <span>
                <strong className="text-neutral-900 dark:text-white">Weak website messaging</strong> — pretty pages
                that don&apos;t answer “Why you?” for a patient who&apos;s anxious, in pain, or price-aware.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/90" aria-hidden />
              <span>
                <strong className="text-neutral-900 dark:text-white">Bad local visibility</strong> — you&apos;re
                invisible in the local pack while a competitor down the street owns the same ZIP intent.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/90" aria-hidden />
              <span>
                <strong className="text-neutral-900 dark:text-white">Silent revenue leaks</strong> — small frictions
                that look harmless in a weekly report but compound into six figures a year.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Math */}
      <section
        id="math"
        className="scroll-mt-24 border-y border-neutral-200 bg-neutral-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Let&apos;s Do the Math
          </h2>
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-950 sm:p-8">
            <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              If <strong className="text-neutral-950 dark:text-white">one implant case</strong> is worth{" "}
              <strong className="text-neutral-950 dark:text-white">$4,500+</strong>
              …
            </p>
            <p className="mt-4 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              …and your website and patient-flow systems miss just{" "}
              <strong className="text-neutral-950 dark:text-white">two qualified patients per month</strong> you never
              see on the schedule…
            </p>
            <p className="mt-6 text-xl font-semibold text-neutral-900 dark:text-white">
              That&apos;s over <span className="text-red-600 dark:text-red-400">$100,000/year</span> walking out the
              door.
            </p>
            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
              Example math for illustration—your real leakage depends on case mix, market, and follow-up. We&apos;ll
              quantify yours in the audit.
            </p>
          </div>
          <p className="mt-8 text-lg font-medium text-neutral-900 dark:text-white">
            This isn&apos;t about &quot;marketing.&quot;
          </p>
          <p className="mt-2 text-lg font-medium text-neutral-900 dark:text-white">
            It&apos;s about fixing <span className="underline decoration-red-500/50 decoration-2 underline-offset-4">expensive leaks</span>.
          </p>
        </div>
      </section>

      {/* Mechanism */}
      <section id="patient-flow-audit" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            The Patient Flow Audit™
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            A structured diagnosis of how patients move from search → trust → contact → booked appointment—and where
            money leaks in your specific market.
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            We audit
          </p>
          <ul className="mt-3 space-y-3 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400" aria-hidden>
                ✓
              </span>
              Your website conversion path (mobile speed, clarity, calls-to-action)
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400" aria-hidden>
                ✓
              </span>
              Local SEO visibility for high-intent dental searches
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400" aria-hidden>
                ✓
              </span>
              Google Business Profile performance and trust signals
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400" aria-hidden>
                ✓
              </span>
              Lead capture systems (forms, calls, chat) and what happens after
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400" aria-hidden>
                ✓
              </span>
              Missed patient opportunities (speed-to-lead, follow-up, recall handoffs)
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400" aria-hidden>
                ✓
              </span>
              Patient booking friction (scheduling, objections, treatment presentation online)
            </li>
          </ul>
          <div className="mt-10 max-w-md">
            <PrimaryCta placement="dental_after_audit" />
          </div>
        </div>
      </section>

      {/* Why agencies fail */}
      <section
        id="why-agencies-fail"
        className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Why Most Agencies Fail Dentists
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-red-200/60 bg-white p-5 dark:border-red-900/40 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
                What most agencies sell
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                <li>Vanity reports (activity without booked patients)</li>
                <li>Generic SEO retainers disconnected from scheduling</li>
                <li>Pretty websites that don&apos;t convert nervous patients</li>
                <li>“Leads” with no follow-up system accountability</li>
                <li>Traffic without a patient acquisition strategy</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-200/60 bg-white p-5 dark:border-emerald-900/40 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                What we optimize for
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                <li>
                  <strong className="text-neutral-900 dark:text-white">Booked patients</strong> — not marketing
                  theater
                </li>
                <li>Conversion-focused websites and landing paths</li>
                <li>Local SEO + GBP tied to calls and appointments</li>
                <li>Automated follow-up that protects speed-to-lead</li>
                <li>Clear reporting you can tie to production</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            How It Works
          </h2>
          <ol className="mt-10 space-y-10">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white dark:bg-white dark:text-neutral-950">
                1
              </span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Free Patient Flow Audit</h3>
                <p className="mt-2 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Submit your practice details. We review your patient acquisition path with dental-specific criteria—not
                  a generic “website review.”
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white dark:bg-white dark:text-neutral-950">
                2
              </span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Identify Revenue Leaks + Growth Opportunities
                </h3>
                <p className="mt-2 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                  You get a prioritized breakdown: what&apos;s broken, what it&apos;s likely costing you, and what to
                  fix first for the fastest booking lift.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white dark:bg-white dark:text-neutral-950">
                3
              </span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Build Your Patient Acquisition System
                </h3>
                <p className="mt-2 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                  If we&apos;re a fit, we implement the right stack: site, local SEO, GBP, tracking, and automated
                  follow-up—aligned to the path we diagnosed.
                </p>
              </div>
            </li>
          </ol>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-start">
            <PrimaryCta placement="dental_how_it_works" />
            <SecondaryCta placement="dental_how_it_works" />
          </div>
        </div>
      </section>

      {/* Offer path — diagnosis first */}
      <section
        id="acquisition-path"
        className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Diagnosis First. Then the Right Prescription.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            We don&apos;t ask you to “pick a package” before we understand your patient flow. After your audit, we
            recommend the right progression—only what your practice needs to compounding bookings.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { name: "PatientFlow Foundation™", desc: "Launch-ready web presence + SEO fundamentals tied to calls." },
              { name: "PatientFlow Lead Machine™", desc: "Funnel + CRM + follow-up so interest becomes scheduled patients." },
              { name: "Growth System™", desc: "Full patient acquisition engine: qualification, sequences, content, optimization." },
              { name: "Premium Growth Partner™", desc: "Highest-touch partnership for competitive markets and multi-location groups." },
            ].map((tier) => (
              <div
                key={tier.name}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-4 dark:border-neutral-700 dark:bg-neutral-950"
              >
                <p className="font-semibold text-neutral-900 dark:text-white">{tier.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{tier.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-400">
            Full scope and pricing are discussed after your audit—when recommendations are grounded in your numbers, not
            a menu.
          </p>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Contracts. No Guesswork. No Fake Lead Promises.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent process</strong> — you always know what
              we&apos;re doing and why it maps to booked patients.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Real numbers</strong> — calls, forms, speed-to-lead,
              and booking outcomes—not vanity dashboards.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No vague retainers</strong> — we tie work to
              patient acquisition mechanics you can feel in the schedule.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No pressure sales</strong> — if we&apos;re not the
              right partner, we&apos;ll tell you straight.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Built for dental practices</strong> — not generic
              “local business” playbooks.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Conversion-first + local SEO + booking focus</strong>{" "}
              — the only scoreboard that matters is whether patients choose you and show up.
            </li>
          </ul>
        </div>
      </section>

      {/* Proof */}
      <section
        id="proof"
        className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What Practices See When Patient Flow Gets Fixed
          </h2>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            Outcomes vary by market and starting point. These are representative patterns—not a guarantee.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-1">
            <blockquote className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
                “We had traffic. We didn&apos;t have a system. After tightening the booking path and GBP, our front desk
                stopped ‘losing’ form fills—and new patient appointments finally matched demand.”
              </p>
              <footer className="mt-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                — Multi-location GP group · Central US
              </footer>
            </blockquote>
            <blockquote className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
                “The implant consults weren’t the problem—getting the right patients to book was. We fixed messaging,
                landing pages, and follow-up speed. Production became predictable instead of hopeful.”
              </p>
              <footer className="mt-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                — Cosmetic & implant-focused practice · Midwest
              </footer>
            </blockquote>
            <blockquote className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
                “I was tired of ‘SEO reports.’ I wanted booked patients. The audit called out leaks I couldn’t unsee—and
                the fixes were practical.”
              </p>
              <footer className="mt-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                — Owner dentist · Nebraska metro
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <dl className="mt-10 space-y-10">
            {DENTAL_HOME_FAQ.map((item) => (
              <div key={item.q}>
                <dt className="text-lg font-semibold text-neutral-900 dark:text-white">{item.q}</dt>
                <dd className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA */}
      <section
        id="final-cta"
        className="scroll-mt-24 border-t border-neutral-200 bg-neutral-900 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 dark:border-neutral-800 dark:bg-black"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg font-medium text-neutral-200">Your next patients are already searching.</p>
          <p className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            The question is: will they find you—or your competitor?
          </p>
          <div className="mx-auto mt-10 max-w-md">
            <Link
              href={AUDIT_HREF}
              onClick={() => trackCta("dental_final", "patient_flow_audit")}
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-4 text-lg font-semibold text-neutral-950 shadow-sm transition hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              Get My Free Patient Flow Audit
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
              10-minute review · No pressure · No obligation · Built specifically for dental practices
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Takes 10 minutes · No obligation · No PHI required · No pressure sales call
            </p>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-950/95"
        role="region"
        aria-label="Request audit"
      >
        <div className="mx-auto max-w-lg">
          <Link
            href={AUDIT_HREF}
            onClick={() => trackCta("dental_sticky_mobile", "patient_flow_audit")}
            className="btn-primary flex w-full items-center justify-center rounded-lg py-3.5 text-center text-sm font-bold"
          >
            Get My Free Patient Flow Audit
          </Link>
          <p className="mt-1.5 text-center text-[10px] text-neutral-500 dark:text-neutral-400">
            10 min · No obligation · No PHI required
          </p>
        </div>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </div>
  );
}
