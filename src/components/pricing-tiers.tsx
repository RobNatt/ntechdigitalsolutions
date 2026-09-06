"use client";

import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

/*
 * The three tiers.
 *
 * The middle tier is marked "The complete system" rather than "Most popular".
 * Popularity is a claim, and there are no clients yet — a fabricated social
 * proof badge on a site whose stated non-negotiable is honesty in the sales
 * process is exactly the wrong corner to cut. "The complete system" is a fact
 * about what's in it.
 *
 * Ad spend is called out on the third tier in the price line itself, not buried
 * in the feature list. A fee quoted as though it covered spend is how agencies
 * lose trust in month one.
 */

interface Tier {
  name: string;
  price: string;
  cadence: string;
  note?: string;
  summary: string;
  features: string[];
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Digital Foundation",
    price: "$497",
    cadence: "/month",
    summary:
      "The groundwork. A site worth landing on, with somewhere for every lead to go.",
    features: [
      "Fully branded website, built before you sign",
      "CRM holding every lead in one place",
      "Follow-up automations by text and email",
      "Hosting and upkeep handled",
    ],
  },
  {
    name: "Digital Infrastructure",
    price: "$3,000",
    cadence: "/month",
    summary:
      "The whole system. Every piece connected, so nothing falls between them.",
    features: [
      "Everything in Digital Foundation",
      "AI receptionist answering every call",
      "Brand Management",
      "Review generation",
    ],
    featured: true,
  },
  {
    name: "Growth Engine",
    price: "$8,000",
    cadence: "/month",
    note: "plus ad spend, paid directly to Meta and Google",
    summary:
      "Everything running, plus the two channels that bring people to it.",
    features: [
      "Everything in Digital Infrastructure",
      "Paid ads management on Meta and Google",
      "SEO and answer-engine optimisation",
      "Reporting on what actually produced work",
    ],
  },
];

export function PricingTiers() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20"
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal tier="chapter" index={0}>
          <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
            <span aria-hidden="true" className="h-px w-12 bg-cta" />
            Three ways to buy it
          </p>
        </Reveal>
        <Reveal tier="chapter" index={1}>
          <h2
            id="pricing-heading"
            className="mt-8 max-w-[20ch] text-h1 text-balance font-heading text-foreground"
          >
            Start with the foundation, or run the whole thing.
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {TIERS.map(
            ({ name, price, cadence, note, summary, features, featured }, i) => (
              <Reveal key={name} as="li" tier="reveal" index={i} className="h-full">
                <div
                  className={`flex h-full flex-col rounded-lg border p-8 transition-shadow duration-300 ${
                    featured
                      ? "border-cta/40 bg-card shadow-[0_0_0_1px_rgba(161,98,7,0.12),0_12px_40px_rgba(12,10,9,0.10)]"
                      : "border-border bg-card shadow-sm"
                  }`}
                >
                  {featured && (
                    <p className="mb-6 inline-flex w-fit rounded-full bg-cta/10 px-3 py-1 text-overline uppercase text-cta">
                      The complete system
                    </p>
                  )}

                  <h3 className="text-h3 font-heading text-card-foreground">
                    {name}
                  </h3>

                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="font-heading text-h2 leading-none text-foreground">
                      {price}
                    </span>
                    <span className="text-body text-muted-foreground">
                      {cadence}
                    </span>
                  </p>
                  {note && (
                    <p className="mt-2 text-small text-muted-foreground">
                      {note}
                    </p>
                  )}

                  <p className="mt-6 text-body text-muted-foreground">
                    {summary}
                  </p>

                  <ul className="mt-8 flex-1 space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-cta/10">
                          <Check
                            aria-hidden="true"
                            className="size-3 text-cta"
                            strokeWidth={2.5}
                          />
                        </span>
                        <span className="text-small text-card-foreground">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/book-a-call"
                    className={`group mt-10 inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-body font-medium transition-[transform,box-shadow,background-color] duration-[180ms] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                      featured
                        ? "bg-cta text-on-cta hover:shadow-md"
                        : "border border-border-strong text-foreground hover:bg-accent"
                    }`}
                  >
                    Book a Call
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </a>
                </div>
              </Reveal>
            ),
          )}
        </ul>

        <Reveal tier="reveal" index={0}>
          <p className="mt-10 max-w-[68ch] text-small text-muted-foreground">
            Individual services are available on their own as well — see below.
            Nothing here is a contract you sign today; the call is fifteen
            minutes and there&apos;s nothing to commit to on it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
