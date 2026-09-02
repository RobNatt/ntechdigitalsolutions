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
] as const;

export function Cost() {
  return (
    <Section index="05" eyebrow="What it costs" className="bg-field-sunken">
      <SectionHeading>
        One flat monthly retainer.
        <span className="text-muted-ink"> No separate build fee.</span>
      </SectionHeading>

      <div className="mt-9 rounded-xl border border-rule bg-white p-5 shadow-[0_1px_2px_rgba(14,35,64,0.04)] sm:p-7">
        <ul className="space-y-3">
          {INCLUDED.map((line) => (
            <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-live" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-6 space-y-3 border-t border-rule pt-6">
          {EXCLUDED.map((line) => (
            <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted-ink">
              <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-7 max-w-xl text-[1rem] leading-relaxed text-muted-ink">
        We are not posting the number on this page. We are running a limited case-study pricing phase
        to get honest results from real businesses first, and the figure depends on what you already
        have in place. You get it on the call, before you commit to anything.
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link href="/book-call" className={ctaPrimary}>
          Book With Us
        </Link>
        <Link href="/pricing" className={ctaSecondary}>
          Read why the number is withheld
        </Link>
      </div>
    </Section>
  );
}
