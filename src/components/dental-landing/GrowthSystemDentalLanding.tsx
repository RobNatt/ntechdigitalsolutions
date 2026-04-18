"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { GROWTH_SYSTEM_DENTAL_FAQ } from "@/content/growth-system-dental-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const CTA_HREF = `${CONSTANTS.CONTACT_PATH}?plan=patientflow-growth-system`;
const MICRO = "Done-for-you growth · Built for dentists · Monthly optimization";

const INCLUDED_PLUS: { title: string; why: string }[] = [
  {
    title: "Multi-page funnel with A/B testing",
    why: "Your market shifts every quarter. A/B testing on real traffic turns opinions into proof—so headlines, proof, and form steps improve toward one outcome: more consults and booked new patients, not a frozen funnel from launch week.",
  },
  {
    title: "Automated lead qualification + scoring",
    why: "Your front desk should not burn hours on spam, wrong ZIP codes, and price shoppers who will never accept treatment. Scoring and routing prioritize patients who match the procedures that actually drive production—more booked patients and better-quality patients.",
  },
  {
    title: "SMS + email follow-up sequences",
    why: "Speed wins in dental intake—especially after hours. SMS + email sequences keep warm leads from going cold while your team is chairside, so high-intent patients get structure instead of silence.",
  },
  {
    title: "Monthly SEO content",
    why: "Content is how you compound authority for the procedures you want on the schedule—not random blog posts. Monthly publishing targets patient intent in your service area so organic discovery feeds the funnel with better-fit visitors over time.",
  },
  {
    title: "Ongoing Search Console monitoring",
    why: "Coverage issues, query shifts, and mobile problems quietly cap appointments if nobody watches weekly. Monitoring turns SEO into a managed system—so you fix leaks before they erase months of progress.",
  },
  {
    title: "Quarterly landing page refreshes",
    why: "Offers, competition, and patient objections change. Quarterly refreshes keep landing pages aligned with what converts today—so conversion does not decay while you keep paying attention elsewhere.",
  },
  {
    title: "Priority support",
    why: "Patient acquisition is time-sensitive: a broken form or routing issue is revenue on fire. Priority support means faster triage when something threatens bookings—not a ticket queue treated like whenever.",
  },
  {
    title: "Dedicated account manager",
    why: "One accountable owner of your growth work reduces handoffs and excuses. Your manager ties monthly work back to pipeline reality: leads, consults, and what still blocks the schedule.",
  },
  {
    title: "Monthly strategy call",
    why: "Implementation without strategy is just busywork. Monthly calls force decisions tied to booked patients and lead quality—what to test, what to publish, what to fix—so the system compounds instead of drifting.",
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
        trackCta(placement, "see_where_losing_revenue");
        document.getElementById("the-real-problem")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-center text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900",
        className
      )}
    >
      See Where Your Practice Is Losing Revenue
    </button>
  );
}

export function GrowthSystemDentalLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-neutral-50 via-white to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-400">
            Growth System™ · A Compounding Patient Growth System™ · Central US dental practices
          </p>
          <p className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Your funnel should improve every month—not stay frozen
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            Stop Managing Marketing
            <span className="mt-1 block sm:mt-2">Start Owning Predictable Patient Growth</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            Growth System™ gives dental practices a fully managed patient acquisition engine with SEO growth, automated
            qualification, SMS + email follow-up, and continuous funnel optimization.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-200">
            Not another retainer. A system that gets smarter and more profitable over time.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <PrimaryCta placement="growth_system_dental_hero" />
              </div>
              <div className="min-w-0 flex-1">
                <SecondaryCta placement="growth_system_dental_hero" />
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
            Most Funnels Don&apos;t Fail
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">They Just Stop Improving</p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Many practices launch a website, run some SEO, maybe build a landing page—then everything stalls. Not
            because the team is lazy. Because nobody owns the compounding work: testing, publishing, monitoring, and
            tightening the path from interest to booked patient.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>No one is systematically testing what increases consult requests.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Lead quality drifts—your front desk chases noise while best-fit patients slip away.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Follow-up gaps repeat: missed SMS windows, slow callbacks, unclear ownership.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Content publishing stops—so SEO momentum never compounds.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Search Console warnings pile up quietly while rankings and clicks decay.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Landing pages age—offers, proof, and competitors move on; your page stays frozen.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
              <span>Conversion quality isn&apos;t tracked—so “busy marketing” hides stagnant schedules.</span>
            </li>
          </ul>
          <p className="mt-8 text-lg font-semibold text-neutral-900 dark:text-white">
            Static funnels create stagnant growth. And stagnant growth feels like working hard for random results.
          </p>
        </div>
      </section>

      <section id="what-this-solves" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            We Build Systems That Compound
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Growth System™ is for practices that want done-for-you patient acquisition with ongoing optimization—not a
            one-time setup and a prayer. This is{" "}
            <strong className="text-neutral-900 dark:text-white">not a marketing retainer</strong>; it&apos;s a
            compounding engine designed around booked patients and lead quality.
          </p>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Stronger lead quality</strong> so the schedule fills
              with patients you actually want to treat.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Better patient qualification</strong> so your team
              stops burning cycles on dead ends.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Smarter follow-up sequences</strong> (SMS + email) that
              match real booking behavior—not generic blasts.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Better local SEO growth</strong> through monthly
              intent-driven content and technical hygiene.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Monthly visibility improvements</strong> tied to what
              patients search and what competitors are winning.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Higher landing page conversion</strong> through
              continuous optimization—not “set and forget.”
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Stronger patient intent matching</strong> so traffic
              sources connect to the procedures that drive revenue.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Less wasted staff time</strong> because systems do
              the repetitive work and routing stays clear.
            </li>
          </ul>
          <p className="mt-8 text-base font-medium text-neutral-900 dark:text-white">
            The goal is predictable momentum—not random marketing effort that feels busy but doesn&apos;t move
            production.
          </p>
        </div>
      </section>

      <section id="whats-included" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What&apos;s Included in Growth System™
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Everything in{" "}
            <Link
              href="/patientflow-lead-machine"
              className="font-semibold text-teal-800 underline decoration-teal-800/30 underline-offset-2 hover:text-teal-950 dark:text-teal-400 dark:hover:text-teal-300"
            >
              PatientFlow Lead Machine™
            </Link>{" "}
            (foundation site, funnels, capture, CRM, follow-up, GBP, local SEO, reporting, and quarterly reviews)—
            <strong className="text-neutral-900 dark:text-white">plus</strong> the ongoing layer that keeps results
            compounding:
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
            <PrimaryCta placement="growth_system_dental_after_included" />
            <p className="mt-3 text-center text-[11px] text-neutral-500 dark:text-neutral-400">{MICRO}</p>
          </div>
        </div>
      </section>

      <section id="financial-logic" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Better Patients &gt; More Patients
          </h2>
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-950 sm:p-8">
            <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              If your front desk spends hours chasing{" "}
              <strong className="text-neutral-950 dark:text-white">poor-fit leads</strong>—and your best cases never
              get the fast, structured follow-up they need—you lose revenue{" "}
              <strong className="text-neutral-950 dark:text-white">twice</strong>: once in wasted labor, once in missed
              production.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              Stronger qualification plus stronger follow-up doesn&apos;t just &quot;save time.&quot; It protects
              high-value treatment volume that otherwise leaks invisibly month after month.
            </p>
            <p className="mt-6 text-2xl font-semibold text-teal-900 dark:text-teal-400">
              For many practices, that leakage is a six-figure problem annually—not a small operational annoyance.
            </p>
            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
              Dentists buy math. Growth System is built to improve the numbers that matter: consults booked, lead quality,
              speed-to-lead, and conversion quality—measured honestly, optimized monthly.
            </p>
            <p className="mt-4 text-sm font-medium text-neutral-900 dark:text-white">
              This isn&apos;t more marketing. It&apos;s smarter patient acquisition.
            </p>
          </div>
        </div>
      </section>

      <section id="who-for" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Built for Practices That Want Growth Without Guesswork
          </h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Best for
          </p>
          <ul className="mt-3 space-y-2 text-base text-neutral-800 dark:text-neutral-200">
            <li>High-growth dental practices investing in compounding systems</li>
            <li>Implant and cosmetic offices where case value makes quality control essential</li>
            <li>Multi-provider practices that need consistent intake standards</li>
            <li>Scaling locations that can&apos;t rely on heroics at the front desk</li>
            <li>Practices with internal staff who need clearer systems—not more chaos</li>
            <li>Owners who want real monthly optimization tied to booked patients</li>
          </ul>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Not for
          </p>
          <ul className="mt-3 space-y-2 text-base text-neutral-600 dark:text-neutral-400">
            <li>Businesses shopping for the cheapest possible monthly retainer</li>
            <li>Practices that want growth but refuse long-term systems and accountability</li>
            <li>Owners looking for quick hacks instead of a real operating rhythm</li>
          </ul>
        </div>
      </section>

      <section id="agencies-fail" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Agencies Report Activity
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">We Improve Revenue</p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Most agencies send SEO reports, ranking screenshots, traffic updates, and busywork that looks productive—while
            ignoring lead quality, patient value, follow-up speed, conversion rates, and what actually lands on the
            schedule.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Activity theater
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>Vanity metrics disconnected from bookings</li>
                <li>&quot;We did stuff this month&quot; reporting</li>
                <li>Weak accountability to lead quality</li>
                <li>Optimization stops after launch</li>
              </ul>
            </div>
            <div className="rounded-xl border border-teal-200/90 bg-white p-5 dark:border-teal-900/50 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-900 dark:text-teal-300">
                Growth System™ outcomes
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <li>Patient acquisition metrics your team can trust</li>
                <li>Monthly improvements tied to consults and bookings</li>
                <li>Qualification + follow-up that protect production</li>
                <li>Funnels that keep learning—not freezing</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-base font-medium text-neutral-900 dark:text-white">
            We optimize what actually grows the practice—not the story an agency tells in a slide deck.
          </p>
        </div>
      </section>

      <section id="trust" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Bloated Retainers. No Busywork. No Agency Theater.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Monthly strategy with real accountability</strong>{" "}
              — decisions tied to pipeline reality, not vague marketing initiatives.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent lead tracking</strong> — fewer mystery
              leads, clearer sources, clearer next steps.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Conversion optimization focus</strong> — tests and
              changes aimed at booked patients, not aesthetics for their own sake.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Clear patient acquisition metrics</strong> — the
              scoreboard is consults and production support—not impressions alone.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Ongoing improvement</strong> — SEO, pages, and
              follow-up evolve as your market evolves.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Built specifically for dentists</strong> — Central
              US dental practices, real scheduling constraints, real patient anxiety patterns.
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
            Dental growth marketing, SEO content strategy, funnel optimization, lead qualification, and SMS follow-up
            for practices in Nebraska, Iowa, Kansas, Missouri, South Dakota, and nearby Central US markets.
          </p>
          <dl className="mt-10 space-y-10">
            {GROWTH_SYSTEM_DENTAL_FAQ.map((item) => (
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
            Growth Should Compound—Not Depend on Hope
          </h2>
          <div className="mx-auto mt-8 max-w-md">
            <PrimaryCta placement="growth_system_dental_final" />
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
              Monthly optimization · No vague retainers · Built for Central US dental practices · Focused on booked
              patients
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
          onClick={() => trackCta("growth_system_dental_sticky", "patient_flow_audit")}
          className="btn-primary flex w-full items-center justify-center rounded-lg py-3.5 text-center text-sm font-bold"
        >
          Get My Free Patient Flow Audit
        </Link>
        <p className="mt-1.5 text-center text-[10px] text-neutral-500">
          Compounding patient growth system · Audit request — no PHI required
        </p>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </div>
  );
}
