import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { RelatedLinks } from "@/components/related-links";
import { POSTS_BY_DATE } from "@/lib/posts";
import { SERVICES, type Service } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "The N-Tech stack — website, follow-up automations, AI receptionist, social media management and review generation — plus paid ads and SEO/AEO à la carte.",
};

/*
 * The catalogue.
 *
 * Every piece is available on its own — that's the à la carte offer — but the
 * page has to keep making the argument that they're worth more connected, or it
 * becomes a menu and the whole "one system, not five tools" position collapses.
 * So: the pieces are listed as cards, and the section beneath restates the
 * connection rather than letting the grid be the last word.
 *
 * No pricing here. Same reasoning as the home page — price is a conversation.
 * Flagged for Rob rather than decided.
 */

function ServiceGrid({ items }: { items: Service[] }) {
  return (
    <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8">
      {items.map(({ slug, name, icon: Icon, tagline }, i) => (
        <Reveal key={slug} as="li" tier="reveal" index={i} className="group h-full">
          <Link
            href={`/services/${slug}`}
            className="flex h-full flex-col rounded-lg border border-border bg-card p-8 shadow-sm transition-[transform,box-shadow,border-color] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-cta/30 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <Icon aria-hidden="true" className="size-6 text-cta" strokeWidth={1.5} />
            <h3 className="mt-6 text-h3 font-heading text-card-foreground">
              {name}
            </h3>
            <p className="mt-3 max-w-[44ch] flex-1 text-body text-muted-foreground">
              {tagline}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-small font-medium text-cta">
              See how it works
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

export default function ServicesIndex() {
  const core = SERVICES.filter((s) => s.tier === "core");
  const extra = SERVICES.filter((s) => s.tier === "alacarte");

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="surface-dark grain relative isolate overflow-hidden px-6 pb-24 pt-40 md:px-12 md:pb-32 md:pt-48 lg:px-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-[-10%] top-[-30%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.16),transparent_62%)] blur-[100px]" />
        </div>

        <div className="mx-auto max-w-[1280px]">
          <Reveal trigger="mount" tier="chapter" index={0}>
            <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
              <span aria-hidden="true" className="h-px w-12 bg-cta" />
              What we do
            </p>
          </Reveal>
          <Reveal trigger="mount" tier="chapter" index={1}>
            <h1 className="mt-6 max-w-[18ch] text-display font-heading text-foreground">
              Six services. Three ways to buy them.
            </h1>
          </Reveal>
          <Reveal trigger="mount" tier="chapter" index={2}>
            <p className="mt-6 max-w-[56ch] text-body-lg text-muted-foreground">
              Take a package, or take a single piece. Either way they&apos;re
              built to work together — the foundation brings people in, the
              receptionist answers, social keeps you visible, and reviews
              convince the next person.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Packages first — most people want to know what it costs before they
          want to know what each piece does. The a la carte detail follows. */}

      {/* The catalogue, in two groups */}
      <section className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-[1280px] space-y-24">
          <div>
            <Reveal tier="chapter" index={0}>
              <h2 className="text-h2 font-heading text-foreground">
                The stack
              </h2>
            </Reveal>
            <Reveal tier="chapter" index={1}>
              <p className="mt-4 max-w-[54ch] text-body text-muted-foreground">
                The five pieces of The Scalable The Digital Office. Each one
                stands on its own, and they&apos;re built to run together.
              </p>
            </Reveal>
            <ServiceGrid items={core} />
          </div>

          <div>
            <Reveal tier="chapter" index={0}>
              <h2 className="text-h2 font-heading text-foreground">
                Also available
              </h2>
            </Reveal>
            <Reveal tier="chapter" index={1}>
              <p className="mt-4 max-w-[54ch] text-body text-muted-foreground">
                Standalone services, on their own or alongside the stack. They
                work harder when there&apos;s something for them to point at.
              </p>
            </Reveal>
            <ServiceGrid items={extra} />
          </div>
        </div>
      </section>

      {/* The argument against treating this as a menu */}
      <section className="surface-dark grain relative isolate overflow-hidden px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute bottom-[-40%] left-1/2 h-[90vh] w-[90vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.18),transparent_60%)] blur-[110px]" />
        </div>

        <div className="mx-auto max-w-[1280px]">
          <Reveal tier="chapter" index={0}>
            <h2 className="max-w-[20ch] text-h1 text-balance font-heading text-foreground">
              Separately, each piece does less.
            </h2>
          </Reveal>
          <Reveal tier="chapter" index={1}>
            <p className="mt-8 max-w-[56ch] text-body-lg text-muted-foreground">
              A website nobody looks at. A receptionist with no calendar to book
              into. Reviews nobody follows up on. The pieces are useful alone
              and they&apos;re worth more connected — which is the whole idea
              behind running them as one system rather than five subscriptions.
            </p>
          </Reveal>
          <Reveal tier="chapter" index={2}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="/book-a-call"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-cta px-8 py-4 text-body font-medium text-on-cta transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Book a Call
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-border-strong px-8 py-4 text-body font-medium text-foreground transition-[transform,background-color] duration-[180ms] hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                See the whole system
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The catalogue was the one page with no four-way block of its own. */}
      <RelatedLinks
        currentHref="/services"
        links={[
          {
            kind: "The best offer in the house",
            title: "The Digital Office",
            blurb:
              "Everything in the Foundation, plus the phone answered, the follow-up run and the reputation kept.",
            href: "/packages/digital-office",
          },
          {
            kind: "Packages",
            title: "Three ways in",
            blurb:
              "How these services are actually bought, and which one fits.",
            href: "/packages",
          },
          {
            kind: "Reading",
            title: POSTS_BY_DATE[0].title,
            blurb: POSTS_BY_DATE[0].excerpt,
            href: `/blog/${POSTS_BY_DATE[0].slug}`,
          },
          {
            kind: "Talk to us",
            title: "Book a call",
            blurb:
              "Fifteen minutes on the phone. No pressure, nothing to sign today.",
            href: "/book-a-call",
          },
        ]}
      />
    </main>
  );
}
