"use client";

import { useCallback, useState } from "react";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { PATIENT_FLOW_AUDIT_LP_FAQ } from "@/content/patient-flow-audit-lp-faq";
import { readAnalyticsClientIds } from "@/lib/analytics/read-client-ids";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const PLAN = "free-patient-flow-audit";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-400";

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta });
}

function scrollToForm(placement: string) {
  trackCta(placement, "scroll_to_audit_form");
  document.getElementById("audit-request")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => document.getElementById("pfa-practice-name")?.focus(), 450);
}

function AuditCtaButton({
  placement,
  className,
  variant = "primary",
}: {
  placement: string;
  className?: string;
  variant?: "primary" | "onDark";
}) {
  return (
    <button
      type="button"
      onClick={() => scrollToForm(placement)}
      className={cn(
        "inline-flex h-14 w-full items-center justify-center rounded-xl px-6 text-center text-base font-semibold shadow-sm transition sm:text-lg",
        variant === "primary"
          ? "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 dark:focus-visible:ring-offset-neutral-950"
          : "bg-white text-neutral-950 hover:bg-neutral-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
        className
      )}
    >
      Get My Free Patient Flow Audit
    </button>
  );
}

function buildMessage(payload: {
  websiteUrl: string;
  cityArea: string;
  monthlyGoal: string;
  frustration: string;
  marketingProvider: string;
}) {
  const lines = [
    "Free Patient Flow Audit™ request",
    "",
    `Website: ${payload.websiteUrl.trim() || "—"}`,
    `City / service area: ${payload.cityArea.trim() || "—"}`,
    `Monthly new patient goal: ${payload.monthlyGoal.trim() || "—"}`,
    `Biggest frustration: ${payload.frustration.trim() || "—"}`,
  ];
  if (payload.marketingProvider.trim()) {
    lines.push(`Current marketing provider: ${payload.marketingProvider.trim()}`);
  }
  return lines.join("\n");
}

export function FreePatientFlowAuditLanding() {
  const [practiceName, setPracticeName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [cityArea, setCityArea] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [frustration, setFrustration] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingProvider, setMarketingProvider] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setDone(false);
    setError(null);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = phone.replace(/\D/g, "");
    if (phone.trim() && digits.length < 10) {
      setError("If you add a phone number, include a valid 10-digit number (or leave it blank).");
      return;
    }
    const message = buildMessage({ websiteUrl, cityArea, monthlyGoal, frustration, marketingProvider });
    if (message.length < 10) {
      setError("Please complete the form fields.");
      return;
    }
    setSubmitting(true);
    try {
      const sourcePage =
        typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "";
      const analyticsIds = readAnalyticsClientIds();
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: practiceName.trim(),
          email: email.trim(),
          phone: digits.length >= 10 ? phone.trim() : "",
          message,
          plan: PLAN,
          sourcePage,
          ...analyticsIds,
        }),
      });
      const data = (await res.json()) as { error?: string; hint?: string };
      if (!res.ok) {
        const hint = data.hint ? ` ${data.hint}` : "";
        setError((data.error || "Could not send.") + hint);
        return;
      }
      setDone(true);
      trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.INFO_SUBMIT, {
        surface: "free_patient_flow_audit_lp",
        status: "submitted",
        plan: PLAN,
      });
      trackClientAnalyticsEvent("inquiry_submit", { surface: "free_patient_flow_audit_lp" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-neutral-50 to-white px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-950">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-800 dark:text-sky-400">
            Free Patient Flow Audit™ · Central US dental practices
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl sm:leading-tight lg:text-5xl dark:text-white">
            Find Out Where Your Practice Is Quietly Losing Patients
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
            Our Free Patient Flow Audit™ shows dental practices where revenue leaks happen—through weak websites, poor
            local SEO, broken lead capture, and missed follow-up opportunities.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            No fluff. No vague advice. Just clear diagnosis and next steps.
          </p>
          <div className="mx-auto mt-10 max-w-md">
            <AuditCtaButton placement="pfa_hero" />
            <p className="mx-auto mt-4 max-w-lg text-center text-[11px] font-medium leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-xs">
              Takes 10 minutes · No obligation · No PHI required · No pressure sales call
            </p>
          </div>
        </div>
      </section>

      <section id="what-audit-reveals" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            We Show You What&apos;s Costing You Patients
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            The audit is a structured diagnostic—not a pitch deck. We look for concrete failure points where patients
            abandon, hesitate, or choose a competitor.
          </p>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {[
              "Website conversion path",
              "Local SEO visibility",
              "Google Business Profile performance",
              "Lead capture friction",
              "Missed patient opportunities",
              "Front desk follow-up gaps",
              "Patient trust signals",
              "Booking friction points",
              "Competitor positioning risks",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-200"
              >
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="conversion-not-traffic" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Most Practices Don&apos;t Have a Traffic Problem
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">They Have a Conversion Problem</p>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Patients are already searching. The failure mode is usually trust, clarity, capture, and speed—not raw
            attention. When patients do not convert, do not get followed up with, or pick a competitor who looks easier
            to book, the practice blames “the market” instead of the system.
          </p>
          <p className="mt-6 text-lg font-semibold text-neutral-900 dark:text-white">
            Most practices do not know where this happens. The audit exists to make it visible—and fixable.
          </p>
        </div>
      </section>

      <section id="what-you-receive" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            What You Get From the Audit
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              { t: "Revenue leak analysis", d: "Where money leaves before it hits the schedule." },
              { t: "Website conversion review", d: "What fails on mobile, trust, and clarity in the first seconds." },
              { t: "Local SEO opportunity report", d: "Procedure + geography intent you should win—but may not." },
              { t: "GBP visibility review", d: "How you compare in the local trust layer patients actually use." },
              { t: "Lead capture improvement recommendations", d: "Friction, routing, and confirmation gaps that cap completions." },
              { t: "Booking friction diagnosis", d: "What makes scheduling harder than choosing your competitor." },
              { t: "Highest-priority next steps", d: "A sequence—not a laundry list—so you fix leverage first." },
              { t: "Right-fit growth strategy recommendation", d: "What tier of work matches your diagnosis (if any)." },
            ].map((item) => (
              <li key={item.t} className="flex gap-3 border-b border-neutral-100 pb-4 last:border-0 dark:border-neutral-800">
                <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{item.t}</p>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{item.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="audit-request"
        className="scroll-mt-28 border-y border-neutral-200 bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35"
      >
        <div className="mx-auto max-w-lg">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Request Your Free Patient Flow Audit™
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Short intake—high signal. We use this to prepare a useful diagnosis, not to run a sales script.
          </p>

          {done ? (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50/90 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/40">
              <p className="text-lg font-semibold text-emerald-950 dark:text-emerald-100">You&apos;re in—thank you.</p>
              <p className="mt-2 text-sm text-emerald-900/90 dark:text-emerald-200/90">
                We received your audit request and will follow up by email shortly.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 text-sm font-semibold text-emerald-800 underline underline-offset-4 hover:text-emerald-950 dark:text-emerald-300"
              >
                Submit another practice
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4" noValidate>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Practice name <span className="text-red-600 dark:text-red-400">*</span>
                <input
                  id="pfa-practice-name"
                  className={inputClass}
                  name="practiceName"
                  required
                  autoComplete="organization"
                  value={practiceName}
                  onChange={(e) => setPracticeName(e.target.value)}
                  maxLength={200}
                />
              </label>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Website URL <span className="text-red-600 dark:text-red-400">*</span>
                <input
                  className={inputClass}
                  type="text"
                  inputMode="url"
                  name="websiteUrl"
                  required
                  placeholder="https://yourpractice.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  maxLength={500}
                />
              </label>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                City / service area <span className="text-red-600 dark:text-red-400">*</span>
                <input
                  className={inputClass}
                  name="cityArea"
                  required
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  maxLength={200}
                />
              </label>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Monthly new patient goal <span className="text-red-600 dark:text-red-400">*</span>
                <input
                  className={inputClass}
                  name="monthlyGoal"
                  required
                  placeholder="e.g., 25–40 new patients / month"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  maxLength={120}
                />
              </label>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Current biggest frustration <span className="text-red-600 dark:text-red-400">*</span>
                <textarea
                  className={cn(inputClass, "min-h-[88px] resize-y")}
                  name="frustration"
                  required
                  value={frustration}
                  onChange={(e) => setFrustration(e.target.value)}
                  maxLength={2000}
                  rows={3}
                />
              </label>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Best contact email <span className="text-red-600 dark:text-red-400">*</span>
                <input
                  className={inputClass}
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={320}
                />
              </label>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Phone number <span className="text-neutral-500 dark:text-neutral-400">(optional)</span>
                <input
                  className={inputClass}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={40}
                />
              </label>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Current marketing provider <span className="text-neutral-500 dark:text-neutral-400">(optional)</span>
                <input
                  className={inputClass}
                  name="marketingProvider"
                  value={marketingProvider}
                  onChange={(e) => setMarketingProvider(e.target.value)}
                  maxLength={200}
                />
              </label>

              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-neutral-900 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                {submitting ? "Sending…" : "Get My Free Patient Flow Audit"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section id="who-for" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Built for Dental Practices Ready to Grow
          </h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Best for
          </p>
          <ul className="mt-3 space-y-2 text-base text-neutral-800 dark:text-neutral-200">
            <li>General dentists tightening new patient flow</li>
            <li>Cosmetic and implant practices with high case value</li>
            <li>Family dental offices competing on trust and clarity</li>
            <li>Multi-provider practices that need a consistent intake standard</li>
            <li>Growth-focused owners investing in patient acquisition</li>
          </ul>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Not for
          </p>
          <ul className="mt-3 space-y-2 text-base text-neutral-600 dark:text-neutral-400">
            <li>Free consulting seekers with no intent to improve systems</li>
            <li>Practices chasing the cheapest possible marketing fixes</li>
            <li>Non-dental businesses (this audit is built for dental patient flow)</li>
          </ul>
        </div>
      </section>

      <section id="trust" className="border-y border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            No Sales Games. No Fake Audits. No Generic Advice.
          </h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
            <li>
              <strong className="text-neutral-900 dark:text-white">Built specifically for dentists</strong> — patient
              intent, trust, and booking behavior first.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No pressure sales calls</strong> — diagnosis and fit,
              not ambush closes.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Real financial logic</strong> — leakage framed in
              production reality.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Clear recommendations</strong> — prioritized actions,
              not vague “insights.”
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Patient acquisition focus</strong> — booked patients,
              not vanity metrics.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No PHI required</strong> for the initial audit request.
            </li>
          </ul>
        </div>
      </section>

      <section id="why-us" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Why Most Agencies Miss What&apos;s Actually Broken
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            Many agencies optimize what is easy to report: traffic, rankings, surface-level SEO. Patient acquisition
            breaks in messier places: conversion, booking friction, follow-up systems, trust gaps, and revenue leaks that
            never show up as a single metric.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Typical agency lens</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>Traffic and keyword movement</li>
                <li>Deliverables and dashboards</li>
                <li>Activity-based reporting</li>
              </ul>
            </div>
            <div className="rounded-xl border border-sky-200 bg-white p-5 dark:border-sky-900/50 dark:bg-neutral-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-900 dark:text-sky-400">
                Patient flow lens
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <li>Patient conversion and consult booking</li>
                <li>Follow-up systems and speed-to-lead</li>
                <li>Booked patients as the scoreboard</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-neutral-200 bg-neutral-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-neutral-800 dark:bg-neutral-900/35">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Free dental website audit, patient flow audit, and conversion diagnosis for Central US practices (Nebraska,
            Iowa, Kansas, Missouri, South Dakota, and nearby markets).
          </p>
          <dl className="mt-10 space-y-10">
            {PATIENT_FLOW_AUDIT_LP_FAQ.map((item) => (
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
            <span className="mt-2 block text-lg font-medium text-neutral-300 sm:text-xl">Let&apos;s Make Sure They Book You</span>
          </h2>
          <div className="mx-auto mt-8 max-w-md">
            <AuditCtaButton placement="pfa_final" variant="onDark" />
            <p className="mt-4 text-xs leading-relaxed text-neutral-400">
              10-minute intake · No pressure · No obligation · Built for Central US dental practices
            </p>
          </div>
        </div>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-950/95"
        role="region"
        aria-label="Request audit"
      >
        <button
          type="button"
          onClick={() => scrollToForm("pfa_sticky")}
          className="btn-primary flex w-full items-center justify-center rounded-lg py-3.5 text-sm font-bold"
        >
          Get My Free Patient Flow Audit
        </button>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </div>
  );
}
