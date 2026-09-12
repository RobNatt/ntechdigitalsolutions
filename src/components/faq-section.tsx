import { Reveal } from "@/components/motion/reveal";

/*
 * The FAQ that closes every content page.
 *
 * BUILT ON <details>, NOT A JS ACCORDION, and that is the whole design decision.
 * Three things depend on it:
 *
 *  1. Stuart's knowledge base is populated by crawling this site. A crawler
 *     reads the DOM; answers hidden behind a click handler that only renders on
 *     expand are answers he will never have on a call. <details> keeps every
 *     answer in the markup whether it is open or not.
 *  2. Browser find-in-page reaches inside a closed <details>. It cannot reach
 *     into an unmounted React branch.
 *  3. It works with no JavaScript, keyboard-operable, correctly announced, with
 *     no ARIA to get wrong.
 *
 * The JSON-LD block is the same content a second time in FAQPage form. That is
 * what makes the answers eligible to be quoted directly by search and by
 * assistants — the AEO half of the SEO & AEO service, applied to our own site.
 * The two must always say the same thing, which is why both render from one
 * array rather than being maintained separately.
 */

export interface Faq {
  q: string;
  a: string;
}

export function FaqSection({
  faqs,
  heading = "Questions people actually ask",
  lead,
}: {
  faqs: Faq[];
  heading?: string;
  lead?: string;
}) {
  if (faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20"
    >
      <script
        type="application/ld+json"
        // Content is our own copy from lib/, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-4">
          <Reveal tier="chapter" index={0}>
            <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
              <span aria-hidden="true" className="h-px w-12 bg-cta" />
              FAQ
            </p>
          </Reveal>
          <Reveal tier="chapter" index={1}>
            <h2
              id="faq-heading"
              className="mt-6 max-w-[16ch] text-h1 text-balance font-heading text-foreground"
            >
              {heading}
            </h2>
          </Reveal>
          {lead ? (
            <Reveal tier="chapter" index={2}>
              <p className="mt-6 max-w-[42ch] text-body text-muted-foreground">
                {lead}
              </p>
            </Reveal>
          ) : null}
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <ul className="border-t border-border">
            {faqs.map(({ q, a }, i) => (
              <Reveal
                key={q}
                as="li"
                tier="reveal"
                index={i}
                className="border-b border-border"
              >
                <details className="group">
                  <summary className="flex min-h-[24px] cursor-pointer list-none items-baseline justify-between gap-6 py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                    <span className="text-body-lg font-medium text-foreground">
                      {q}
                    </span>
                    {/* Plus that becomes a minus. Rotation only — transform, per the motion rules. */}
                    <span
                      aria-hidden="true"
                      className="relative mt-2 size-3 shrink-0"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border-strong" />
                      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border-strong transition-transform duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-open:rotate-90 motion-reduce:transition-none" />
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-6 text-body text-muted-foreground">
                    {a}
                  </p>
                </details>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
