"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { PATIENTFLOW_FOUNDATION_FAQ } from "@/content/patientflow-foundation-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const CTA_HREF = `${CONSTANTS.CONTACT_PATH}?plan=patientflow-foundation`;
const MICRO =
  "14-day delivery · No fluff · Built for dental practices only";

const INCLUDED: { title: string; why: string }[] = [
  {
    title: "5-page custom website",
    why: "Patients decide in seconds. A tight, purpose-built site routes high-intent visitors to call, form, or schedule—instead of wandering five generic pages that never ask for the appointment.",
  },
  {
    title: "Mobile-first responsive design",
    why: "Most new patient searches start on a phone. If tap targets, speed, or readability fail, you don’t get a second chance— they bounce to the next practice in the list.",
  },
  {
    title: "Conversion-focused layout",
    why: "Layout is psychology: trust, clarity, and one obvious next step. We design for booking behavior—not “pretty” panels that look nice in a portfolio but don’t produce calls.",
  },
  {
    title: "On-page SEO setup",
    why: "Google has to understand what you treat and where you serve. On-page structure connects procedure intent to your geography so you show up for the searches that actually drive appointments.",
  },
  {
    title: "Google Search Console setup",
    why: "You can’t fix what you can’t see. Search Console reveals coverage issues, queries you’re winning (and losing), and mobile problems that quietly cap new patient volume.",
  },
  {
    title: "Bing Webmaster submission",
    why: "A meaningful slice of local search still runs outside Google alone. Bing submission is part of owning your full local discovery footprint—not ignoring it.",
  },
  {
    title: "Google Analytics setup",
    why: "If you can’t tie pages to calls and form fills, you’re guessing. Analytics is installed to support real patient-flow decisions—not vanity pageview charts.",
  },
  {
    title: "Contact form connected to email",
    why: "A form that doesn’t reliably reach your team is a silent leak. We connect capture to email so intent doesn’t die in a broken plugin or spam folder roulette.",
  },
  {
    title: "Lead capture optimization",
    why: "Fewer fields, clearer promise, faster confirmation, and better routing mean more completed requests—especially for anxious patients comparing practices after hours.",
  },
  {
    title: "14-day delivery promise",
    why: "Slow launches are expensive: every week without a credible site is another week competitors collect the searches you paid for in attention. Foundation is built to ship.",
  },
];

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta });
}

function PrimaryCta({ placement, className }: { placement: string; className?: string }) {
  return (
    <Link
      href={CTA_HREF}
      onClick={() => trackCta(placement, "patient_flow_audit")}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-center text-base font-semibold text-white shadow-sm transition hover:bg-neutral-800 sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 dark:focus-visible:ring-offset-neutral-950",
        className
      )}
    >
      Get My Free Patient Flow Audit
    </Link>
  );
}

function SecondaryCta({ placement, className }: { placement: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        trackCta(placement, "see_if_losing_patients");
        document.getElementById("the-real-problem")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-center text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900",
        className
      )}
    >
      See If Your Practice Is Losing Patients
    </button>
  );
}

export function PatientFlowFoundationLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Hero */}
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-neutral-50 to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-400">
            PatientFlow Foundation™ · Central US dental practices
          </p>
          <p className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Stop losing patients before they ever call
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            Your Website Should Be Bringing in Patients—Not Quietly Losing Them
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            PatientFlow Foundation™ helps dental practices fix weak websites, poor local SEO, and broken lead capture
            systems so more visitors turn into booked appointments.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-200">
            Before you spend more on ads, SEO, or growth—fix the system patients see first.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <PrimaryCta placement="pf_foundation_hero" />
              </div>
              <div className="min-w-0 flex-1">
                <SecondaryCta placement="pf_foundation_hero" />
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-lg text-center text-[11px] font-medium leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-xs">
              {MICRO}
            </p>
          </div>
        </div>
      </section>

      <section id="the-real-problem" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Practices Don&apos;t Need More Traffic First
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">They Need a Better Foundation</p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Most practices assume they need more leads. But often the real problem is upstream: the system patients see
            before they ever pick up the phone is weak, slow, or unclear.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>Your website feels dated or generic next to stronger competitors.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>Your messaging doesn&apos;t answer “Why you?” fast enough for a nervous patient.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>Local SEO is underpowered—you&apos;re invisible for the searches that drive new patients.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>Contact forms and paths create friction—or leads don&apos;t route reliably.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>Google visibility doesn&apos;t match how good you are clinically.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>Competitors look stronger online—even when you&apos;re the better practice.</span>
            </li>
          </ul>
          <p className="mt-8 text-lg font-semibold text-neutral-900 dark:text-white">
            More traffic into a broken system doesn&apos;t create growth. It creates more waste.
          </p>
        </div>
      </section>

      <section id="what-this-fixes" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            We Fix the Parts That Quietly Cost You Patients
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Patient loss often happens <strong className="text-neutral-900 dark:text-white">before anyone calls</strong>
            —in the moments where trust is won or lost in seconds.
          </p>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Outdated feel:</strong> Patients compare you to the
              last site they saw. If yours feels behind, they assume your experience is behind—and they move on.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Competitors ranking above you:</strong> Same ZIP,
              same intent—whoever looks more credible and easier to book wins the click.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Form friction:</strong> Every extra field and every
              doubt is a chance to abandon—especially on mobile, after hours.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Weak mobile experience:</strong> Thumb reach, speed,
              and clarity decide whether a high-intent visitor becomes a booked patient or a bounce.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Missing trust signals:</strong> Reviews, clarity,
              credentials, and “what happens next” reduce anxiety—anxiety kills appointments.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Local SEO underperformance:</strong> If Google
              doesn&apos;t confidently connect you to the right city + services, you don&apos;t get the shot to compete
              for the appointment.
            </li>
          </ul>
          <p className="mt-8 text-base font-medium text-neutral-900 dark:text-white">
            That&apos;s not a “branding problem.” It&apos;s revenue walking out while you still pay attention, payroll,
            and rent.
          </p>
        </div>
      </section>

      <section id="whats-included" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What&apos;s Included in PatientFlow Foundation™
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Every line item below is tied to one outcome:{" "}
            <strong className="text-neutral-900 dark:text-white">more booked patients from the same attention you
            already get</strong>—not “web design” for its own sake.
          </p>
          <ul className="mt-10 space-y-8">
            {INCLUDED.map((item) => (
              <li key={item.title} className="border-b border-neutral-200 pb-8 last:border-0 dark:border-neutral-800">
                <p className="flex items-start gap-2 text-base font-semibold text-neutral-900 dark:text-white">
                  <span className="mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden>
                    ✓
                  </span>
                  {item.title}
                </p>
                <p className="mt-2 pl-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.why}</p>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-10 max-w-xl">
            <PrimaryCta placement="pf_foundation_after_included" />
            <p className="mt-3 text-center text-[11px] text-neutral-500 dark:text-neutral-400">{MICRO}</p>
          </div>
        </div>
      </section>

      <section id="financial-logic" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            This Isn&apos;t a Website Investment
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">It&apos;s Revenue Protection</p>
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-950 sm:p-8">
            <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              If <strong className="text-neutral-950 dark:text-white">one implant case</strong> is worth{" "}
              <strong className="text-neutral-950 dark:text-white">$4,500+</strong>…
            </p>
            <p className="mt-4 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              …and your current site and capture path cause even{" "}
              <strong className="text-neutral-950 dark:text-white">one lost patient per month</strong> you never see on
              the schedule…
            </p>
            <p className="mt-6 text-2xl font-semibold text-red-600 dark:text-red-400">
              That&apos;s over $50,000 annually leaking from one invisible problem.
            </p>
            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
              Example math for illustration—your leakage depends on case mix and market. We quantify it in the Patient
              Flow Audit.
            </p>
          </div>
          <p className="mt-8 text-lg font-medium text-neutral-900 dark:text-white">
            PatientFlow Foundation™ exists to stop that leak before you pour more budget into traffic.
          </p>
        </div>
      </section>

      <section id="who-for" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            This Is Built For Practices That Want to Grow the Right Way
          </h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Best for
          </p>
          <ul className="mt-3 space-y-2 text-base text-neutral-800 dark:text-neutral-200">
            <li>General dentists ready to tighten new patient flow</li>
            <li>Cosmetic practices competing on trust and clarity</li>
            <li>Implant-focused offices where case value makes leaks expensive</li>
            <li>Family dentistry brands competing in crowded local markets</li>
            <li>Multi-location groups that need a repeatable foundation</li>
            <li>Practices preparing to scale ads/SEO without scaling waste</li>
          </ul>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Not for
          </p>
          <ul className="mt-3 space-y-2 text-base text-neutral-600 dark:text-neutral-400">
            <li>Practices shopping for “cheap websites”</li>
            <li>Agencies looking for white-label fulfillment</li>
            <li>Anyone chasing vanity metrics instead of booked patients</li>
          </ul>
        </div>
      </section>

      <section id="why-not-diy" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Why Most Dental Websites Underperform
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Generic agencies build websites. We build{" "}
            <strong className="text-neutral-900 dark:text-white">patient acquisition systems</strong>—because the
            appointment is the scoreboard.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Typical “website project”
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>Template-first aesthetics</li>
                <li>Thin local intent mapping</li>
                <li>Weak booking psychology</li>
                <li>Little follow-up thinking</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-200/70 bg-white p-5 dark:border-emerald-900/50 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                PatientFlow thinking
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <li>Conversion psychology for anxious patients</li>
                <li>Local SEO structure tied to procedures + geography</li>
                <li>Trust signals that support clinical credibility</li>
                <li>Capture + routing designed for real front desk workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Contracts. No Guesswork. No Generic Agency Work.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent process</strong> — you know what ships,
              when it ships, and what “done” means.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Clear deliverables</strong> — Foundation is a
              defined package, not an open-ended “hours bucket.”
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No vague retainers</strong> — we’re not selling
              mystery SEO work disconnected from patient flow.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No bloated timelines</strong> — built around a{" "}
              <strong>14-day delivery promise</strong> for the packaged foundation.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Built specifically for dentists</strong> — Central US
              practices, dental patient intent, and booking behavior first.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Patient acquisition focus</strong> — not brochure
              pages that impress your team but don’t move the schedule.
            </li>
          </ul>
        </div>
      </section>

      <section id="faq" className="border-t border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <dl className="mt-10 space-y-10">
            {PATIENTFLOW_FOUNDATION_FAQ.map((item) => (
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
            Before You Buy More Traffic—Fix What Happens After the Click
          </h2>
          <div className="mx-auto mt-8 max-w-md">
            <PrimaryCta placement="pf_foundation_final" />
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
              14-day delivery · No pressure · Built for Central US dental practices · Designed for patient acquisition
            </p>
            <p className="mt-2 text-xs text-neutral-500">{MICRO}</p>
          </div>
        </div>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-950/95"
        role="region"
        aria-label="Request Patient Flow Audit"
      >
        <Link
          href={CTA_HREF}
          onClick={() => trackCta("pf_foundation_sticky", "patient_flow_audit")}
          className="btn-primary flex w-full items-center justify-center rounded-lg py-3.5 text-center text-sm font-bold"
        >
          Get My Free Patient Flow Audit
        </Link>
        <p className="mt-1.5 text-center text-[10px] text-neutral-500">14-day delivery · No PHI required for request</p>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </div>
  );
}
