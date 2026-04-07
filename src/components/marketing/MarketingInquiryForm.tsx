"use client";

import { useRef, useState } from "react";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { readAnalyticsClientIds } from "@/lib/analytics/read-client-ids";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-400";

type MarketingInquiryFormProps = {
  /** From URL ?plan= (pricing CTAs) */
  planInterest?: string;
  className?: string;
};

export function MarketingInquiryForm({ planInterest, className }: MarketingInquiryFormProps) {
  const formStartedRef = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const sourcePage =
        typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "";
      const analyticsIds = readAnalyticsClientIds();
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          phone,
          message,
          ...(planInterest ? { plan: planInterest } : {}),
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
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setMessage("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        className={cn(
          "rounded-xl border border-emerald-200 bg-emerald-50/90 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/40",
          className
        )}
      >
        <p className="text-lg font-semibold text-emerald-950 dark:text-emerald-100">Thanks — we got it.</p>
        <p className="mt-2 text-sm text-emerald-900/90 dark:text-emerald-200/90">
          We&apos;ll follow up by email shortly.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-4 text-sm font-semibold text-emerald-800 underline underline-offset-4 hover:text-emerald-950 dark:text-emerald-300 dark:hover:text-emerald-100"
        >
          Send another message
        </button>
      </div>
    );
  }

  function onFormFocusCapture() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.FORM_START, {
      surface: "contact",
      ...(planInterest ? { plan: planInterest } : {}),
    });
  }

  return (
    <form
      onFocusCapture={onFormFocusCapture}
      onSubmit={(e) => void onSubmit(e)}
      className={cn("space-y-4", className)}
      noValidate
    >
      {planInterest ? (
        <p className="rounded-lg border border-sky-200 bg-sky-50/90 px-3 py-2 text-sm text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/50 dark:text-sky-100">
          <span className="font-semibold">Package interest:</span>{" "}
          <span className="capitalize">{planInterest.replace(/-/g, " ")}</span>
        </p>
      ) : null}

      <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
        Name <span className="text-red-600 dark:text-red-400">*</span>
        <input
          className={inputClass}
          name="name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
        />
      </label>

      <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
        Email <span className="text-red-600 dark:text-red-400">*</span>
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
        Company
        <input
          className={inputClass}
          name="company"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          maxLength={200}
        />
      </label>

      <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
        Phone
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
        How can we help? <span className="text-red-600 dark:text-red-400">*</span>
        <textarea
          className={cn(inputClass, "min-h-[120px] resize-y")}
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={8000}
          rows={5}
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
        className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
