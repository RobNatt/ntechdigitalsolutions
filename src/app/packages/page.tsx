import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { FaqSection } from "@/components/faq-section";
import { RelatedLinks } from "@/components/related-links";
import { PACKAGES_BY_ORDER } from "@/lib/packages";
import { POSTS_BY_DATE } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Three ways to buy the system: the Digital Foundation, the full Digital Infrastructure, and the Growth Engine. What's in each, and which one fits.",
  alternates: { canonical: "/packages" },
};

/*
 * The packages index.
 *
 * Deliberately NOT a three-column pricing table with a highlighted middle
 * column — that is the single most template-shaped thing on the internet, and
 * there are no prices on this site anyway. It is a stepped ladder instead: each
 * package sits lower and wider than the one above it, so the progression is
 * legible as a progression rather than as three alternatives of equal weight.
 *
 * Order matters and is enforced by `order` in lib/packages.ts. Foundation is
 * first because starting anywhere else is usually the wrong answer, and the
 * Growth Engine page says so in its own FAQ.
 */

const INDEX_FAQS = [
  {
    q: "How do I know which one I need?",
    a: "Start with what is breaking. If enquiries are getting lost or there is no real website, that is the Foundation. If the work is good and the problem is that everything routes through you, that is Digital Infrastructure. If the system already works and the limit is how many people know you exist, that is the Growth Engine.",
  },
  {
    q: "Can I move up later?",
    a: "That is the normal path. Each package contains the one below it, so moving up adds services rather than replacing anything you have already paid to build.",
  },
  {
    q: "Why aren't there prices on this page?",
    a: "Because the honest answer depends on what you already have, and a number on a page cannot account for that. Fifteen minutes on the phone gets you a real one.",
  },
  {
    q: "Can I buy just one piece?",
    a: "Some of them, yes — paid ads and SEO both run standalone. The Foundation does not split, because a website with no CRM behind it and no follow-up in front of it is the exact problem we built it to solve.",
  },
];

export default function PackagesIndex() {
  const latest = POSTS_BY_DATE[0];

  return (
    <main className="flex-1">
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
              Packages
            </p>
          </Reveal>
          <Reveal trigger="mount" tier="chapter" index={1}>
            <h1 className="mt-6 max-w-[20ch] text-display font-heading text-foreground">
              Three ways in. Each one contains the last.
            </h1>
          </Reveal>
          <Reveal trigger="mount" tier="chapter" index={2}>
            <p className="mt-6 max-w-[56ch] text-body-lg text-muted-foreground">
              The services are the parts. These are how they are actually
              bought — and the order matters, because pointing traffic at a
              business that cannot catch it is the most expensive mistake on
              this list.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ul>
            {PACKAGES_BY_ORDER.map((pkg, i) => {
              const Icon = pkg.icon;
              return (
                <Reveal
                  key={pkg.slug}
                  as="li"
                  tier="reveal"
                  index={i}
                  className="border-t border-border py-12 md:py-16"
                >
                  {/* Each rung steps right and the measure widens, so the ladder reads as a progression. */}
                  <div
                    className="grid gap-8 md:grid-cols-12 md:gap-12"
                    style={{ paddingLeft: `calc(${i} * 5%)` }}
                  >
                    <div className="md:col-span-5">
                      <div className="flex items-center gap-4">
                        <span className="flex size-11 items-center justify-center rounded-lg border border-cta/30 bg-cta/10">
                          <Icon
                            aria-hidden="true"
                            className="size-5 text-cta"
                            strokeWidth={1.5}
                          />
                        </span>
                        <span
                          aria-hidden="true"
                          className="select-none font-heading text-h2 leading-none text-transparent"
                          style={{
                            WebkitTextStroke: "1px var(--border-strong)",
                          }}
                        >
                          0{pkg.order}
                        </span>
                      </div>

                      <h2 className="mt-6 text-h2 font-heading text-foreground">
                        <Link
                          href={`/packages/${pkg.slug}`}
                          className="group inline-flex min-h-[24px] items-center gap-3 transition-colors duration-[180ms] hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          {pkg.name}
                          <ArrowRight
                            aria-hidden="true"
                            className="size-5 shrink-0 transition-transform duration-[180ms] group-hover:translate-x-1 motion-reduce:transition-none"
                          />
                        </Link>
                      </h2>
                    </div>

                    <div className="md:col-span-6 md:col-start-7">
                      <p className="max-w-[48ch] text-body-lg text-foreground">
                        {pkg.positioning}
                      </p>
                      <p className="mt-6 max-w-[46ch] text-body text-muted-foreground">
                        <span className="text-overline uppercase text-muted-foreground">
                          Right for you if
                        </span>
                        <br />
                        {pkg.forWho}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <FaqSection faqs={INDEX_FAQS} heading="Choosing between them" />

      <RelatedLinks
        currentHref="/packages"
        links={[
          {
            kind: "The best offer in the house",
            title: "Digital Infrastructure",
            blurb:
              "The whole digital office — the phone answered, the follow-up run, the reputation kept.",
            href: "/packages/digital-infrastructure",
          },
          {
            kind: "Services",
            title: "The individual pieces",
            blurb:
              "What each service is and does, on its own page, in plain terms.",
            href: "/services",
          },
          {
            kind: "Reading",
            title: latest.title,
            blurb: latest.excerpt,
            href: `/blog/${latest.slug}`,
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
