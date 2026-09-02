import Link from "next/link";
import { ctaPrimary, ctaSecondary, OutcomeBlock, Section } from "@/components/ntech/primitives";

/**
 * The end-of-page CTA. Book With Us leads here and only here — everywhere else
 * on the site it is the secondary to Learn More.
 */
export function Close() {
  return (
    <Section className="bg-field-sunken" bleed>
      <div className="py-14 sm:py-20">
        <OutcomeBlock
          stamp="Next row in your log"
          heading="Booked — and then the system starts catching what you were dropping."
          body="Fifteen minutes. We go through what is leaking in your business today, and you get the retainer figure before you decide anything."
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
    </Section>
  );
}
