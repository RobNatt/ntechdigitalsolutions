"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import {
  ActivityLog,
  ActivityRow,
  ctaPrimary,
  ctaSecondary,
  type RowChannel,
  Section,
  SectionHeading,
} from "@/components/ntech/primitives";
import { cn } from "@/lib/utils";

/**
 * Slot B's qualify-before-CTA mechanic, transplanted.
 *
 * Gimmick test, re-derived for N-Tech: this business withholds its price during
 * the case-study phase, so there is no price card for the buyer to manipulate.
 * The configurator is what they manipulate instead — and it sends them to the
 * one component that answers their stated problem rather than the top of a
 * five-part page.
 *
 * Laid out questions-left / result-right after seeing Slot B's desktop
 * hierarchy, where the configurator and its outcome sit side by side rather
 * than stacked. It also does what the page claims to do: the pitch arrives as
 * a configured result instead of an offer.
 */
const TRADES = [
  { id: "trades", label: "Trades" },
  { id: "health", label: "Health / Dental" },
  { id: "home", label: "Home services" },
  { id: "other", label: "Something else" },
] as const;

const BREAKS = [
  {
    id: "answer",
    label: "Nobody answers",
    anchor: "ai-receptionist",
    cta: "See how the receptionist handles",
    row: {
      stamp: "7:42 PM",
      channel: "call" as RowChannel,
      action: "Call nobody could take",
      outcome: "Booked Tue 9:00 AM",
    },
  },
  {
    id: "followup",
    label: "Nobody follows up",
    anchor: "lead-automation",
    cta: "See how follow-up runs for",
    row: {
      stamp: "9:15 AM",
      channel: "form" as RowChannel,
      action: "Form submitted",
      outcome: "Confirmed in seconds",
    },
  },
  {
    id: "reviews",
    label: "No reviews come in",
    anchor: "review-automation",
    cta: "See how reviews get asked for at",
    row: {
      stamp: "5:30 PM",
      channel: "review" as RowChannel,
      action: "Job finished, request sent",
      outcome: "5 stars, posted public",
    },
  },
] as const;

type TradeId = (typeof TRADES)[number]["id"];
type BreakId = (typeof BREAKS)[number]["id"];

const TRADE_PHRASE: Record<TradeId, string> = {
  trades: "a trades business",
  health: "a dental practice",
  home: "a home-services business",
  other: "your business",
};

function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: readonly { id: T; label: string }[];
  value: T | null;
  onChange: (id: T) => void;
  name: string;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="type-data mb-3 text-[0.75rem] uppercase text-muted-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[0.9375rem] transition-colors",
                selected
                  ? "border-ink bg-white text-ink"
                  : "border-rule-strong bg-transparent text-muted-ink hover:border-ink hover:text-ink",
                "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-action"
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                  selected ? "border-live bg-live text-ink" : "border-rule-strong"
                )}
              >
                {selected ? <Check className="h-2.5 w-2.5" strokeWidth={3.5} /> : null}
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Configurator() {
  const [trade, setTrade] = useState<TradeId | null>(null);
  const [broken, setBroken] = useState<BreakId | null>(null);

  const chosen = BREAKS.find((b) => b.id === broken);
  const ready = Boolean(trade && chosen);
  const href = chosen ? `/infrastructure#${chosen.anchor}` : "/infrastructure";
  const label = ready && chosen && trade ? `${chosen.cta} ${TRADE_PHRASE[trade]}` : "Learn More";

  return (
    <Section index="02" eyebrow="Two questions" className="bg-field">
      <SectionHeading>Which one is costing you the most right now?</SectionHeading>
      <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-muted-ink">
        Answer both and the row you&apos;d be getting instead appears on the right, with a link
        straight to that part of the system.
      </p>

      <div className="mt-9 grid gap-5 lg:grid-cols-[1fr_24rem] lg:items-start">
        <div className="rounded-xl border border-rule bg-white p-5 shadow-[0_1px_2px_rgba(14,35,64,0.04)] sm:p-7">
          <div className="space-y-7">
            <Segmented
              legend="What's your business?"
              name="ntech-trade"
              options={TRADES}
              value={trade}
              onChange={setTrade}
            />
            <Segmented
              legend="What breaks first?"
              name="ntech-break"
              options={BREAKS}
              value={broken}
              onChange={setBroken}
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center">
            <Link
              href={href}
              aria-label={`${label} — jump to that part of the system`}
              className={ctaPrimary}
            >
              {label}
            </Link>
            <Link href="/book-call" className={cn(ctaSecondary, "whitespace-nowrap")}>
              Book With Us
            </Link>
          </div>
        </div>

        <div aria-live="polite">
          <p className="type-data mb-3 text-[0.75rem] uppercase text-muted-ink">
            {ready ? "What you'd see instead" : "Waiting on both answers"}
          </p>
          {chosen ? (
            <>
              <ActivityLog label="The row this part of the system writes">
                <ActivityRow {...chosen.row} state="done" animate compact />
              </ActivityLog>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-ink">
                {trade
                  ? `That is the row ${TRADE_PHRASE[trade]} gets once this piece is installed.`
                  : "Pick a business type and this gets specific."}
              </p>
            </>
          ) : (
            <ActivityLog label="Your result, once both questions are answered">
              <ActivityRow
                stamp="--:--"
                channel="crm"
                action="Waiting on your answers"
                outcome="—"
                state="pending"
                compact
              />
            </ActivityLog>
          )}
        </div>
      </div>
    </Section>
  );
}
