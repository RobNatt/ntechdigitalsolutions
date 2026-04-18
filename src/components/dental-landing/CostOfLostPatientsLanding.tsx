"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { COST_OF_LOST_PATIENTS_FAQ } from "@/content/cost-of-lost-patients-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const AUDIT_HREF = `${CONSTANTS.CONTACT_PATH}?plan=cost-of-lost-patients`;
const CALCULATOR_HREF = "/dental-roi-calculator";
const MICRO = "No pressure · Built for dentists · Focused on booked patients";

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta });
}

function PrimaryScrollCta({ placement, className }: { placement: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        trackCta(placement, "see_where_losing_patients");
        document.getElementById("where-you-lose")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-center text-base font-semibold text-white shadow-sm transition hover:bg-neutral-800 sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 dark:focus-visible:ring-offset-neutral-950",
        className
      )}
    >
      See Where My Practice Is Losing Patients
    </button>
  );
}

function SecondaryAuditCta({ placement, className }: { placement: string; className?: string }) {
  return (
    <Link
      href={AUDIT_HREF}
      onClick={() => trackCta(placement, "free_patient_flow_audit")}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-center text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900",
        className
      )}
    >
      Get My Free Patient Flow Audit
    </Link>
  );
}

export function CostOfLostPatientsLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-neutral-50 to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-400">
            Revenue leakage · Math &amp; logic funnel · Central US dental practices
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            The Most Expensive Patients Are the Ones You Never Book
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            Missed calls, weak websites, poor local rankings, slow follow-up, and bad conversion systems quietly cost
            dental practices thousands every month. Most owners never calculate it.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            This isn&apos;t about getting more traffic. It&apos;s about stopping preventable revenue loss.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <PrimaryScrollCta placement="lost_patients_hero" />
              </div>
              <div className="min-w-0 flex-1">
                <SecondaryAuditCta placement="lost_patients_hero" />
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-lg text-center text-[11px] font-medium text-neutral-500 dark:text-neutral-400 sm:text-xs">
              {MICRO}
            </p>
            <p className="mx-auto mt-6 max-w-md text-center text-xs text-neutral-500 dark:text-neutral-400">
              Want a quick numeric estimate?{" "}
              <Link
                href={CALCULATOR_HREF}
                className="font-semibold text-slate-800 underline decoration-slate-400 underline-offset-2 hover:text-neutral-950 dark:text-slate-300 dark:hover:text-white"
                onClick={() => trackCta("lost_patients_hero", "roi_calculator_link")}
              >
                Open the dental revenue leak calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="the-invisible-leak" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Revenue Loss Happens Quietly
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Patients rarely complain when they choose someone else. They compare, hesitate, and vanish—often after
            hours, often on a phone screen. The practice feels the pressure months later as empty chair time and
            “slower demand,” not as a single identifiable leak.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" aria-hidden />
              <span>Your website feels outdated next to a competitor who looks more credible online.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" aria-hidden />
              <span>Forms and mobile friction add doubt at the worst possible moment.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" aria-hidden />
              <span>GBP and local visibility do not match how strong you are clinically.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" aria-hidden />
              <span>Front desk follow-up is delayed—so intent cools before anyone owns the lead.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" aria-hidden />
              <span>Trust signals are thin—reviews, clarity, and “what happens next” never land.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" aria-hidden />
              <span>Booking feels harder than it should—so patients take the easier path.</span>
            </li>
          </ul>
          <p className="mt-8 text-lg font-semibold text-neutral-900 dark:text-white">
            That is silent revenue loss: expensive, cumulative, and easy to ignore until the math stops working.
          </p>
        </div>
      </section>

      <section id="cost-of-waiting" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Waiting Usually Costs More Than Fixing It
          </h2>
          <div className="mt-8 space-y-6 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            <p>
              <strong className="text-neutral-900 dark:text-white">One missed implant case</strong> at{" "}
              <strong className="text-neutral-900 dark:text-white">$4,500+</strong> is not a rounding error—it is a
              production hole that repeats whenever conversion and follow-up fail on high-intent traffic.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Two missed cosmetic cases per month</strong> at
              realistic fee levels can exceed{" "}
              <strong className="text-neutral-900 dark:text-white">$100,000 annually</strong>—without counting the
              referrals and hygiene those patients would have generated.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Poor local rankings</strong> mean patients choose
              competitors weekly for the same ZIP and intent. You do not see a line item labeled “lost ranking”—you see
              fewer consults.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Weak follow-up</strong> wastes attention you
              already earned: ads, SEO, referrals, and brand searches all die on the same bottleneck if speed and
              routing are weak.
            </p>
          </div>
          <p className="mt-8 text-lg font-semibold text-neutral-900 dark:text-white">
            Dentists buy math. The uncomfortable truth is that doing nothing still compounds—just in the wrong direction.
          </p>
        </div>
      </section>

      <section id="false-assumption" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            &quot;We Just Need More Leads&quot; Is Usually Wrong
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Most practices assume the answer is volume: more traffic, more clicks, more campaigns. Often the real
            problem is what happens{" "}
            <strong className="text-neutral-900 dark:text-white">after the click</strong>,{" "}
            <strong className="text-neutral-900 dark:text-white">before the call</strong>, and{" "}
            <strong className="text-neutral-900 dark:text-white">during follow-up</strong>—where patients decide
            whether booking feels easy, safe, and worth it.
          </p>
          <p className="mt-6 text-lg font-semibold text-neutral-900 dark:text-white">
            More traffic into a broken system does not create growth. It creates more waste—faster.
          </p>
        </div>
      </section>

      <section id="where-you-lose" className="scroll-mt-28 border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Where Dental Practices Actually Lose Patients
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            If several of these feel familiar, you are probably not short on dentistry—you are short on patient flow
            integrity.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Weak website conversion on mobile",
              "No dedicated landing pages for high-intent services",
              "Weak local SEO for procedure + city intent",
              "Poor Google Business Profile visibility vs competitors",
              "Missing trust signals and proof where decisions happen",
              "Weak follow-up automation after hours",
              "No CRM visibility—leads die in inboxes",
              "Missed lead qualification—time spent on poor-fit inquiries",
            ].map((line) => (
              <li
                key={line}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
              >
                {line}
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-10 max-w-xl">
            <SecondaryAuditCta placement="lost_patients_after_where" />
            <p className="mt-3 text-center text-[11px] text-neutral-500 dark:text-neutral-400">{MICRO}</p>
          </div>
        </div>
      </section>

      <section id="solution-audit" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            The Patient Flow Audit Shows Where Revenue Is Leaking
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            The audit is built to answer one question executives actually care about:{" "}
            <strong className="text-neutral-900 dark:text-white">where money is leaving without a line item</strong>.
            Then we rank fixes by leverage so you are not guessing what to do first.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Conversion leaks on the paths that drive consults
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Missed patient opportunities (speed, clarity, trust)
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Follow-up failures and routing gaps
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Local SEO and GBP gaps that cap discovery
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Booking friction and weak capture systems
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Highest-leverage growth opportunities tied to booked patients
            </li>
          </ul>
        </div>
      </section>

      <section id="agencies-miss" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Agencies Sell More Traffic
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">We Fix What Makes Traffic Valuable</p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Many agencies default to what is easy to invoice: ads, SEO reports, redesign cycles. Those can matter—but
            if patient conversion, follow-up, booking systems, and front desk friction stay weak, you do not get more
            booked patients. You get more busywork.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Activity focus
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>More impressions and clicks</li>
                <li>Monthly deliverables</li>
                <li>Vanity reporting</li>
                <li>Weak ownership of booking outcomes</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-300 bg-white p-5 dark:border-slate-700 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-300">
                Patient acquisition focus
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <li>Conversion paths that protect consults</li>
                <li>Follow-up and routing that protect speed</li>
                <li>Local clarity that protects discovery</li>
                <li>Booked patients as the scoreboard</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Guesswork. No Vanity Metrics. No Fake Growth Promises.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Real financial logic</strong> — we tie work to
              revenue protection, not slogans.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent recommendations</strong> — prioritized
              fixes, not a laundry list designed to sell everything.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Dental-specific systems</strong> — Central US
              markets, procedure intent, and real scheduling constraints.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No pressure sales</strong> — audit first, fit second.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Patient acquisition focus</strong> — revenue and
              booked patients, not vanity metrics.
            </li>
          </ul>
        </div>
      </section>

      <section id="faq" className="border-t border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Cost of lost dental patients, revenue leak analysis, and conversion loss for Nebraska, Iowa, Kansas,
            Missouri, South Dakota, and nearby Central US markets.
          </p>
          <dl className="mt-10 space-y-10">
            {COST_OF_LOST_PATIENTS_FAQ.map((item) => (
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
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">The Cost of Waiting Adds Up Fast</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base">
            Your next patients are already searching. The question is whether they find you—or a competitor who looks
            easier to book.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <Link
              href={AUDIT_HREF}
              onClick={() => trackCta("lost_patients_final", "free_audit")}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 sm:text-base"
            >
              Get My Free Patient Flow Audit
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
              No pressure · No obligation · Built for Central US dental practices · Focused on revenue, not vanity
              metrics
            </p>
            <p className="mt-2 text-xs text-neutral-500">{MICRO}</p>
          </div>
        </div>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-950/95"
        role="region"
        aria-label="Patient loss actions"
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              trackCta("lost_patients_sticky", "see_where_losing");
              document.getElementById("where-you-lose")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="flex-1 rounded-lg border border-neutral-300 bg-white py-3 text-xs font-semibold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
          >
            Where you lose
          </button>
          <Link
            href={AUDIT_HREF}
            onClick={() => trackCta("lost_patients_sticky", "free_audit")}
            className="btn-primary flex flex-[1.2] items-center justify-center rounded-lg py-3 text-center text-xs font-bold"
          >
            Free audit
          </Link>
        </div>
      </div>
      <div className="h-14 md:hidden" aria-hidden />
    </div>
  );
}
