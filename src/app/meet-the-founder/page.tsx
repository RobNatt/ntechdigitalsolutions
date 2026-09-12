import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { RelatedLinks } from "@/components/related-links";
import { LogoMark } from "@/components/brand/logo-mark";
import { FOUNDER, INTERVIEW } from "@/lib/interview";

export const metadata: Metadata = {
  title: "Meet the Founder",
  description:
    "Rob Nattrass on twenty years of watching complicated systems get sold to people who can't use them, why the website comes before the invoice, and when not to buy from N-Tech.",
  alternates: { canonical: "/meet-the-founder" },
};

/*
 * The founder page, as an interview conducted by Stuart.
 *
 * The conceit earns its place rather than being a gag: Stuart is the AI
 * receptionist, so a page where he interviews his own founder demonstrates the
 * product while introducing the person. A prospect meets both in one read.
 *
 * TYPOGRAPHY CARRIES THE FORMAT. Stuart's questions are set small, gold and
 * tracked — the same overline treatment used for section labels everywhere else
 * — and the answers sit at full editorial measure in foreground text. The
 * contrast alone says "question, answer" without a single label, avatar or
 * chat bubble. Speaker names are present for screen readers and hidden
 * visually, because a sighted reader can see whose turn it is and a blind one
 * cannot.
 *
 * Marked up as a real <dl>: each question is a <dt> and its answer a <dd>.
 * That is what the pairing actually is, and it is what makes the page parse
 * cleanly for Stuart's own knowledge base — which is built by crawling this
 * site, so how this page is structured decides whether he can quote his
 * founder correctly on a call.
 *
 * THE PHOTO IS OPTIONAL AT BUILD TIME. It is checked on disk rather than
 * imported, so the page builds and deploys whether or not the file has landed
 * yet, and gains the portrait the moment it does. A missing image that breaks
 * a production build is a worse failure than a page that waits for one.
 */

const PHOTO_ON_DISK = existsSync(
  join(process.cwd(), "public", FOUNDER.photo.replace(/^\//, "")),
);

export default function MeetTheFounder() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: FOUNDER.name,
      jobTitle: FOUNDER.title,
      worksFor: {
        "@type": "Organization",
        name: "N-Tech Digital Solutions",
        url: "https://ntechdigital.solutions",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Omaha",
        addressRegion: "NE",
        addressCountry: "US",
      },
    },
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — name and portrait, the portrait bleeding past the section edge. */}
      <section className="surface-dark grain relative isolate overflow-hidden px-6 pb-0 pt-40 md:px-12 md:pt-48 lg:px-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-[-10%] top-[-30%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.16),transparent_62%)] blur-[100px]" />
        </div>

        <div className="mx-auto grid max-w-[1280px] items-end gap-12 lg:grid-cols-12">
          <div className="pb-20 md:pb-28 lg:col-span-7">
            <Reveal trigger="mount" tier="chapter" index={0}>
              <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
                <span aria-hidden="true" className="h-px w-12 bg-cta" />
                Meet the founder
              </p>
            </Reveal>

            <Reveal trigger="mount" tier="chapter" index={1}>
              <h1 className="mt-8 max-w-[14ch] text-display font-heading text-foreground">
                {FOUNDER.name}
              </h1>
            </Reveal>

            <Reveal trigger="mount" tier="chapter" index={2}>
              <p className="mt-4 text-overline uppercase text-cta">
                {FOUNDER.title}
                <span aria-hidden="true" className="mx-3 text-border-strong">
                  /
                </span>
                <span className="text-muted-foreground">
                  {FOUNDER.location}
                </span>
              </p>
            </Reveal>

            <Reveal trigger="mount" tier="chapter" index={3}>
              <p className="mt-10 max-w-[48ch] text-body-lg text-muted-foreground">
                {FOUNDER.standfirst}
              </p>
            </Reveal>
          </div>

          {/*
            The portrait runs to the bottom edge of the dark section and is
            allowed to cross into the section below it — a person standing on
            the seam rather than a headshot in a box.
          */}
          <div className="relative lg:col-span-5 lg:col-start-8">
            <Reveal trigger="mount" tier="chapter" index={2}>
              {PHOTO_ON_DISK ? (
                <Image
                  src={FOUNDER.photo}
                  alt={FOUNDER.photoAlt}
                  /* The real dimensions of the cut-out file. A declared
                     aspect ratio that disagrees with the asset either stretches
                     him or letterboxes him. */
                  width={432}
                  height={873}
                  priority
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  className="mx-auto block w-full max-w-[420px] object-contain"
                />
              ) : (
                /* Waiting on the file. Deliberately not a grey person-shaped
                   silhouette, which reads as broken; this reads as reserved. */
                <div className="mx-auto flex aspect-[3/4] w-full max-w-[420px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border-strong/60">
                  <LogoMark
                    title="N-Tech Digital Solutions"
                    variant="full"
                    className="h-12 w-12 text-cta"
                  />
                  <p className="px-8 text-center text-small text-muted-foreground">
                    Portrait to come.
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* The interview */}
      <section
        aria-labelledby="interview-heading"
        className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20"
      >
        <div className="mx-auto max-w-[1280px]">
          <h2 id="interview-heading" className="sr-only">
            Interview with {FOUNDER.name}
          </h2>

          <div className="mx-auto mb-16 max-w-[860px] md:mb-20">
            <p className="max-w-[52ch] border-l border-cta/40 pl-6 text-body-lg text-foreground">
              {FOUNDER.framing}
            </p>
          </div>

          <dl className="mx-auto max-w-[860px]">
            {INTERVIEW.map(({ q, a }, i) => (
              <Reveal key={q} tier="reveal" index={Math.min(i, 3)}>
                <div className="border-t border-border py-12 md:py-16">
                  <dt>
                    {/* The speaker is named on the page now, not only to screen
                        readers. This page gets shown to prospects in person as a
                        demonstration of what the receptionist knows, so who is
                        asking the questions is the point rather than a detail. */}
                    <span className="flex items-center gap-4 text-overline uppercase text-cta">
                      <span aria-hidden="true" className="h-px w-8 bg-cta" />
                      Stuart
                    </span>
                    {/* Questions were set at overline size and were genuinely
                        hard to read — small, uppercase and heavily tracked is a
                        label treatment, not a reading treatment. They are h3 and
                        sentence case now, which also gives the transcript a
                        proper visual rhythm: a big question, then the answer. */}
                    <span className="mt-4 block max-w-[28ch] text-h3 font-heading text-foreground">
                      {q}
                    </span>
                  </dt>
                  <dd className="mt-8 lg:pl-[12%]">
                    <span className="sr-only">
                      {FOUNDER.name} answers:{" "}
                    </span>
                    {a.map((para, j) => (
                      <p
                        key={j}
                        className={`max-w-[54ch] text-body-lg text-muted-foreground ${
                          j === 0 ? "" : "mt-6"
                        }`}
                      >
                        {para}
                      </p>
                    ))}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="surface-dark grain relative isolate px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_62%)] blur-[100px]" />
        </div>

        <div className="mx-auto max-w-[1280px] text-center">
          <Reveal tier="chapter" index={0}>
            <h2 className="mx-auto max-w-[20ch] text-h1 text-balance font-heading text-foreground">
              You&apos;ve met Stuart. Now talk to the person who built him.
            </h2>
          </Reveal>
          <Reveal tier="chapter" index={1}>
            <p className="mx-auto mt-6 max-w-[52ch] text-body-lg text-muted-foreground">
              Fifteen minutes on the phone with Rob. He&apos;ll tell you
              straight whether this makes sense for your business — including
              when it doesn&apos;t.
            </p>
          </Reveal>
          <Reveal tier="chapter" index={2}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book-a-call"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-cta px-8 py-4 text-body font-medium text-on-cta transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Book a Call
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
              <a
                href="mailto:hello@ntechdigitalsolutions.com"
                className="inline-flex min-h-[24px] items-center text-body text-muted-foreground underline-offset-4 transition-colors duration-[180ms] hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Or email hello@ntechdigitalsolutions.com
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <RelatedLinks
        currentHref="/meet-the-founder"
        links={[
          {
            kind: "Service",
            title: "AI receptionist",
            blurb:
              "Stuart's day job — picking up every call, including the ones you can't take.",
            href: "/services/ai-receptionist",
          },
          {
            kind: "The best offer in the house",
            title: "The Digital Office",
            blurb:
              "Everything in the Foundation, plus the phone answered, the follow-up run and the reputation kept.",
            href: "/packages/digital-office",
          },
          {
            kind: "Reading",
            title: "The missed call is the most expensive thing in your business",
            blurb:
              "The thirteen calls Rob mentions above, worked through properly.",
            href: "/blog/missed-call-math",
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
