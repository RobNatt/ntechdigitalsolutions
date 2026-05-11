"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  LayoutTemplate,
  Megaphone,
  ShieldCheck,
} from "lucide-react";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import {
  GROWTH_SYSTEM_OFFER_NAME,
  MONTHLY_REVENUE_OPTIONS,
} from "@/constants/growth-system-offer";
import { readAnalyticsClientIds } from "@/lib/analytics/read-client-ids";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { buildCalendlyPrefillUrl } from "@/lib/growth-system/build-calendly-prefill-url";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500";

const faqPlaceholders = [
  {
    q: "Is this only for certain trades?",
    a: "We’re finalizing FAQ copy. This system is built for local and regional service businesses (roofing, HVAC, plumbing, dental practices, and similar) — not e-commerce or restaurants.",
  },
  {
    q: "What if I already have a website?",
    a: "Placeholder: we’ll explain how Step 1 fits whether you need a rebuild or a conversion-focused refresh — copy coming soon.",
  },
  {
    q: "Do you run the ad spend for me?",
    a: "Placeholder: how budgets, accounts, and reporting work — copy coming soon.",
  },
  {
    q: "How long until I see leads?",
    a: "Placeholder: realistic timeline across site, funnel, and traffic — copy coming soon.",
  },
] as const;

export function GrowthSystemFunnel() {
  const formStartedRef = useRef(false);
  const qualifyRef = useRef<HTMLElement | null>(null);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<"idle" | "nurture">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#qualify") {
      requestAnimationFrame(() => {
        qualifyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  function markFormStart() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.FORM_START, {
      surface: "growthsystem",
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const analyticsIds = readAnalyticsClientIds();
      const res = await fetch("/api/growthsystem-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          businessName,
          email,
          phone,
          monthlyRevenue,
          consent,
          ...analyticsIds,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        hint?: string;
        qualified?: boolean;
      };
      if (!res.ok) {
        const hint = data.hint ? ` ${data.hint}` : "";
        setError((data.error || "Could not submit.") + hint);
        return;
      }
      trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.INFO_SUBMIT, {
        surface: "growthsystem",
        status: "submitted",
        qualified: data.qualified === true,
      });

      if (data.qualified === true) {
        const url = buildCalendlyPrefillUrl({ fullName: name, email });
        window.location.assign(url);
        return;
      }

      setOutcome("nurture");
      setName("");
      setBusinessName("");
      setEmail("");
      setPhone("");
      setMonthlyRevenue("");
      setConsent(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (outcome === "nurture") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:py-24">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <Check className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Thanks — we received your details
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          Based on your revenue range, the full{" "}
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            {GROWTH_SYSTEM_OFFER_NAME}
          </span>{" "}
          may not be the right immediate fit — but we still want to help you grow.
        </p>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            Watch your inbox
          </span>
          : we&apos;ll follow up personally. From time to time we extend a{" "}
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            limited-time introductory offer
          </span>{" "}
          for owners who are building toward the next revenue band.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-white to-neutral-50 px-4 pb-16 pt-10 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900 sm:pb-20 sm:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
            For service businesses · Not e-commerce or restaurants
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl sm:leading-tight">
            {GROWTH_SYSTEM_OFFER_NAME}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg">
            A full lead-generating system: authority and positioning, paid and organic traffic, and
            a path that turns visitors into qualified buyers — not a website floating alone.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#qualify"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
              onClick={() =>
                trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
                  placement: "growthsystem_hero",
                  cta: "get_started_now",
                })
              }
            >
              Get Started NOW!
              <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            </a>
            <a
              href="#steps"
              className="inline-flex items-center justify-center rounded-lg border-2 border-sky-700 bg-white/80 px-6 py-3.5 text-base font-semibold text-sky-800 transition hover:bg-white dark:border-sky-500 dark:bg-neutral-900/80 dark:text-sky-300 dark:hover:bg-neutral-900"
              onClick={() =>
                trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
                  placement: "growthsystem_hero",
                  cta: "see_three_steps",
                })
              }
            >
              See the 3 steps
            </a>
          </div>
          <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
            Investment:{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              $7,000
            </span>{" "}
            (50% upfront, 50% before launch) +{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              $1,500/month
            </span>
            .
          </p>
        </div>
      </section>

      <section id="steps" className="mx-auto max-w-5xl scroll-mt-24 px-4 py-14 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Website + funnel",
              body: "Rebuild with lead capture, positioning, services, CTAs, and trust — plus an ad funnel that supports conversion.",
              icon: LayoutTemplate,
            },
            {
              step: "2",
              title: "Lead dashboard",
              body: "Track leads, stages, sources, notes, and follow-ups so nothing slips through after the click.",
              icon: BarChart3,
            },
            {
              step: "3",
              title: "Paid ads + SEO",
              body: "Meta or Google driving traffic while SEO compounds — ad data sharpens the organic strategy over time.",
              icon: Megaphone,
            },
          ].map((card) => (
            <div
              key={card.step}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  {card.step}
                </span>
                <card.icon className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                {card.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <ul className="mx-auto mt-12 max-w-2xl space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
          {[
            "A website alone doesn’t guarantee traffic.",
            "Ads alone don’t guarantee conversions.",
            "A dashboard alone needs the site and traffic to matter.",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-500"
                aria-hidden
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-neutral-200 bg-white px-4 py-14 dark:border-neutral-800 dark:bg-neutral-900 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-semibold text-neutral-900 dark:text-white">
            Questions (FAQ)
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-neutral-500 dark:text-neutral-400">
            Placeholder answers — we&apos;ll replace these with your final objections-led copy.
          </p>
          <dl className="mt-10 space-y-4">
            {faqPlaceholders.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-700 dark:bg-neutral-950"
              >
                <dt className="font-medium text-neutral-900 dark:text-white">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="qualify"
        ref={qualifyRef}
        className="scroll-mt-24 px-4 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Quick qualifying form
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Tell us who you are and where your business is today. If you&apos;re in the right
            revenue band, you&apos;ll go straight to a{" "}
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              30-minute Calendly call
            </span>{" "}
            to discuss the package. Everyone is logged — we follow up either way.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label htmlFor="gs-name" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Your name
              </label>
              <input
                id="gs-name"
                name="name"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={markFormStart}
                className={inputClass}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label
                htmlFor="gs-business"
                className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
              >
                Business name
              </label>
              <input
                id="gs-business"
                name="businessName"
                required
                autoComplete="organization"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onFocus={markFormStart}
                className={inputClass}
                placeholder="Acme HVAC"
              />
            </div>
            <div>
              <label htmlFor="gs-email" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Email
              </label>
              <input
                id="gs-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={markFormStart}
                className={inputClass}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="gs-phone" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Phone
              </label>
              <input
                id="gs-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={markFormStart}
                className={inputClass}
                placeholder="(555) 555-5555"
              />
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                How much revenue are you doing each month?
              </legend>
              <div className="mt-3 space-y-2">
                {MONTHLY_REVENUE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm transition hover:border-sky-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-sky-600",
                      monthlyRevenue === opt.value && "border-sky-600 ring-1 ring-sky-500/40 dark:border-sky-500"
                    )}
                  >
                    <input
                      type="radio"
                      name="monthlyRevenue"
                      value={opt.value}
                      checked={monthlyRevenue === opt.value}
                      onChange={() => {
                        setMonthlyRevenue(opt.value);
                        markFormStart();
                      }}
                      className="h-4 w-4 border-neutral-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-neutral-800 dark:text-neutral-200">{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                onFocus={markFormStart}
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-sky-600 focus:ring-sky-500"
                required
              />
              <span>
                I agree to be contacted about my request and I have read the{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-sky-700 underline underline-offset-2 dark:text-sky-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error ? (
              <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit"}
              {!submitting ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
