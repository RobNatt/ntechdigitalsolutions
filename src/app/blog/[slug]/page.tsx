import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { RelatedLinks } from "@/components/related-links";
import { POSTS, getPost } from "@/lib/posts";
import { getService } from "@/lib/services";
import { getPackage } from "@/lib/packages";

/*
 * One post template.
 *
 * Single narrow column, because this is the one place on the site whose job is
 * reading rather than persuading — the asymmetric editorial grid that carries
 * the rest of the site would fight a 4,000-character article. Measure is capped
 * at 68 characters, which is where long-form stops being tiring.
 *
 * Blocks render to real semantic elements — h2, p, ul, blockquote — with no
 * wrapper divs in between. That is not fussiness: Stuart's knowledge base is
 * built by crawling these pages, and a heading that is a styled div is a
 * heading a parser cannot see.
 *
 * The Article JSON-LD does the same job for search and for assistants, telling
 * them what this page is, when it was written and who published it.
 */

export function generateStaticParams() {
  return POSTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const service = getService(post.relatedServiceSlug);
  const pkg = getPackage(post.relatedPackageSlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "N-Tech Digital Solutions",
      url: "https://ntechdigital.solutions",
    },
    publisher: {
      "@type": "Organization",
      name: "N-Tech Digital Solutions",
    },
    mainEntityOfPage: `https://ntechdigital.solutions/blog/${post.slug}`,
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="surface-dark grain relative isolate overflow-hidden px-6 pb-20 pt-40 md:px-12 md:pt-48 lg:px-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-[-10%] top-[-30%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.16),transparent_62%)] blur-[100px]" />
        </div>

        <div className="mx-auto max-w-[760px]">
          <Reveal trigger="mount" tier="chapter" index={0}>
            <Link
              href="/blog"
              className="inline-flex min-h-[24px] items-center gap-2 text-overline uppercase text-muted-foreground transition-colors duration-[180ms] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowLeft aria-hidden="true" className="size-3" />
              All writing
            </Link>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={1}>
            <p className="mt-10 text-overline uppercase text-cta">
              {post.category}
            </p>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={2}>
            <h1 className="mt-6 text-h1 text-balance font-heading text-foreground">
              {post.title}
            </h1>
          </Reveal>

          <Reveal trigger="mount" tier="chapter" index={3}>
            <p className="mt-8 text-small text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true"> · </span>
              {post.readingMinutes} min read
            </p>
          </Reveal>
        </div>
      </section>

      <article className="relative px-6 py-20 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-[68ch]">
          {post.body.map((block, i) => {
            if (block.type === "h2") {
              return (
                <Reveal key={i} tier="reveal">
                  <h2 className="mt-16 text-h3 font-heading text-foreground first:mt-0">
                    {block.text}
                  </h2>
                </Reveal>
              );
            }
            if (block.type === "ul") {
              return (
                <Reveal key={i} tier="reveal">
                  <ul className="mt-8 space-y-3">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-4 text-body-lg text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-3 h-px w-5 shrink-0 bg-cta"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            }
            if (block.type === "quote") {
              return (
                <Reveal key={i} tier="reveal">
                  <blockquote className="my-14 border-l-2 border-cta pl-8">
                    <p className="text-h3 font-heading text-balance text-foreground">
                      {block.text}
                    </p>
                  </blockquote>
                </Reveal>
              );
            }
            return (
              <Reveal key={i} tier="reveal">
                <p className="mt-6 text-body-lg text-muted-foreground first:mt-0">
                  {block.text}
                </p>
              </Reveal>
            );
          })}
        </div>
      </article>

      <RelatedLinks
        currentHref={`/blog/${post.slug}`}
        links={[
          {
            kind: "Service",
            title: service ? service.name : "All services",
            blurb: service
              ? service.tagline
              : "What each piece is and does, in plain terms.",
            href: service ? `/services/${service.slug}` : "/services",
          },
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
