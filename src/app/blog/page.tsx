import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { RelatedLinks } from "@/components/related-links";
import { POSTS_BY_DATE } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on websites that collect nothing, calls that never get returned, and why we'll talk you out of running ads first.",
  alternates: { canonical: "/blog" },
};

/*
 * The blog index.
 *
 * Editorial list rather than a card grid — a grid of three equal cards is the
 * template shape, and with a handful of posts it also looks empty in a way a
 * list does not. The list scales to fifty posts without redesign.
 *
 * This section exists for two reasons at once. It is the internal-link target
 * every service and package page needs, and it is the part of the site with the
 * most surface area for Stuart's knowledge base — long-form answers to real
 * questions are exactly what a crawler-built KB is short of.
 */

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndex() {
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
              Blog
            </p>
          </Reveal>
          <Reveal trigger="mount" tier="chapter" index={1}>
            <h1 className="mt-6 max-w-[18ch] text-display font-heading text-foreground">
              How this actually works.
            </h1>
          </Reveal>
          <Reveal trigger="mount" tier="chapter" index={2}>
            <p className="mt-6 max-w-[54ch] text-body-lg text-muted-foreground">
              No growth hacks and no statistics we can&apos;t source. Just what
              we see going wrong in businesses this size, and what we do about
              it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ul className="border-t border-border">
            {POSTS_BY_DATE.map((post, i) => (
              <Reveal
                key={post.slug}
                as="li"
                tier="reveal"
                index={i}
                className="border-b border-border"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid gap-4 py-10 transition-colors duration-[180ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:grid-cols-12 md:gap-12 md:py-12"
                >
                  <div className="md:col-span-3">
                    <p className="text-overline uppercase text-cta">
                      {post.category}
                    </p>
                    <p className="mt-3 text-small text-muted-foreground">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden="true"> · </span>
                      {post.readingMinutes} min read
                    </p>
                  </div>

                  <div className="md:col-span-8 md:col-start-5">
                    <h2 className="flex items-start gap-3 text-h3 font-heading text-foreground transition-colors duration-[180ms] group-hover:text-cta">
                      {post.title}
                      <ArrowRight
                        aria-hidden="true"
                        className="mt-1.5 size-4 shrink-0 transition-transform duration-[180ms] group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </h2>
                    <p className="mt-4 max-w-[60ch] text-body text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <RelatedLinks
        currentHref="/blog"
        links={[
          {
            kind: "The best offer in the house",
            title: "Digital Infrastructure",
            blurb:
              "The whole digital office — the phone answered, the follow-up run, the reputation kept.",
            href: "/packages/digital-infrastructure",
          },
          {
            kind: "Packages",
            title: "Three ways in",
            blurb: "How the services are actually bought, and which one fits.",
            href: "/packages",
          },
          {
            kind: "Services",
            title: "The individual pieces",
            blurb: "What each service is and does, in plain terms.",
            href: "/services",
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
