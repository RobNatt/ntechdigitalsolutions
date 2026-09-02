"use client";

import { useRef, useState } from "react";
import { ActivityLog, ActivityRow, ctaPrimary } from "@/components/ntech/primitives";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { readAnalyticsClientIds } from "@/lib/analytics/read-client-ids";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 min-h-11 w-full rounded-lg border border-rule-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink focus:border-action focus:outline-2 focus:outline-offset-0 focus:outline-action";

const labelClass = "block text-[0.875rem] font-medium text-ink";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

type MarketingInquiryFormProps = {
  /** From URL ?plan= (pricing CTAs) */
  planInterest?: string;
  className?: string;
  /** Passed to analytics as `surface` (default: contact). */
  analyticsSurface?: string;
};

export function MarketingInquiryForm({
  planInterest,
  className,
  analyticsSurface = "contact",
}: MarketingInquiryFormProps) {
  const formStartedRef = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "We need a name so we know who we're replying to.";
    if (!email.trim()) errors.email = "We reply by email, so we need an address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "That address is missing an @ or a domain — check it and try again.";
    if (!message.trim())
      errors.message = "Tell us what's going wrong, even in one line. It's what we read first.";
    return errors;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const first = document.getElementById(`inquiry-${Object.keys(errors)[0]}`);
      first?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const sourcePage =
        typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "";
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
          ...readAnalyticsClientIds(),
        }),
      });
      const data = (await res.json()) as { error?: string; hint?: string };
      if (!res.ok) {
        setFormError(
          `${data.error || "That didn't send — nothing was lost, your message is still below."}${
            data.hint ? ` ${data.hint}` : ""
          }`
        );
        return;
      }
      setSentTo(email);
      setDone(true);
      trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.INFO_SUBMIT, {
        surface: analyticsSurface,
        status: "submitted",
        ...(planInterest ? { plan: planInterest } : {}),
      });
      trackClientAnalyticsEvent("inquiry_submit", { surface: analyticsSurface });
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setMessage("");
    } catch {
      setFormError(
        "Your connection dropped before that sent. Nothing was lost — press send again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function onFormFocusCapture() {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.FORM_CLICK, {
      surface: analyticsSurface,
      ...(planInterest ? { plan: planInterest } : {}),
    });
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.FORM_START, {
      surface: analyticsSurface,
      ...(planInterest ? { plan: planInterest } : {}),
    });
  }

  if (done) {
    return (
      <div className={cn("", className)} aria-live="polite">
        <ActivityLog label="Your message, as the system logged it">
          <ActivityRow
            stamp={new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            channel="form"
            action="Message received"
            outcome="Saved to CRM"
            state="done"
          />
          <ActivityRow
            stamp={new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            channel="crm"
            action="Confirmation sent"
            outcome={sentTo}
            state="done"
          />
        </ActivityLog>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-ink">
          A confirmation is on its way to {sentTo}. We read these ourselves and reply by email —
          usually the same day.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="type-data mt-4 text-[0.75rem] text-ink underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
        >
          Send another message
        </button>
      </div>
    );
  }

  function fieldError(key: keyof FieldErrors) {
    const error = fieldErrors[key];
    if (!error) return null;
    return (
      <p id={`inquiry-${key}-error`} className="mt-2 text-[0.8125rem] leading-snug text-ink">
        <span aria-hidden className="mr-1.5 text-[#B4232B]">
          ▲
        </span>
        {error}
      </p>
    );
  }

  return (
    <form
      onFocusCapture={onFormFocusCapture}
      onSubmit={(e) => void onSubmit(e)}
      className={cn("", className)}
      noValidate
    >
      {planInterest ? (
        <p className="mb-5 rounded-lg border border-rule-strong bg-field-sunken px-3.5 py-2.5 text-[0.875rem] text-ink">
          <span className="font-semibold">Interested in:</span>{" "}
          <span className="capitalize">{planInterest.replace(/-/g, " ")}</span>
        </p>
      ) : null}

      <p className="type-data mb-5 text-[0.75rem] text-muted-ink">
        Everything is required except where marked optional.
      </p>

      <label className={labelClass} htmlFor="inquiry-name">
        Your name
      </label>
      <input
        id="inquiry-name"
        name="name"
        className={inputClass}
        autoComplete="name"
        maxLength={200}
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-invalid={Boolean(fieldErrors.name)}
        aria-describedby={fieldErrors.name ? "inquiry-name-error" : undefined}
      />
      {fieldError("name")}

      <label className={cn(labelClass, "mt-5")} htmlFor="inquiry-email">
        Email
      </label>
      <input
        id="inquiry-email"
        name="email"
        type="email"
        className={inputClass}
        autoComplete="email"
        maxLength={320}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={Boolean(fieldErrors.email)}
        aria-describedby={fieldErrors.email ? "inquiry-email-error" : undefined}
      />
      {fieldError("email")}

      <label className={cn(labelClass, "mt-5")} htmlFor="inquiry-company">
        Business name <span className="font-normal text-muted-ink">(optional)</span>
      </label>
      <input
        id="inquiry-company"
        name="company"
        className={inputClass}
        autoComplete="organization"
        maxLength={200}
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <label className={cn(labelClass, "mt-5")} htmlFor="inquiry-phone">
        Phone <span className="font-normal text-muted-ink">(optional)</span>
      </label>
      <input
        id="inquiry-phone"
        name="phone"
        type="tel"
        className={inputClass}
        autoComplete="tel"
        maxLength={40}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label className={cn(labelClass, "mt-5")} htmlFor="inquiry-message">
        What&apos;s leaking — missed calls, follow-up, reviews?
      </label>
      <textarea
        id="inquiry-message"
        name="message"
        rows={4}
        className={cn(inputClass, "min-h-28 resize-y")}
        maxLength={8000}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        aria-invalid={Boolean(fieldErrors.message)}
        aria-describedby={fieldErrors.message ? "inquiry-message-error" : undefined}
      />
      {fieldError("message")}

      {formError ? (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-rule-strong bg-field-sunken px-3.5 py-3 text-[0.875rem] leading-relaxed text-ink"
        >
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className={cn(ctaPrimary, "mt-6 w-full disabled:opacity-60")}
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
