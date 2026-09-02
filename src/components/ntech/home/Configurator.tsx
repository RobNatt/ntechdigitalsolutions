"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { ctaPrimary, ctaSecondary, Section, SectionHeading } from "@/components/ntech/primitives";
import { cn } from "@/lib/utils";

/**
 * Slot B's qualify-before-CTA mechanic, transplanted.
 * Gimmick test, re-derived for N-Tech: this business withholds its price during
 * the case-study phase, so there is no price card for the buyer to manipulate.
 * The configurator is what they manipulate instead — and it sends them to the
 * one component that answers their stated problem rather than the top of a
 * five-part page.
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
  },
  {
    id: "followup",
    label: "Nobody follows up",
    anchor: "lead-automation",
    cta: "See how follow-up runs for",
  },
  {
    id: "reviews",
    label: "No reviews come in",
    anchor: "review-automation",
    cta: "See how reviews get asked for at",
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
  const label =
    ready && chosen && trade ? `${chosen.cta} ${TRADE_PHRASE[trade]}` : "Learn More";

  return (
    <Section index="02" eyebrow="Two questions" className="bg-field">
      <SectionHeading>Which one is costing you the most right now?</SectionHeading>
      <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-muted-ink">
        Answer both and the button below takes you straight to that part of the system instead of the
        top of a five-part page.
      </p>

      <div className="mt-9 rounded-xl border border-rule bg-white p-5 shadow-[0_1px_2px_rgba(14,35,64,0.04)] sm:p-7">
        <div className="grid gap-7 sm:grid-cols-2">
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
          <Link href={href} className={ctaPrimary}>
            {label}
          </Link>
          <Link href="/book-call" className={ctaSecondary}>
            Book With Us
          </Link>
        </div>
        <p aria-live="polite" className="sr-only">
          {ready ? `Your selection updated the link to ${label}.` : ""}
        </p>
      </div>
    </Section>
  );
}
