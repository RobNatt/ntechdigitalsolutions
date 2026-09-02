import type { ReactNode } from "react";
import Link from "next/link";
import { ChannelChip, ctaPrimary, ctaSecondary, OutcomeBlock } from "@/components/ntech/primitives";
import { cn } from "@/lib/utils";

/**
 * Inner-page shell. Same rail-and-hairline rhythm as the homepage log, without
 * the homepage's running current — those pages are read, not watched.
 */
export function PageShell({
  eyebrow,
  title,
  lede,
  children,
  close = "default",
  width = "max-w-3xl",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
  /** `none` where the page's own content is the conversion (contact, booking). */
  close?: "default" | "none";
  width?: string;
}) {
  return (
    <main id="main" className="bg-field">
      <div className={cn("mx-auto w-full px-4 pb-16 pt-12 sm:px-6 sm:pt-16", width)}>
        <ChannelChip tone="current">{eyebrow}</ChannelChip>
        <h1 className="type-display mt-6 text-[2.25rem] text-ink sm:text-[3rem]">{title}</h1>
        {lede ? (
          <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-muted-ink">{lede}</p>
        ) : null}
        <div className="mt-12">{children}</div>
      </div>

      {close === "default" ? (
        <div className="border-t border-rule bg-field-sunken">
          <div className={cn("mx-auto w-full px-4 py-14 sm:px-6", width)}>
            <OutcomeBlock
              stamp="Next row in your log"
              heading="Fifteen minutes, and you get the retainer figure."
              body="We go through what is leaking in your business today before you decide anything."
            >
              <Link href="/book-call" className={ctaPrimary}>
                Book With Us
              </Link>
              <Link
                href="/infrastructure"
                aria-label="Learn More about what the system includes"
                className={ctaSecondary}
              >
                Learn More
              </Link>
            </OutcomeBlock>
          </div>
        </div>
      ) : null}
    </main>
  );
}
