"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { PATIENTFLOW_LEAD_MACHINE_FAQ } from "@/content/patientflow-lead-machine-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const CTA_HREF = `${CONSTANTS.CONTACT_PATH}?plan=patientflow-lead-machine`;
const MICRO = "Built for dental practices · Conversion-first · Predictable lead flow";

const INCLUDED_PLUS: { title: string; why: string }[] = [
  {
    title: "Custom lead funnel",
    why: "High-value procedures need a dedicated path—not your homepage’s generic menu. A funnel sequences proof, objections, and one clear booking action so visitors who are ready stop circling and start scheduling.",
  },
  {
    title: "Dedicated landing page",
    why: "Campaigns, implants, cosmetic consults, and new-patient offers each deserve a page built for one job. Focused pages lift conversion because they remove distraction and match the exact intent that got the click.",
  },
  {
    title: "Lead capture forms",
    why: "Every unnecessary field and vague promise costs completions. Forms are tuned for mobile, speed, and dental-specific questions so more visitors become trackable leads your team can actually respond to.",
  },
  {
    title: "Automated email follow-up",
    why: "Most practices lose patients in the gap between “submitted” and “someone called.” Automated follow-up buys hours (and days) of persistence without sounding robotic—so warm intent doesn’t die on the waiting list.",
  },
  {
    title: "CRM setup + pipeline configuration",
    why: "If leads aren’t in stages with owners, you can’t manage speed-to-lead or accountability. Pipeline setup makes revenue visible: who’s new, who’s stuck, who needs a second touch—so booked patients stop feeling random.",
  },
  {
    title: "Lead tracking dashboard",
    why: "You can’t improve what you don’t measure. A simple dashboard ties sources, forms, and outcomes together so you’re not guessing which channel actually fills hygiene vs. high-value consults.",
  },
  {
    title: "Google Business Profile optimization",
    why: "For local dental intent, your Profile is a conversion surface—not a directory listing. Strong services, categories, photos, and review discipline increase calls and direction requests from people who are one step from booking.",
  },
  {
    title: "Local SEO for service area",
    why: "Service-area pages and structured local signals help Google connect you to the right neighborhoods and procedures—so you earn discovery that doesn’t depend on luck, a single ad campaign, or referral-only volume.",
  },
  {
    title: "Monthly performance reporting",
    why: "Monthly reporting keeps decisions tied to booked patients and pipeline movement—not vanity charts. You see what changed, what to fix next, and whether the system is actually compounding.",
  },
  {
    title: "Conversion review every 90 days",
    why: "Markets shift, competitors update, and patient behavior evolves. A quarterly conversion review forces the site, funnel, and follow-up to stay aligned with what’s winning on the schedule—not what looked good at launch.",
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
        trackCta(placement, "see_where_losing_patients");
        document.getElementById("the-real-problem")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-center text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900",
        className
      )}
    >
      See Where Your Practice Is Losing Patients
    </button>
  );
}

export function PatientFlowLeadMachineLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-neutral-50 via-white to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-800 dark:text-indigo-400">
            PatientFlow Lead Machine™ · A Patient Acquisition System™ · Central US dental practices
          </p>
          <p className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Turn your website into a patient booking machine
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            Stop Hoping for New Patients
            <span className="mt-1 block sm:mt-2">Build a System That Books Them</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            PatientFlow Lead Machine™ helps dental practices turn traffic into booked appointments using dedicated
            funnels, local SEO, CRM automation, and follow-up systems designed for patient acquisition.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-200">
            More traffic means nothing if patients never book. This fixes that.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <PrimaryCta placement="pf_lead_machine_hero" />
              </div>
              <div className="min-w-0 flex-1">
                <SecondaryCta placement="pf_lead_machine_hero" />
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
            Most Practices Don&apos;t Have a Lead Problem
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">They Have a Follow-Up Problem</p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Patients show interest. Then they disappear. Not because they hate dentistry—because the next steps are fuzzy,
            slow, or nobody owns the lead once it hits your world.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>No dedicated landing pages—every campaign dumps traffic onto a homepage built to do everything badly.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>Weak lead capture: long forms, unclear value, no confirmation, no routing rules.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>Poor form conversion—especially after hours when comparison shopping peaks.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>No automated follow-up—so “I&apos;ll call them back” becomes never.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>Front desk delays, missed calls, and inbox chaos without a single source of truth.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>No CRM visibility—you can&apos;t tell what&apos;s new, what&apos;s stuck, or what&apos;s already booked.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span>No lead tracking—so every month feels like guessing whether marketing “worked.”</span>
            </li>
          </ul>
          <p className="mt-8 text-lg font-semibold text-neutral-900 dark:text-white">
            The problem isn&apos;t attention. It&apos;s what happens after. And that&apos;s where revenue quietly dies.
          </p>
        </div>
      </section>

      <section id="what-this-solves" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            We Build the Full Path from Visitor → Lead → Booked Patient
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            PatientFlow Lead Machine™ is the flagship system for practices that are done treating growth like a slot
            machine. It&apos;s not a marketing package—it&apos;s{" "}
            <strong className="text-neutral-900 dark:text-white">infrastructure</strong> that makes new patients feel
            repeatable.
          </p>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Patient acquisition funnels</strong> that match
              intent to a single next step—call, form, or consult request—without dilution.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Landing pages designed to convert</strong> for the
              services that actually drive your schedule.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Lead capture systems</strong> that your team can
              trust to deliver every submission.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Automated follow-up sequences</strong> that protect
              speed-to-lead when the office is slammed.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">CRM visibility</strong> so accountability replaces
              mystery.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Lead tracking dashboards</strong> so decisions follow
              data—not vibes.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Local SEO patient discovery</strong> so you earn
              visibility in your real service area.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Patient booking optimization</strong> so the path
              from interest to appointment is obvious on every device.
            </li>
          </ul>
          <p className="mt-8 text-base font-medium text-neutral-900 dark:text-white">
            This should feel like certainty—not another year of marketing chaos.
          </p>
        </div>
      </section>

      <section id="whats-included" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What&apos;s Included in PatientFlow Lead Machine™
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Everything in{" "}
            <Link
              href="/patientflow-foundation"
              className="font-semibold text-indigo-800 underline decoration-indigo-800/30 underline-offset-2 hover:text-indigo-950 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              PatientFlow Foundation™
            </Link>{" "}
            (conversion website, on-page SEO, analytics, Search Console, Bing Webmaster, and optimized capture)—
            <strong className="text-neutral-900 dark:text-white">plus</strong> the systems that turn leads into booked
            patients:
          </p>
          <ul className="mt-10 space-y-8">
            {INCLUDED_PLUS.map((item) => (
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
            <PrimaryCta placement="pf_lead_machine_after_included" />
            <p className="mt-3 text-center text-[11px] text-neutral-500 dark:text-neutral-400">{MICRO}</p>
          </div>
        </div>
      </section>

      <section id="financial-logic" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Predictable Patients Create Predictable Revenue
          </h2>
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-950 sm:p-8">
            <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              If <strong className="text-neutral-950 dark:text-white">one high-value case</strong> averages{" "}
              <strong className="text-neutral-950 dark:text-white">$4,500+</strong>…
            </p>
            <p className="mt-4 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              …and this system helps you recover just{" "}
              <strong className="text-neutral-950 dark:text-white">3 patients per month</strong> who would have slipped
              through follow-up, routing, or weak capture…
            </p>
            <p className="mt-6 text-2xl font-semibold text-emerald-800 dark:text-emerald-400">
              That&apos;s $162,000+ annually from fixing follow-up alone.
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              (3 × $4,500 × 12 months — illustration; your case mix and market will differ.)
            </p>
            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
              This is not a marketing expense. It&apos;s revenue engineering—because dentists buy math, not slogans.
            </p>
          </div>
          <p className="mt-8 text-lg font-medium text-neutral-900 dark:text-white">
            Lead Machine exists so growth feels operational: visible leads, visible stages, visible bookings.
          </p>
        </div>
      </section>

      <section id="who-for" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Built for Practices Ready to Scale
          </h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Best for
          </p>
          <ul className="mt-3 space-y-2 text-base text-neutral-800 dark:text-neutral-200">
            <li>Growth-focused general dentists</li>
            <li>Implant and cosmetic practices with high case value</li>
            <li>Multi-provider offices that need repeatable intake</li>
            <li>Expanding practices outgrowing referral-only growth</li>
            <li>Multi-location clinics that need accountable pipelines</li>
            <li>Practices investing in long-term patient acquisition—not short-term tricks</li>
          </ul>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Not for
          </p>
          <ul className="mt-3 space-y-2 text-base text-neutral-600 dark:text-neutral-400">
            <li>Businesses shopping for cheap lead gen</li>
            <li>Practices that want growth but avoid systems and accountability</li>
            <li>Owners looking for &quot;more Instagram posts&quot; instead of booked patients</li>
          </ul>
        </div>
      </section>

      <section id="agencies-fail" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Traffic Without Systems Is Just Expensive Guesswork
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Most agencies sell what&apos;s easy to invoice: ads, SEO, pretty pages. Those can help—but if{" "}
            <strong className="text-neutral-900 dark:text-white">lead capture, follow-up, CRM, and booking behavior</strong>{" "}
            stay broken, you&apos;re paying for attention that never becomes production on the schedule.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Typical agency stack
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>More traffic reports</li>
                <li>Generic &quot;best practices&quot;</li>
                <li>Thin follow-up design</li>
                <li>Vanity metrics that don&apos;t tie to booked patients</li>
              </ul>
            </div>
            <div className="rounded-xl border border-indigo-200/80 bg-white p-5 dark:border-indigo-900/50 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                PatientFlow Lead Machine™
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <li>Lead capture tuned to dental behavior</li>
                <li>Automated follow-up + routing discipline</li>
                <li>CRM visibility your team can run daily</li>
                <li>Optimization loop tied to booked patients</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-base font-medium text-neutral-900 dark:text-white">
            We fix the system behind revenue—not the theater of busy-looking marketing.
          </p>
        </div>
      </section>

      <section id="trust" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Vague Retainers. No Lead Guessing. No Agency Theater.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent reporting</strong> — you see what
              moved, what didn&apos;t, and what we&apos;re changing next.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Visible lead tracking</strong> — fewer “mystery
              leads” and fewer debates about what&apos;s working.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Clear pipeline visibility</strong> — stages and
              ownership so accountability replaces hope.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Real patient acquisition focus</strong> — built for
              Central US dental markets and real scheduling realities.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Built specifically for dental practices</strong> —
              not a generic SMB funnel duct-taped to dentistry.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Strategy based on booked patients</strong> — the
              scoreboard is the schedule, not impressions.
            </li>
          </ul>
        </div>
      </section>

      <section id="faq" className="border-t border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Common questions on dental lead generation, CRM setup for dentists, and patient acquisition systems across
            Nebraska, Iowa, Kansas, Missouri, South Dakota, and nearby markets.
          </p>
          <dl className="mt-10 space-y-10">
            {PATIENTFLOW_LEAD_MACHINE_FAQ.map((item) => (
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
            New Patients Shouldn&apos;t Feel Random
            <span className="mt-1 block sm:mt-2">They Should Feel Predictable</span>
          </h2>
          <div className="mx-auto mt-8 max-w-md">
            <PrimaryCta placement="pf_lead_machine_final" />
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
              No pressure · No contracts · Built for Central US dental practices · Designed to create booked patients
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
          onClick={() => trackCta("pf_lead_machine_sticky", "patient_flow_audit")}
          className="btn-primary flex w-full items-center justify-center rounded-lg py-3.5 text-center text-sm font-bold"
        >
          Get My Free Patient Flow Audit
        </Link>
        <p className="mt-1.5 text-center text-[10px] text-neutral-500">
          Flagship patient acquisition system · Audit request — no PHI required
        </p>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </div>
  );
}
