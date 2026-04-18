"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { PREMIUM_GROWTH_PARTNER_FAQ } from "@/content/premium-growth-partner-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const CTA_HREF = `${CONSTANTS.CONTACT_PATH}?plan=patientflow-premium-partner`;
const MICRO = "Priority execution · Deeper strategy · Built for serious growth";

const INCLUDED_PLUS: { title: string; why: string }[] = [
  {
    title: "More frequent funnel testing",
    why: "Markets move weekly at the top end of dentistry. More test cycles mean faster learning—so you compound conversion advantages before competitors copy your last landing page. Outcome: more booked consults from the same demand, and a stronger position in high-ticket procedures.",
  },
  {
    title: "More content production",
    why: "Authority and intent coverage require volume without fluff—procedure guides, local intent pages, and proof-driven assets that support consults. More production means faster SEO compounding and clearer patient education—so you win attention that actually converts to revenue.",
  },
  {
    title: "Faster support",
    why: "When something breaks routing, forms, or tracking, every hour costs appointments. Partner-tier support is built for speed so leadership is not stuck babysitting vendors—your team keeps momentum while patients still feel taken care of.",
  },
  {
    title: "Deeper strategy involvement",
    why: "Tactics without leadership create random wins. Deeper involvement means prioritization against case mix, competitive threats, and capacity—so growth decisions map to booked patients and long-term dominance, not busywork calendars.",
  },
  {
    title: "Ongoing CRO work",
    why: "Conversion is never finished. Ongoing CRO treats your funnel like a product: hypotheses, measurement, and ruthless prioritization on the journeys that drive implants, cosmetic consults, and full-arch—small lifts on high-ticket flows routinely move six figures annually at serious volume.",
  },
  {
    title: "Priority execution across all updates",
    why: "Growth is a race between your iteration speed and the market. Priority execution means campaigns, pages, automations, and SEO improvements ship faster—so delayed execution stops silently taxing revenue on your highest-value cases.",
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
        trackCta(placement, "see_whats_limiting_growth");
        document.getElementById("the-real-problem")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-center text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900",
        className
      )}
    >
      See What&apos;s Limiting Growth
    </button>
  );
}

export function PremiumGrowthPartnerLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-stone-50 via-white to-white px-4 pb-16 pt-2 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900 dark:text-amber-500">
            Premium Growth Partner™ · Strategic Growth Partnership™ · Central US dental practices
          </p>
          <p className="mt-4 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Stop managing vendors—start working with a real growth partner
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-[2.65rem] lg:leading-[1.08] dark:text-white">
            Your Practice Doesn&apos;t Need Another Agency
            <span className="mt-2 block sm:mt-3">It Needs a Growth Partner</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            Premium Growth Partner™ gives dental practices a high-touch strategic partnership for faster execution,
            deeper funnel optimization, stronger content production, and full patient acquisition ownership.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-200">
            We work like an extension of your team—focused on booked patients, revenue growth, and long-term market
            dominance.
          </p>
          <div className="mx-auto mt-12 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <PrimaryCta placement="premium_partner_hero" />
              </div>
              <div className="min-w-0 flex-1">
                <SecondaryCta placement="premium_partner_hero" />
              </div>
            </div>
            <p className="mx-auto mt-5 max-w-lg text-center text-[11px] font-medium leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-xs">
              {MICRO}
            </p>
          </div>
        </div>
      </section>

      <section id="the-real-problem" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Practices Outgrow Their Marketing Agency
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            At a certain production level, the bottleneck is not ideas—it is operating cadence. You stop needing more
            vendors handing off tasks. You need a partner who can think in revenue, move fast, and own outcomes with
            you.
          </p>
          <ul className="mt-10 space-y-4 text-base font-medium leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-600" aria-hidden />
              <span>You need faster execution—while competitors ship weekly, your updates crawl.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-600" aria-hidden />
              <span>You need better strategy—not another slide deck disconnected from the schedule.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-600" aria-hidden />
              <span>You need more testing—because one frozen funnel is a ceiling, not a system.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-600" aria-hidden />
              <span>You need stronger conversion work—high-ticket dentistry punishes weak CRO harder than average.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-600" aria-hidden />
              <span>You need better reporting—visibility that leadership trusts, not vanity charts.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-600" aria-hidden />
              <span>You need deeper ownership—someone who treats patient acquisition like a growth department, not a ticket queue.</span>
            </li>
          </ul>
          <p className="mt-10 text-lg font-semibold text-neutral-900 dark:text-white">
            Most agencies stay tactical. Serious growth requires operational partnership—and leadership-level frustration
            when you do not have it.
          </p>
        </div>
      </section>

      <section id="what-this-solves" className="border-y border-neutral-200 bg-stone-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/30">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            We Operate Like Your Growth Department
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Premium Growth Partner™ is the highest-touch offer for practices that want N-Tech Digital operating like an
            extension of the internal team—not another outside vendor. This is{" "}
            <strong className="text-neutral-900 dark:text-white">Strategic Growth Partnership™</strong>: ownership,
            confidence, and velocity.
          </p>
          <ul className="mt-10 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Deeper CRO work</strong> on the journeys that drive
              your highest-value production—not surface tweaks.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Stronger landing page testing</strong> with faster
              learning cycles tied to consults and bookings.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">More frequent funnel optimization</strong> so your
              acquisition system keeps compounding while competitors copy last quarter&apos;s page.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Better content production</strong> that supports
              authority, intent coverage, and patient clarity at scale.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Faster support</strong> when revenue-critical paths
              break or when speed decides who wins the appointment.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Strategic planning</strong> aligned to case mix,
              capacity, and competitive pressure—not generic marketing calendars.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Stronger patient acquisition decisions</strong>{" "}
              grounded in pipeline reality and conversion evidence.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Better long-term growth control</strong>—less chaos,
              more predictability, more market leverage.
            </li>
          </ul>
          <p className="mt-10 text-base font-medium text-neutral-900 dark:text-white">
            This should feel like ownership and confidence—not outsourced marketing with extra adjectives.
          </p>
        </div>
      </section>

      <section id="whats-included" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What&apos;s Included in Premium Growth Partner™
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Everything in{" "}
            <Link
              href="/patientflow-growth-system"
              className="font-semibold text-amber-900 underline decoration-amber-900/25 underline-offset-2 hover:text-amber-950 dark:text-amber-500 dark:hover:text-amber-400"
            >
              Growth System™
            </Link>{" "}
            (compounding engine: Lead Machine™ foundation plus ongoing SEO, qualification, SMS/email automation,
            monitoring, refreshes, strategy, and management)—
            <strong className="text-neutral-900 dark:text-white">plus</strong> the partner layer built for velocity,
            depth, and leadership alignment:
          </p>
          <ul className="mt-12 space-y-10">
            {INCLUDED_PLUS.map((item) => (
              <li key={item.title} className="border-b border-neutral-200 pb-10 last:border-0 dark:border-neutral-800">
                <p className="flex items-start gap-2 text-base font-semibold text-neutral-900 dark:text-white">
                  <span className="mt-0.5 text-amber-700 dark:text-amber-500" aria-hidden>
                    ✓
                  </span>
                  {item.title}
                </p>
                <p className="mt-3 pl-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.why}</p>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-12 max-w-xl">
            <PrimaryCta placement="premium_partner_after_included" />
            <p className="mt-3 text-center text-[11px] text-neutral-500 dark:text-neutral-400">{MICRO}</p>
          </div>
        </div>
      </section>

      <section id="financial-logic" className="border-y border-neutral-200 bg-stone-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/30">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Faster Decisions Create Faster Revenue
          </h2>
          <div className="mt-10 rounded-2xl border border-neutral-200/90 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-950 sm:p-8">
            <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              Your highest-value cases depend on{" "}
              <strong className="text-neutral-950 dark:text-white">visibility, conversion, and follow-up speed</strong>
              working together. When execution lags—pages, tests, content, routing—demand does not wait. Competitors and
              patient impatience capture the margin instead.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              Even modest conversion lifts on high-ticket procedures compound into{" "}
              <strong className="text-neutral-950 dark:text-white">six-figure annual gains</strong> at real production
              volume. Delay is not neutral; it is expensive.
            </p>
            <p className="mt-8 text-xl font-semibold text-amber-950 dark:text-amber-400">
              This is not premium service for its own sake. It is premium speed—because leadership growth problems are
              clock problems as much as strategy problems.
            </p>
            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
              Dentists buy math. Partner tier is for owners who want the math protected by execution velocity—not
              explained away by monthly activity.
            </p>
          </div>
        </div>
      </section>

      <section id="who-for" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Built for Practices Playing to Win
          </h2>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Best for
          </p>
          <ul className="mt-4 space-y-2 text-base text-neutral-800 dark:text-neutral-200">
            <li>High-production practices where small improvements move serious revenue</li>
            <li>Cosmetic and implant offices competing on trust, speed, and conversion depth</li>
            <li>Multi-location groups that need governance without slowing execution</li>
            <li>DSO-aligned operations that need accountable patient acquisition leadership</li>
            <li>Scaling owner-led practices outgrowing vendor theater</li>
            <li>Teams that want strategic growth leadership—not task tickets</li>
          </ul>
          <p className="mt-10 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Not for
          </p>
          <ul className="mt-4 space-y-2 text-base text-neutral-600 dark:text-neutral-400">
            <li>Practices shopping for the lowest-cost retainer mindset</li>
            <li>Businesses that want occasional help without partnership depth</li>
            <li>Owners avoiding long-term systems, accountability, and clear scoreboards</li>
          </ul>
        </div>
      </section>

      <section id="agencies-fail" className="border-y border-neutral-200 bg-stone-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/30">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Tactics Don&apos;t Scale
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">Ownership Does</p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Most agencies sell what is easy to staff: campaigns, reports, SEO updates, website edits. They avoid the
            harder part: decision-making, revenue accountability, conversion ownership, and growth leadership that
            holds under executive scrutiny.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Vendor pattern
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>Task execution without revenue ownership</li>
                <li>Low courage on prioritization</li>
                <li>Slow iteration on high-impact pages</li>
                <li>Leadership still carries the whole mental load</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200/90 bg-white p-6 dark:border-amber-900/40 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-950 dark:text-amber-400">
                Premium Growth Partner™
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <li>We help lead growth decisions—not just execute tasks</li>
                <li>Conversion and pipeline ownership as a discipline</li>
                <li>Faster cycles where speed changes outcomes</li>
                <li>Strategic access aligned to booked patients and revenue</li>
              </ul>
            </div>
          </div>
          <p className="mt-10 text-base font-medium text-neutral-900 dark:text-white">
            Growth at your level stops being a tactics problem. It becomes an ownership problem—and that is what this
            tier is built to solve.
          </p>
        </div>
      </section>

      <section id="trust" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Vendor Relationships. No Slow Response. No Guesswork.
          </h2>
          <ul className="mt-10 space-y-5 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Priority execution</strong> — when it matters, the
              work moves—not next month&apos;s queue.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Direct strategic access</strong> — leadership-level
              conversations tied to revenue, not status theater.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Faster optimization cycles</strong> — more tests,
              more learning, more compounding advantage.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent accountability</strong> — clear metrics
              around patient acquisition quality and booking outcomes.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Patient acquisition focus</strong> — built for
              serious dental economics and Central US competition.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Built specifically for dentists</strong> — not a
              generic premium retainer rebranded for healthcare.
            </li>
          </ul>
        </div>
      </section>

      <section id="faq" className="border-t border-neutral-200 bg-stone-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/30">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            Dental growth partner, premium dental marketing, CRO, and strategic patient acquisition for Nebraska, Iowa,
            Kansas, Missouri, South Dakota, and surrounding Central US markets.
          </p>
          <dl className="mt-12 space-y-10">
            {PREMIUM_GROWTH_PARTNER_FAQ.map((item) => (
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
        className="border-t border-neutral-200 bg-neutral-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 dark:border-neutral-800 dark:bg-black"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Serious Growth Requires Serious Ownership
          </h2>
          <div className="mx-auto mt-10 max-w-md">
            <PrimaryCta placement="premium_partner_final" />
            <p className="mt-5 text-xs leading-relaxed text-neutral-400">
              Priority execution · No bloated retainers · Built for Central US dental practices · Focused on revenue,
              not activity
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
          onClick={() => trackCta("premium_partner_sticky", "patient_flow_audit")}
          className="btn-primary flex w-full items-center justify-center rounded-lg py-3.5 text-center text-sm font-bold"
        >
          Get My Free Patient Flow Audit
        </Link>
        <p className="mt-1.5 text-center text-[10px] text-neutral-500">
          Premium growth partnership · Audit request — no PHI required
        </p>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </div>
  );
}
