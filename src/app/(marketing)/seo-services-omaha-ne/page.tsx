import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { OmahaLocalServiceJsonLd } from "@/components/marketing/OmahaLocalServiceJsonLd";
import { ScheduleCtaLink } from "@/components/scheduling/ScheduleCtaLink";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/seo-services-omaha-ne";

const desc =
  "SEO and search visibility for Omaha, Lincoln, and Nebraska businesses — technical foundation, content mapped to intent, Google Business Profile alignment, and reporting tied to leads.";

export const metadata: Metadata = {
  title: "SEO Services Omaha, NE | N-Tech Digital Solutions",
  description: desc,
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: ogForPath(PATH, "SEO Services Omaha, NE | N-Tech Digital Solutions", desc),
};

const RELATED = [
  { href: "/web-design-omaha-ne", label: "Web design — Omaha" },
  { href: "/digital-marketing-omaha-ne", label: "Digital marketing — Omaha" },
  { href: "/services/seo-and-visibility", label: "SEO & visibility (national)" },
] as const;

export default function SeoServicesOmahaPage() {
  return (
    <>
      <OmahaLocalServiceJsonLd
        path={PATH}
        name="SEO services in Omaha, Nebraska"
        description={desc}
        serviceType="Search engine optimization, local SEO, content strategy"
      />
      <MarketingPageShell
        title="SEO services in Omaha, Nebraska"
        maxWidthClass="max-w-4xl"
        subtitle="Help local buyers find you in Google Search and Maps — without ignoring broader organic opportunities if you also sell regionally or online."
        cta="full"
      >
        <div className="space-y-10">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Local + traditional SEO, planned together
            </h2>
            <p>
              Omaha and Lincoln markets still run heavily on{" "}
              <strong className="text-neutral-900 dark:text-white">
                search + referrals + proof
              </strong>
              . We align your site, service pages, and content with the queries your buyers use —
              from &quot;near me&quot; and city-modified searches to broader service topics when
              those matter for your pipeline.
            </p>
            <p>
              That usually means solid on-page structure, internal linking from blogs and service
              pages, technical hygiene (indexing, canonicals, sitemaps, CWV), and a realistic
              publishing rhythm you can sustain.
            </p>
          </section>

          <section className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              What we focus on first
            </h2>
            <ul className="list-inside list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>Keyword and page mapping for money services (not vanity blog-only traffic)</li>
              <li>Alignment between website, GBP categories/services, and NAP consistency</li>
              <li>Measurement: Search Console, analytics, and conversion events you trust</li>
              <li>Refresh cycles based on what&apos;s winning impressions but underperforming CTR</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              GEO (AI visibility) in the mix
            </h2>
            <p>
              Where it helps your brand, we shape FAQs, entity-clear copy, and summaries so you&apos;re
              easier to cite in AI answers — alongside classic rankings. See our broader{" "}
              <Link
                href="/services/seo-and-visibility"
                className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400"
              >
                SEO &amp; visibility
              </Link>{" "}
              page for the full picture.
            </p>
          </section>

          <section className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-400">
              Related
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {RELATED.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="inline-flex rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
              <li>
                <ScheduleCtaLink className="inline-flex rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900">
                  Book a call
                </ScheduleCtaLink>
              </li>
            </ul>
          </section>
        </div>
      </MarketingPageShell>
    </>
  );
}
