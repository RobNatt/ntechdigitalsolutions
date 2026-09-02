import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { ctaPrimary, ctaSecondary, Section, SectionHeading } from "@/components/ntech/primitives";

/** Included / excluded, in N-Tech's own words. No figure appears on this page. */
const INCLUDED = [
  "Website with lead form + Call Now button",
  "AI receptionist that answers, books, and logs every call",
  "Lead-form automation: instant CRM entry + confirmation follow-up",
  "Facebook + Instagram management, with engagement-to-lead automation",
  "Google review automation — 5-star public, everything else private feedback",
] as const;

/** Naming the exclusion is more credible than lengthening the inclusion list. */
const EXCLUDED = [
  "Paid ad management and ad spend — a separate add-on, raised after onboarding",
  "A guarantee of leads or revenue — no legitimate operator offers one",
] as const;

export function Cost() {
  return (
    <Section index="05" eyebrow="What it costs" className="bg-field-sunken">
      <SectionHeading>
        One flat monthly retainer.
        <span className="text-muted-ink"> No separate build fee.</span>
      </SectionHeading>

      {/* Contents left, the withholding argument right — Slot B pairs a list
          against its explanation rather than stacking them. */}
      <div className="mt-9 grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className="rounded-xl border border-rule bg-white p-5 shadow-[0_1px_2px_rgba(14,35,64,0.04)] sm:p-7">
          <p className="type-data text-[0.75rem] uppercase text-muted-ink">What the retainer covers</p>
          <ul className="mt-5 space-y-3">
            {INCLUDED.map((line) => (
              <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-live" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="type-data mt-7 text-[0.75rem] uppercase text-muted-ink">Not included</p>
          <ul className="mt-3 space-y-3">
            {EXCLUDED.map((line) => (
              <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted-ink">
                <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-l-2 border-live bg-white py-6 pl-5 pr-5 sm:pl-7 sm:pr-7">
          <p className="type-data text-[0.75rem] uppercase text-muted-ink">Why there is no number</p>
          <h3 className="type-heading mt-3 text-[1.25rem] text-ink">
            We need honest results before we set the rate.
          </h3>
          <p className="mt-4 text-[1rem] leading-relaxed text-muted-ink">
            We could charge per component plus a build fee. We&apos;re choosing not to right now,
            because we need real results from real businesses first. We&apos;re running a limited
            case-study phase — once we have five, pricing moves up for everyone after.
          </p>
          <p className="mt-4 text-[1rem] leading-relaxed text-muted-ink">
            The figure also depends on what you already have in place. You get it on the call, before
            you commit to anything.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/book-call" className={ctaPrimary}>
              Book With Us
            </Link>
            <Link href="/pricing" className={ctaSecondary}>
              Read the full reasoning
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
