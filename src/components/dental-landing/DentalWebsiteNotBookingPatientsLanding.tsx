"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { DENTAL_WEBSITE_NOT_BOOKING_FAQ } from "@/content/dental-website-not-booking-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const AUDIT_LP_HREF = "/free-patient-flow-audit";

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta });
}

export function DentalWebsiteNotBookingPatientsLanding() {
  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-slate-50 via-white to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">
            Pain → relief funnel · Website conversion · Central US dental practices
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            Your Website Looks Fine
            <span className="mt-2 block text-2xl sm:mt-3 sm:text-3xl lg:text-4xl">
              So Why Isn&apos;t It Booking More Patients?
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            Most dental practices assume they need more traffic. Often the real problem is weak conversion, poor trust
            signals, booking friction, and missed follow-up opportunities quietly killing patient flow.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Pretty websites don&apos;t grow practices. Conversion systems do.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={AUDIT_LP_HREF}
                  onClick={() => trackCta("website_booking_hero", "find_out_why_website_not_booking")}
                  className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-center text-base font-semibold text-white shadow-sm transition hover:bg-neutral-800 sm:text-lg dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
                >
                  Find Out Why My Website Isn&apos;t Booking Patients
                </Link>
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={AUDIT_LP_HREF}
                  onClick={() => trackCta("website_booking_hero", "get_my_free_patient_flow_audit")}
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

      <section id="painful-truth" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Dental Websites Are Quietly Losing Patients
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            The problem often isn&apos;t traffic—it&apos;s what happens after patients land on the site. Patients visit…
            and leave. Not because your team is bad—because the digital path does not earn the next step fast enough. Most
            owners never realize how much revenue disappears before a conversation ever happens.
          </p>
          <ul className="mt-10 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400">—</span>
              Trust isn&apos;t built fast enough—proof, clarity, and “what happens next” feel thin
            </li>
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400">—</span>
              Mobile experience feels weak—taps fail, text walls, buried phone, slow loads
            </li>
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400">—</span>
              Forms create friction—too many fields, vague promises, unclear routing
            </li>
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400">—</span>
              Messaging feels generic—like every other practice in a 10-mile radius
            </li>
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400">—</span>
              Competitors look stronger—cleaner proof, clearer consult paths, faster confidence
            </li>
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400">—</span>
              Local SEO visibility is weak where high-intent patients actually search
            </li>
            <li className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400">—</span>
              No real patient conversion path exists—attention arrives, then… nothing obvious
            </li>
          </ul>
        </div>
      </section>

      <section
        id="bad-conversion-signs"
        className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Signs Your Website Is Costing You Patients
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            If several of these feel familiar, the problem is probably not “more traffic.”
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-neutral-500">→</span>
              Traffic exists, but inquiries are weak or inconsistent
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500">→</span>
              Booked appointments do not match the attention the site gets
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500">→</span>
              Low-value patients show up while ideal cases feel random
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500">→</span>
              Google Business Profile visibility underperforms vs nearby competitors
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500">→</span>
              Weak implant / cosmetic consult flow—interest without scheduled treatment planning
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500">→</span>
              Heavy reliance on referrals while digital intent leaks elsewhere
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500">→</span>
              Front desk spends time chasing weak leads instead of booking strong ones
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-500">→</span>
              Competitors outrank you locally on the services you want to grow
            </li>
          </ul>
        </div>
      </section>

      <section id="financial-cost" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            One Weak Website Can Cost Six Figures Per Year
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Poor conversion is expensive because it hides. It does not show up as a neat invoice—it shows up as empty
            chair time, “we were so close,” and months where marketing feels louder than production.
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
                Two lost high-value patients per month can approach{" "}
                <span className="font-semibold">$100,000+ annually</span> when you compound opportunity cost
              </li>
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Most practices blame traffic first. The real problem is usually trust + booking friction—because that is
              where patients decide whether to schedule… or silently choose someone else.
            </p>
          </div>
        </div>
      </section>

      <section
        id="agencies-miss"
        className="border-y border-neutral-200 bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Agencies Build Websites
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            We Build Patient Acquisition Systems
          </p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            A pretty layout is not the same as a patient path that converts. Most agencies optimize for what is easy to
            show in a presentation—not what moves consults on a Tuesday night.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Most agencies focus on
              </p>
              <ul className="mt-4 space-y-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <li>Design aesthetics and “brand refresh” cycles</li>
                <li>Traffic volume without conversion accountability</li>
                <li>SEO reports disconnected from booked appointments</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/25">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900 dark:text-emerald-300">
                While ignoring what actually grows practices
              </p>
              <ul className="mt-4 space-y-2 text-sm font-semibold text-neutral-900 dark:text-white">
                <li>Patient trust and proof sequencing</li>
                <li>Conversion psychology on mobile</li>
                <li>Follow-up systems that protect speed-to-lead</li>
                <li>Booking behavior—fewer steps, clearer consult CTAs</li>
                <li>Lead qualification so the schedule fills with intent</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-base font-semibold text-neutral-900 dark:text-white">
            That is where real growth happens—after the click.
          </p>
        </div>
      </section>

      <section
        id="patient-flow-audit-relief"
        className="scroll-mt-28 border-y border-neutral-200 bg-emerald-50/45 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-emerald-950/20"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            This Is Exactly What the Patient Flow Audit™ Solves
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Immediate clarity—not a pitch deck. Most dental websites are built to look good, not convert. The audit
            answers what happens after patients land—and what to fix first so attention turns into booked patients.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Where patients drop off before they call or submit
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Why trust breaks on the pages that matter most
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              What kills conversion: messaging, layout, proof, friction, speed
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              Where local SEO and GBP signals underperform vs competitors
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-700 dark:text-emerald-400">✓</span>
              What should be fixed first for the highest leverage
            </li>
          </ul>
          <p className="mt-8 text-base text-neutral-700 dark:text-neutral-300">
            Then we show the highest-leverage path forward—so you regain control without guessing what to rebuild.
          </p>
          <div className="mx-auto mt-10 max-w-md">
            <Link
              href={AUDIT_LP_HREF}
              onClick={() => trackCta("website_booking_relief", "find_out_why_website_not_booking")}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 sm:text-base"
            >
              Find Out Why My Website Isn&apos;t Booking Patients
            </Link>
          </div>
        </div>
      </section>

      <section
        id="trust"
        className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Generic Website Audits. No Agency Fluff. No Guessing.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Built specifically for dentists</strong> — consult
              booking, procedure intent, and how patients compare in your market.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Focused on booked patients</strong> — not
              “engagement” metrics that do not touch the schedule.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Real financial logic</strong> — we tie fixes to
              production risk and case value—not vanity charts.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No pressure sales</strong> — clarity first; fit
              second.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Transparent recommendations</strong> — what to do,
              what to defer, and why.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No vanity metrics</strong> — if it does not improve
              consults, it is not the headline priority.
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
            Dental website conversion, booking problems, patient conversion issues, and practice website audits for
            Nebraska, Iowa, Kansas, Missouri, South Dakota, and nearby Central US markets.
          </p>
          <dl className="mt-10 space-y-10">
            {DENTAL_WEBSITE_NOT_BOOKING_FAQ.map((item) => (
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
            Your Next Patients Are Already Searching
            <span className="mt-3 block text-xl font-semibold text-neutral-200 sm:text-2xl">
              Let&apos;s Make Sure Your Website Actually Converts Them
            </span>
          </h2>
          <div className="mx-auto mt-8 max-w-md">
            <Link
              href={AUDIT_LP_HREF}
              onClick={() => trackCta("website_booking_final", "get_my_free_patient_flow_audit")}
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
        aria-label="Website conversion actions"
      >
        <Link
          href={AUDIT_LP_HREF}
          onClick={() => trackCta("website_booking_sticky", "find_out_why_website_not_booking")}
          className="btn-primary flex flex-[1.25] items-center justify-center rounded-lg py-3 text-center text-[11px] font-bold leading-tight sm:text-xs"
        >
          Why not booking
        </Link>
        <Link
          href={AUDIT_LP_HREF}
          onClick={() => trackCta("website_booking_sticky", "get_my_free_patient_flow_audit")}
          className="flex flex-1 items-center justify-center rounded-lg border border-neutral-300 bg-white py-3 text-center text-xs font-semibold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
        >
          Free audit
        </Link>
      </div>
      <div className="h-14 md:hidden" aria-hidden />
    </div>
  );
}
