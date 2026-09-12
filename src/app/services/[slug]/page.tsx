import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ServiceCurrent } from "@/components/service-current";
import { FaqSection } from "@/components/faq-section";
import { RelatedLinks } from "@/components/related-links";
import { SERVICES, getService } from "@/lib/services";
import { getPackage } from "@/lib/packages";
import { getPost } from "@/lib/posts";

/*
 * One template, eight service pages.
 *
 * The arc is the standard one for every content page on this site: pain, then
 * story, then solution, then the call to action, then the FAQ, then the
 * four-way link block. A package page uses the identical shape — what differs
 * is that a service page answers "what is this and what does it do", where a
 * package page answers "what happens when several of these run together".
 *
 * The block that used to close this page listed the other services — five cards
 * of them, which was both one too many against the four-link rule and a dead
 * end: it sent people sideways forever without ever offering the package, the
 * reading or the call. The RelatedLinks component replaced it and enforces
 * four distinct destinations by construction.
 */

export function generateStaticParams() {
  return SERVICES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.tagline,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const {
    name,
    icon: Icon,
    promise,
    situation,
    how,
    included,
    connects,
    faqs,
  } = service;

  const pkg = getPackage(service.relatedPackageSlug);
  const post = getPost(service.featuredPostSlug);

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
            <Link
              href="/services"
              className="inline-flex min-h-[24px] items-center gap-2 text-overline uppercase text-muted-foreground transition-colors duration-[180ms] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowLeft aria-hidden="true" className="size-3" />
              All services
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal trigger="mount" tier="chapter" index={1}>
                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-lg border border-cta/30 bg-cta/10">
                    <Icon
                      aria-hidden="true"
                      className="size-6 text-cta"
                      strokeWidth={1.5}
                    />
                  </span>
                  <p className="text-overline uppercase text-muted-foreground">
                    {name}
                  </p>
                </div>
              </Reveal>

              <Reveal trigger="mount" tier="chapter" index={2}>
                <h1 className="mt-8 max-w-[20ch] text-display font-heading text-foreground">
                  {promise}
                </h1>
              </Reveal>

              <Reveal trigger="mount" tier="chapter" index={3}>
                <div className="mt-10">
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
                </div>
              </Reveal>
            </div>

            {/* Which package this belongs to — a link, offset from the headline. */}
            {pkg ? (
              <div className="lg:col-span-4 lg:col-start-9 lg:pt-24">
                <Reveal trigger="mount" tier="chapter" index={3}>
                  <div className="border-l border-cta/40 pl-6">
                    <p className="text-overline uppercase text-muted-foreground">
                      Part of
                    </p>
                    <Link
                      href={`/packages/${pkg.slug}`}
                      className="group mt-4 inline-flex min-h-[24px] items-center gap-2 text-body-lg font-medium text-foreground transition-colors duration-[180ms] hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {pkg.name}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                      />
                    </Link>
                    <p className="mt-3 text-small text-muted-foreground">
                      {pkg.positioning}
                    </p>
                  </div>
                </Reveal>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <ServiceCurrent />

        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal tier="chapter" index={0}>
                <h2 className="text-h1 text-balance font-heading text-foreground">
                  {situation.heading}
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
              <Reveal tier="chapter" index={1}>
                <p className="max-w-[52ch] text-body-lg text-muted-foreground">
                  {situation.lead}
                </p>
              </Reveal>
            </div>
          </div>

          <ul className="mt-20 md:mt-24">
            {situation.rows.map(({ n, title, body }, i) => (
              <Reveal
                key={n}
                as="li"
                tier="reveal"
                index={i}
                className="border-t border-border py-12 md:py-16"
              >
                <div
                  className="grid gap-6 md:grid-cols-12 md:gap-12"
                  style={{ paddingLeft: `calc(${i} * 4%)` }}
                >
                  <span
                    aria-hidden="true"
                    className="select-none font-heading text-h1 leading-none text-transparent md:col-span-2"
                    style={{ WebkitTextStroke: "1px var(--border-strong)" }}
                  >
                    {n}
                  </span>
                  <h3 className="text-h3 font-heading text-foreground md:col-span-4">
                    {title}
                  </h3>
                  <p className="max-w-[46ch] text-body text-muted-foreground md:col-span-5 md:col-start-8">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* STORY */}
      <section className="surface-dark grain relative isolate px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_62%)] blur-[100px]" />
        </div>

        <div className="mx-auto max-w-[1280px]">
          <Reveal tier="chapter" index={0}>
            <h2 className="max-w-[18ch] text-h1 text-balance font-heading text-foreground">
              {how.heading}
            </h2>
          </Reveal>

          <ol className="mt-20 grid gap-12 md:grid-cols-3 md:gap-10">
            {how.steps.map(({ n, title, body }, i) => (
              <Reveal key={n} as="li" tier="reveal" index={i}>
                <p className="text-overline uppercase text-cta">{n}</p>
                <span
                  aria-hidden="true"
                  className="mt-4 block h-px w-full bg-border"
                />
                <h3 className="mt-6 text-h3 font-heading text-foreground">
                  {title}
                </h3>
                <p className="mt-4 text-body text-muted-foreground">{body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal tier="chapter" index={0}>
              <h2 className="max-w-[16ch] text-h1 text-balance font-heading text-foreground">
                What&apos;s included
              </h2>
            </Reveal>
            <Reveal tier="chapter" index={1}>
              <p className="mt-8 max-w-[46ch] text-body text-muted-foreground">
                {connects}
              </p>
            </Reveal>
          </div>

          <ul className="space-y-4">
            {included.map((item, i) => (
              <Reveal key={item} as="li" tier="reveal" index={i}>
                <span className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-cta/10">
                    <Check
                      aria-hidden="true"
                      className="size-3.5 text-cta"
                      strokeWidth={2.5}
                    />
                  </span>
                  <span className="text-body text-card-foreground">{item}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="surface-dark grain relative isolate px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-[1280px] text-center">
          <Reveal tier="chapter" index={0}>
            <h2 className="mx-auto max-w-[22ch] text-h1 text-balance font-heading text-foreground">
              Fifteen minutes tells you whether this is the piece you&apos;re
              missing.
            </h2>
          </Reveal>
          <Reveal tier="chapter" index={1}>
            <p className="mx-auto mt-6 max-w-[52ch] text-body-lg text-muted-foreground">
              We&apos;ll look at what you already have and say plainly whether
              this is worth doing — including when the answer is not yet.
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
                Not ready yet? Email hello@ntechdigitalsolutions.com
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        faqs={faqs}
        heading={`${name}, answered`}
        lead="If the question you have isn't here, ask it on the call — we'd rather tell you straight than let you find out later."
      />

      {/* Four distinct destinations, enforced by the component. */}
      <RelatedLinks
        currentHref={`/services/${service.slug}`}
        links={[
          {
            kind: "Package",
            title: pkg ? pkg.name : "All packages",
            blurb: pkg
              ? pkg.positioning
              : "How the services are actually bought.",
            href: pkg ? `/packages/${pkg.slug}` : "/packages",
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
            title: post ? post.title : "From the blog",
            blurb: post ? post.excerpt : "Writing on how this actually works.",
            href: post ? `/blog/${post.slug}` : "/blog",
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
