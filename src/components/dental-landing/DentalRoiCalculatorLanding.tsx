"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { DENTAL_ROI_CALCULATOR_FAQ } from "@/content/dental-roi-calculator-faq";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const AUDIT_HREF = `${CONSTANTS.CONTACT_PATH}?plan=dental-roi-calculator`;

const fmtUsd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? Math.round(n) : 0
  );

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta });
}

function ScrollToCalculatorButton({
  placement,
  className,
  variant = "dark",
}: {
  placement: string;
  className?: string;
  variant?: "dark" | "lightOnDark";
}) {
  const onClick = () => {
    trackCta(placement, "calculate_revenue_leak");
    document.getElementById("roi-calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      document.getElementById("calc-visitors")?.focus();
    }, 400);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl px-6 text-center text-base font-semibold shadow-sm transition sm:text-lg",
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2",
        variant === "dark"
          ? "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-400 focus-visible:ring-offset-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 dark:focus-visible:ring-offset-neutral-950"
          : "border border-white/35 bg-white/10 text-white hover:bg-white/15 focus-visible:ring-white/60 focus-visible:ring-offset-neutral-900",
        className
      )}
    >
      Calculate My Patient Revenue Leak
    </button>
  );
}

function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  id?: string;
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</span>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : min}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value);
          if (Number.isNaN(parsed)) onChange(min);
          else onChange(clamp(parsed, min, max));
        }}
        className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 font-mono text-sm text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-neutral-400"
      />
      <span className="mt-1 block text-xs leading-snug text-neutral-500 dark:text-neutral-400">{hint}</span>
    </label>
  );
}

function SliderField({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  suffix: string;
}) {
  return (
    <div className="block">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</span>
        <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
          {step < 1 ? value.toFixed(1) : Math.round(value)}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        onChange={(e) => onChange(clamp(parseFloat(e.target.value), min, max))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-900 dark:bg-neutral-700 dark:accent-white"
      />
      <p className="mt-1 text-xs leading-snug text-neutral-500 dark:text-neutral-400">{hint}</p>
    </div>
  );
}

export function DentalRoiCalculatorLanding() {
  const [visitors, setVisitors] = useState(2500);
  const [inquiries, setInquiries] = useState(45);
  const [avgNpValue, setAvgNpValue] = useState(1800);
  const [hvCaseValue, setHvCaseValue] = useState(4500);
  const [inquiryLeakPct, setInquiryLeakPct] = useState(28);
  const [hvMissedPerMo, setHvMissedPerMo] = useState(1.5);

  const results = useMemo(() => {
    const safeInq = clamp(inquiries, 0, 1e6);
    const leakFromInquiries = safeInq * (clamp(inquiryLeakPct, 0, 100) / 100) * clamp(avgNpValue, 0, 1e7);
    const leakHighValue = clamp(hvMissedPerMo, 0, 100) * clamp(hvCaseValue, 0, 1e7);
    const monthly = leakFromInquiries + leakHighValue;
    const annual = monthly * 12;
    const recoveryLow = annual * 0.45;
    const recoveryHigh = annual * 0.75;
    const inquiryRate = visitors > 0 ? (safeInq / visitors) * 100 : 0;
    return {
      leakFromInquiries,
      leakHighValue,
      monthly,
      annual,
      recoveryLow,
      recoveryHigh,
      inquiryRate,
    };
  }, [visitors, inquiries, avgNpValue, hvCaseValue, inquiryLeakPct, hvMissedPerMo]);

  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-slate-50 to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-400">
            Revenue protection · Central US dental practices
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            How Much Revenue Is Your Website Quietly Losing Every Month?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            Most dental practices focus on getting more traffic—while losing high-value patients through weak websites,
            poor follow-up, and invisible conversion leaks. This calculator helps you estimate what that may actually be
            costing you.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            This isn&apos;t about &quot;marketing.&quot; It&apos;s about fixing expensive leaks.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xl sm:max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <ScrollToCalculatorButton placement="dental_roi_hero" />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={AUDIT_HREF}
                  onClick={() => trackCta("dental_roi_hero", "free_audit_secondary")}
                  className="inline-flex h-14 w-full items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-center text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 sm:text-lg dark:border-neutral-600 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
                >
                  Get My Free Patient Flow Audit
                </Link>
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-lg text-center text-[11px] font-medium text-neutral-500 dark:text-neutral-400 sm:text-xs">
              Takes 60 seconds · No pressure · Built for dental practices
            </p>
          </div>
        </div>
      </section>

      <section id="the-real-problem" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Revenue Leaks Happen Before the Phone Rings
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Patients leave in silence. They do not send a complaint—they click the next practice. Over a year, those
            micro-decisions become a hole in production that no spreadsheet line item names clearly.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden />
              <span>Your website feels outdated next to stronger competitors.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden />
              <span>Forms and mobile paths add friction right when anxiety is highest.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden />
              <span>Google visibility and GBP trust do not match your clinical quality.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden />
              <span>Follow-up is slow—so high-intent patients book elsewhere within hours.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden />
              <span>Front desk systems miss routing, ownership, and speed-to-lead.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden />
              <span>High-value cases disappear quietly—especially implants and cosmetic consults.</span>
            </li>
          </ul>
          <p className="mt-8 text-lg font-semibold text-neutral-900 dark:text-white">
            Most practices never calculate this. They just feel it—and pay for it in slow months.
          </p>
        </div>
      </section>

      <section
        id="roi-calculator"
        className="scroll-mt-28 border-y border-neutral-200 bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35"
        aria-labelledby="roi-calculator-heading"
      >
        <div className="mx-auto max-w-3xl">
          <h2 id="roi-calculator-heading" className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Let&apos;s Run the Numbers
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Adjust inputs to match your reality. We combine two conservative leaks: inquiries that never become booked
            patients (friction + follow-up), and high-value cases that never enter your schedule due to conversion and
            discovery gaps.
          </p>

          <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-950 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <NumberField
                id="calc-visitors"
                label="Monthly website visitors"
                hint="Approximate sessions or users—whatever you track today."
                value={visitors}
                onChange={setVisitors}
                min={0}
                max={500000}
                step={50}
              />
              <NumberField
                id="calc-inquiries"
                label="New patient inquiries / month"
                hint="Forms, calls counted as new patient intent, chat—your definition."
                value={inquiries}
                onChange={setInquiries}
                min={0}
                max={5000}
                step={1}
              />
              <NumberField
                label="Average new patient value (12 months)"
                hint="Production attributed to a typical new patient in year one."
                value={avgNpValue}
                onChange={setAvgNpValue}
                min={0}
                max={50000}
                step={100}
              />
              <NumberField
                label="High-value case value (implant / cosmetic)"
                hint="Average fee for the procedure family you care about most."
                value={hvCaseValue}
                onChange={setHvCaseValue}
                min={0}
                max={100000}
                step={100}
              />
              <SliderField
                label="Inquiries lost before booking"
                hint="Percent of inquiries that never schedule due to friction, speed, or routing."
                value={inquiryLeakPct}
                onChange={setInquiryLeakPct}
                min={0}
                max={70}
                step={1}
                suffix="%"
              />
              <SliderField
                label="Missed high-value cases / month"
                hint="Qualified implant or cosmetic opportunities you believe you lose to competitors, trust, or speed."
                value={hvMissedPerMo}
                onChange={setHvMissedPerMo}
                min={0}
                max={12}
                step={0.5}
                suffix="/mo"
              />
            </div>

            {visitors > 0 && inquiries > visitors * 3 ? (
              <p className="mt-4 text-xs text-amber-800 dark:text-amber-400">
                Your inquiries look high relative to visitors—double-check definitions so the estimate stays realistic.
              </p>
            ) : null}

            <div className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Estimated leak (illustrative)
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-600 dark:text-neutral-400">Inquiry + follow-up leak</dt>
                  <dd className="font-mono font-semibold text-neutral-900 dark:text-white">
                    {fmtUsd(results.leakFromInquiries)}/mo
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-600 dark:text-neutral-400">High-value case leak</dt>
                  <dd className="font-mono font-semibold text-neutral-900 dark:text-white">
                    {fmtUsd(results.leakHighValue)}/mo
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <dt className="font-medium text-neutral-900 dark:text-white">Potential monthly lost revenue</dt>
                  <dd className="font-mono text-lg font-bold text-rose-700 dark:text-rose-400">
                    {fmtUsd(results.monthly)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-neutral-900 dark:text-white">Potential annual revenue leak</dt>
                  <dd className="font-mono text-lg font-bold text-rose-800 dark:text-rose-400">
                    {fmtUsd(results.annual)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-3 dark:bg-neutral-900/80">
                  <dt className="text-neutral-700 dark:text-neutral-300">
                    Estimated recovery opportunity (if 45–75% is recoverable)
                  </dt>
                  <dd className="text-right font-mono text-sm font-semibold text-emerald-800 dark:text-emerald-400">
                    {fmtUsd(results.recoveryLow)} – {fmtUsd(results.recoveryHigh)} /yr
                  </dd>
                </div>
              </dl>
              {visitors > 0 ? (
                <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                  Implied inquiry rate:{" "}
                  <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                    {results.inquiryRate.toFixed(2)}%
                  </span>{" "}
                  of visitors → inquiries. If that feels low for your market, your visitor-side leak may be larger than
                  this model shows.
                </p>
              ) : null}
              <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                Not financial advice. Estimates depend on your inputs and definitions. The Patient Flow Audit replaces
                guessing with a prioritized leak map.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href={AUDIT_HREF}
                onClick={() => trackCta("dental_roi_post_calc", "free_audit")}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 sm:text-base"
              >
                Get My Free Patient Flow Audit
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="financial-examples" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Even Small Leaks Become Big Numbers
          </h2>
          <div className="mt-8 space-y-6 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/40">
              <p className="font-semibold text-neutral-900 dark:text-white">Implant / full-arch math</p>
              <p className="mt-2">
                If one implant case averages <strong className="text-neutral-950 dark:text-white">$4,500+</strong> and
                you miss just <strong className="text-neutral-950 dark:text-white">2 qualified patients per month</strong>
                , that is{" "}
                <strong className="text-rose-700 dark:text-rose-400">$108,000+ per year</strong> from one invisible
                conversion problem—not counting referrals those patients would have generated.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/40">
              <p className="font-semibold text-neutral-900 dark:text-white">New patient hygiene + restorative mix</p>
              <p className="mt-2">
                If a booked new patient averages <strong className="text-neutral-950 dark:text-white">$1,800</strong> in
                year-one production and you lose <strong className="text-neutral-950 dark:text-white">10 inquiries</strong>{" "}
                per month to speed and follow-up, that is{" "}
                <strong className="text-rose-700 dark:text-rose-400">$216,000/year</strong>—without touching ad spend.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/40">
              <p className="font-semibold text-neutral-900 dark:text-white">Cosmetic consult drop-off</p>
              <p className="mt-2">
                High-ticket cosmetic consults are rare and fragile. Losing{" "}
                <strong className="text-neutral-950 dark:text-white">one consult per month</strong> at{" "}
                <strong className="text-neutral-950 dark:text-white">$6,000 average case value</strong> is{" "}
                <strong className="text-rose-700 dark:text-rose-400">$72,000/year</strong>—often explained away as
                &quot;the market&quot; instead of funnel reality.
              </p>
            </div>
          </div>
          <p className="mt-8 text-lg font-semibold text-neutral-900 dark:text-white">
            Dentists buy math. These numbers are why revenue protection comes before &quot;more traffic.&quot;
          </p>
        </div>
      </section>

      <section id="where-losses-happen" className="border-y border-neutral-200 bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Where Most Practices Lose Patients
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Use this as a self-diagnostic. The more boxes feel true, the more likely your calculator output is directionally
            right—not noise.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Poor website trust signals above the fold",
              "Weak or generic landing pages for high-intent services",
              "No dedicated patient funnels for implants / cosmetic",
              "Weak GBP visibility vs competitors in the same ZIP",
              "Bad on-page SEO structure for procedure + city intent",
              "Lead capture that adds friction (fields, speed, clarity)",
              "No automated follow-up after hours",
              "Conversion strategy that does not match real patient anxiety",
            ].map((line) => (
              <li
                key={line}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="solution-audit" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            This Is Exactly What the Patient Flow Audit Fixes
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            The audit is a prioritized diagnosis—not a sales ambush. We look for the leaks that cost the most with the
            least debate: where patients abandon, where follow-up fails, where local visibility does not match your
            clinical reality, and where your funnel punishes high-value intent.
          </p>
          <ul className="mt-8 space-y-3 text-base font-medium text-neutral-800 dark:text-neutral-200">
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Revenue leaks tied to measurable patient behaviors
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Missed opportunities in capture, routing, and speed-to-lead
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Local SEO and GBP gaps that cap discovery
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Conversion bottlenecks on mobile and high-intent pages
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              Follow-up failures that quietly erase consults
            </li>
          </ul>
          <p className="mt-8 text-base font-medium text-neutral-900 dark:text-white">
            Then we show the highest-leverage fix first—practical sequencing, not a laundry list designed to sell
            everything at once.
          </p>
        </div>
      </section>

      <section id="trust" className="border-y border-neutral-200 bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Guesswork. No Vanity Reports. Just Clear Numbers.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Real ROI logic</strong> — estimates grounded in
              patient economics, not impressions.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No pressure sales</strong> — audit first, priorities
              second, fit third.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Dental-specific strategy</strong> — Central US
              markets, procedure intent, and booking psychology.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No fake lead promises</strong> — we do not guarantee
              rankings; we quantify leakage and fix systems.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Patient acquisition focus</strong> — the schedule is
              the scoreboard.
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
            Dental ROI calculator, website revenue loss, and patient acquisition ROI for Nebraska, Iowa, Kansas, Missouri,
            South Dakota, and nearby Central US dental markets.
          </p>
          <dl className="mt-10 space-y-10">
            {DENTAL_ROI_CALCULATOR_FAQ.map((item) => (
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
            If You&apos;re Losing Just One High-Value Patient Per Month…
            <span className="mt-2 block text-xl sm:text-2xl">That&apos;s Already Expensive</span>
          </h2>
          <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={AUDIT_HREF}
              onClick={() => trackCta("dental_roi_final", "free_audit")}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 sm:text-base"
            >
              Get My Free Patient Flow Audit
            </Link>
            <ScrollToCalculatorButton
              placement="dental_roi_final"
              variant="lightOnDark"
              className="h-12 !text-sm sm:!text-base"
            />
          </div>
          <p className="mt-5 text-xs text-neutral-400">
            60-second estimate · No obligation · Built for Central US dental practices · Focused on real revenue
          </p>
        </div>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-950/95"
        role="region"
        aria-label="ROI calculator actions"
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              trackCta("dental_roi_sticky", "scroll_calculator");
              document.getElementById("roi-calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="flex-1 rounded-lg border border-neutral-300 bg-white py-3 text-xs font-semibold text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
          >
            Calculator
          </button>
          <Link
            href={AUDIT_HREF}
            onClick={() => trackCta("dental_roi_sticky", "free_audit")}
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
