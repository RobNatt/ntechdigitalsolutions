"use client";

import { useState } from "react";
import {
  ActivityLog,
  ActivityRow,
  ChannelChip,
  ctaPrimary,
  Section,
  SectionHeading,
} from "@/components/ntech/primitives";
import { ReceptionistDemoCta } from "@/components/ntech/ReceptionistDemoCta";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { readAnalyticsClientIds } from "@/lib/analytics/read-client-ids";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

/**
 * The site's proof section. N-Tech has no case studies and no testimonials, so
 * instead of asserting the system works, this runs it on the visitor: a real
 * submission to /api/inquiries, and the same two rows the hero showed appending
 * with their own address in them.
 */
const inputClass =
  "mt-1.5 min-h-11 w-full rounded-lg border border-rule-strong bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-muted-ink/70 focus:border-action focus:outline-2 focus:outline-offset-0 focus:outline-action";

function stamp(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function LiveProof() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<{ stamp: string; action: string; outcome: string }[]>([]);
  const [started, setStarted] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Add your name so we know who we're replying to.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email address doesn't look right — check it and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: business,
          message:
            "Submitted the live demonstration form on the N-Tech homepage to see the confirmation run.",
          sourcePage: "/",
          ...readAnalyticsClientIds(),
        }),
      });

      const data = (await response.json()) as { error?: string; hint?: string };
      if (!response.ok) {
        setError(`${data.error || "Could not send that."}${data.hint ? ` ${data.hint}` : ""}`);
        return;
      }

      setRows([
        { stamp: stamp(), action: "Form received", outcome: "Saved to CRM" },
        { stamp: stamp(), action: "Confirmation sent", outcome: email },
      ]);
      trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.INFO_SUBMIT, {
        surface: "home_live_proof",
        status: "submitted",
      });
      setName("");
      setEmail("");
      setBusiness("");
    } catch {
      setError("Network error — nothing was sent. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  function onFirstFocus() {
    if (started) return;
    setStarted(true);
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.FORM_START, { surface: "home_live_proof" });
  }

  const done = rows.length > 0;

  return (
    <Section index="04" eyebrow="Run it on yourself" className="bg-field">
      <SectionHeading>
        This form is live.
        <span className="text-muted-ink"> Put your own email in it and watch the next two rows.</span>
      </SectionHeading>

      <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-muted-ink">
        We are onboarding our first five case-study clients, so there are no testimonials on this page
        to read. Instead of asking you to take the last section on faith, this is the same lead-form
        automation a client gets — pointed at us. You will get a real confirmation email.
      </p>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <form
          onSubmit={(e) => void onSubmit(e)}
          onFocusCapture={onFirstFocus}
          noValidate
          className="rounded-xl border border-rule bg-white p-5 shadow-[0_1px_2px_rgba(14,35,64,0.04)] sm:p-7"
        >
          <label className="block text-[0.875rem] font-medium text-ink" htmlFor="proof-name">
            Your name
          </label>
          <input
            id="proof-name"
            name="name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={200}
            required
          />

          <label className="mt-5 block text-[0.875rem] font-medium text-ink" htmlFor="proof-email">
            Email — this is where the confirmation lands
          </label>
          <input
            id="proof-email"
            name="email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={320}
            required
            aria-describedby={error ? "proof-error" : undefined}
          />

          <label className="mt-5 block text-[0.875rem] font-medium text-ink" htmlFor="proof-business">
            Business name <span className="font-normal text-muted-ink">(optional)</span>
          </label>
          <input
            id="proof-business"
            name="company"
            className={inputClass}
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            autoComplete="organization"
            maxLength={200}
          />

          {error ? (
            <p
              id="proof-error"
              role="alert"
              className="mt-5 rounded-lg border border-rule-strong bg-field-sunken px-3.5 py-2.5 text-[0.875rem] text-ink"
            >
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={submitting} className={cn(ctaPrimary, "mt-6 w-full disabled:opacity-60")}>
            {submitting ? "Sending…" : "Send it and watch the log"}
          </button>
        </form>

        <div>
          <ActivityLog label="Your submission, as the system logs it" live>
            {done ? (
              rows.map((row, i) => (
                <ActivityRow
                  key={row.action}
                  stamp={row.stamp}
                  channel={i === 0 ? "form" : "crm"}
                  action={row.action}
                  outcome={row.outcome}
                  state="done"
                  index={i}
                  animate
                />
              ))
            ) : (
              <>
                <ActivityRow
                  stamp="--:--"
                  channel="form"
                  action="Form received"
                  outcome="Waiting"
                  state="pending"
                />
                <ActivityRow
                  stamp="--:--"
                  channel="crm"
                  action="Confirmation sent"
                  outcome="Waiting"
                  state="pending"
                />
              </>
            )}
          </ActivityLog>

          {done ? (
            <p className="type-data mt-4 flex items-center gap-2 text-[0.75rem] text-ink">
              <ChannelChip tone="current">Done</ChannelChip>
              Check your inbox. That is the whole mechanism — nothing was queued for a human.
            </p>
          ) : (
            <p className="type-data mt-4 text-[0.75rem] text-muted-ink">
              These two rows fill in the moment you submit, with your address in the second one.
            </p>
          )}

          <div className="mt-6">
            <p className="text-[0.9375rem] text-muted-ink">Prefer to just call it?</p>
            <div className="mt-3">
              <ReceptionistDemoCta />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
