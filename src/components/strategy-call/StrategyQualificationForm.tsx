"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { STRATEGY_MONTHLY_REVENUE_OPTIONS } from "@/constants/strategy-call-offer";
import { readAnalyticsClientIds } from "@/lib/analytics/read-client-ids";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { CalendlyInlineWidget } from "@/components/scheduling/CalendlyInlineWidget";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500";

const thankYouPath = `${CONSTANTS.STRATEGY_QUALIFICATION_PATH}/thank-you`;

export function StrategyQualificationForm() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const formStartedRef = useRef(false);
  const qualifiedAnchorRef = useRef<HTMLDivElement | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"form" | "qualified">("form");
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);

  useEffect(() => {
    if (phase !== "qualified" || !calendlyUrl) return;
    const id = requestAnimationFrame(() => {
      qualifiedAnchorRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [phase, calendlyUrl, reduceMotion]);

  function markFormStart() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.FORM_START, {
      surface: "strategy_call",
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const analyticsIds = readAnalyticsClientIds();
      const res = await fetch("/api/strategy-qualification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          businessName,
          monthlyRevenue,
          ...analyticsIds,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        qualified?: boolean;
        calendlyUrl?: string | null;
      };
      if (!res.ok) {
        setError(data.error || "Could not submit. Please try again.");
        return;
      }

      trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.INFO_SUBMIT, {
        surface: "strategy_call",
        status: "submitted",
        qualified: data.qualified === true,
      });

      if (data.qualified === true && data.calendlyUrl) {
        setCalendlyUrl(data.calendlyUrl);
        setPhase("qualified");
        return;
      }

      router.push(thankYouPath);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 pb-20 pt-10 sm:pt-14 lg:pb-28">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent dark:from-sky-500/15" aria-hidden />

      <AnimatePresence mode="wait">
        {phase === "form" ? (
          <motion.div
            key="form"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border border-neutral-200/90 bg-white/90 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.25)] backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80 sm:p-8"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                  Strategy session
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                  A few details before we meet
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
                  This helps us understand if we&apos;re the right fit for your business goals.
                </p>
              </div>
              <div
                className="hidden shrink-0 sm:block"
                aria-hidden
                title="Progress"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                  1/2
                </div>
              </div>
            </div>

            <div
              className="mb-8 h-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"
              role="progressbar"
              aria-valuenow={50}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Qualification progress"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                initial={{ width: "0%" }}
                animate={{ width: "50%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <p className="mb-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              We specialize in{" "}
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                conversion-focused websites
              </span>
              ,{" "}
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                targeted advertising
              </span>
              , and{" "}
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                lead tracking dashboards
              </span>{" "}
              — built as one connected system.
            </p>

            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="strategy-full-name" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    Full name <span className="text-red-600 dark:text-red-400">*</span>
                  </label>
                  <input
                    id="strategy-full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={200}
                    value={fullName}
                    onChange={(ev) => setFullName(ev.target.value)}
                    onFocus={markFormStart}
                    className={inputClass}
                    placeholder="Jordan Smith"
                  />
                </div>
                <div>
                  <label htmlFor="strategy-email" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    Email <span className="text-red-600 dark:text-red-400">*</span>
                  </label>
                  <input
                    id="strategy-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={320}
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    onFocus={markFormStart}
                    className={inputClass}
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="strategy-phone" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    Phone <span className="text-red-600 dark:text-red-400">*</span>
                  </label>
                  <input
                    id="strategy-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    inputMode="tel"
                    value={phone}
                    onChange={(ev) => setPhone(ev.target.value)}
                    onFocus={markFormStart}
                    className={inputClass}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="strategy-business" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    Business name <span className="text-neutral-400 dark:text-neutral-500">(optional)</span>
                  </label>
                  <input
                    id="strategy-business"
                    name="businessName"
                    type="text"
                    maxLength={200}
                    value={businessName}
                    onChange={(ev) => setBusinessName(ev.target.value)}
                    onFocus={markFormStart}
                    className={inputClass}
                    placeholder="Your company"
                  />
                </div>
              </div>

              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Approximate monthly revenue <span className="text-red-600 dark:text-red-400">*</span>
                </legend>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  Self-reported ranges help us match the right engagement model.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {STRATEGY_MONTHLY_REVENUE_OPTIONS.map((opt) => {
                    const selected = monthlyRevenue === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          "relative flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200",
                          selected
                            ? "border-sky-500 bg-sky-50/90 text-sky-950 shadow-[0_0_0_1px_rgba(14,165,233,0.35)] dark:border-sky-500/80 dark:bg-sky-950/40 dark:text-sky-50"
                            : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50/80 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-900/80"
                        )}
                      >
                        <input
                          type="radio"
                          name="monthlyRevenue"
                          value={opt.value}
                          checked={selected}
                          onChange={() => {
                            markFormStart();
                            setMonthlyRevenue(opt.value);
                          }}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 rounded-full border-2",
                            selected
                              ? "border-sky-600 bg-sky-600 shadow-[inset_0_0_0_3px_white] dark:border-sky-400 dark:bg-sky-400 dark:shadow-[inset_0_0_0_3px_rgb(15_23_42)]"
                              : "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900"
                          )}
                          aria-hidden
                        />
                        <span className="leading-snug">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/"
                  className="order-2 text-center text-sm font-medium text-neutral-500 underline-offset-4 hover:text-neutral-800 hover:underline dark:text-neutral-400 dark:hover:text-neutral-200 sm:order-1 sm:text-left"
                >
                  Back to home
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="order-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:order-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="qualified"
            ref={qualifiedAnchorRef}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative space-y-8"
          >
            <div className="rounded-2xl border border-neutral-200/90 bg-white/90 p-6 text-center shadow-[0_24px_80px_-32px_rgba(15,23,42,0.25)] backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80 sm:p-10">
              <div className="mx-auto mb-8 h-1 max-w-xs overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                  initial={{ width: "50%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Qualified
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                You Qualify for a Strategy Session
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                Choose a time below to discuss your growth goals.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
              {calendlyUrl ? (
                <CalendlyInlineWidget eventUrl={calendlyUrl} className="min-h-[700px] w-full" />
              ) : null}
            </div>

            <p className="text-center text-xs text-neutral-500 dark:text-neutral-500">
              Prefer email?{" "}
              <Link href={CONSTANTS.CONTACT_PATH} className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
                Contact us
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
