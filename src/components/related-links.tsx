import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

/*
 * The link block that closes every content page.
 *
 * Rob's rule: every page links internally to at least four others. For a
 * service page he named the four — a package, a specific blog post, the page
 * explaining the best offer in the house, and the booking page — and the same
 * shape holds everywhere else.
 *
 * DE-DUPLICATION IS THE POINT OF THIS COMPONENT, not a nicety. The first
 * version let each page assemble its own four, and on the Digital Foundation
 * package that produced "Digital Infrastructure, Digital Infrastructure, a blog
 * post, book a call" — because the package it sends you to next and the best
 * offer in the house are the same page. On the Digital Infrastructure page it
 * was worse: the best-offer card linked to the page you were already on.
 *
 * So the component takes candidates in priority order and the current page's
 * href, drops anything pointing at the current page, drops any repeat
 * destination, and tops the list back up to four from a fallback pool. A page
 * cannot render fewer than four distinct destinations, and cannot render the
 * same one twice, regardless of what the data says.
 */

export interface RelatedLink {
  /** What kind of thing this is — the overline above the title. */
  kind: string;
  title: string;
  blurb: string;
  href: string;
}

/*
 * Always-valid destinations used to top the list back up when de-duplication
 * leaves fewer than four. Ordered by how useful they are to someone who has
 * just finished reading a page.
 */
const FALLBACKS: RelatedLink[] = [
  {
    kind: "Packages",
    title: "Three ways in",
    blurb: "How the services are actually bought, and which one fits.",
    href: "/packages",
  },
  {
    kind: "Services",
    title: "The individual pieces",
    blurb: "What each service is and does, on its own page, in plain terms.",
    href: "/services",
  },
  {
    kind: "Reading",
    title: "From the blog",
    blurb:
      "Writing on websites that collect nothing and calls that never get returned.",
    href: "/blog",
  },
  {
    kind: "Talk to us",
    title: "Book a call",
    blurb: "Fifteen minutes on the phone. No pressure, nothing to sign today.",
    href: "/book-a-call",
  },
];

export function RelatedLinks({
  links,
  currentHref,
  heading = "Where to go next",
}: {
  /** Candidates in priority order. Duplicates and self-links are removed, not trusted. */
  links: RelatedLink[];
  /** The page this block is rendering on, so it never links to itself. */
  currentHref: string;
  heading?: string;
}) {
  // Exactly four. Rob's floor is four and four is also the ceiling here: a
  // five-card block was the other half of what he flagged, and four fills the
  // two-column grid evenly.
  const seen = new Set<string>([currentHref]);
  const shown: RelatedLink[] = [];

  for (const link of [...links, ...FALLBACKS]) {
    if (shown.length === 4) break;
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    shown.push(link);
  }

  return (
    <section
      aria-labelledby="related-heading"
      className="surface-dark grain relative isolate px-6 py-24 md:px-12 md:py-32 lg:px-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute bottom-[-30%] right-[-10%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_62%)] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-[1280px]">
        <Reveal tier="chapter" index={0}>
          <h2
            id="related-heading"
            className="flex items-center gap-4 text-overline uppercase text-muted-foreground"
          >
            <span aria-hidden="true" className="h-px w-12 bg-cta" />
            {heading}
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {shown.map(({ kind, title, blurb, href }, i) => (
            <Reveal key={href} as="li" tier="reveal" index={i}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-[transform,border-color] duration-[180ms] hover:-translate-y-0.5 hover:border-cta/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="text-overline uppercase text-cta">{kind}</span>
                <span className="mt-4 flex items-center gap-2 text-body-lg font-medium text-card-foreground">
                  {title}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
                <span className="mt-3 text-small text-muted-foreground">
                  {blurb}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
