import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { ServiceTopicJsonLd } from "@/components/marketing/ServiceTopicJsonLd";
import { ScheduleCtaLink } from "@/components/scheduling/ScheduleCtaLink";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/services/seo-and-visibility";

const desc =
  "SEO and ongoing search visibility for U.S. businesses — technical foundation, content strategy aligned to intent, and measurement tied to leads — not just rankings on paper.";

export const metadata: Metadata = {
  title: "SEO & Search Visibility | N-Tech Digital Solutions",
  description: desc,
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: ogForPath(PATH, "SEO & Search Visibility | N-Tech Digital Solutions", desc),
};

const RELATED = [
  { href: "/services/websites-and-leads", label: "Websites & lead-ready builds" },
  { href: "/services/automation-and-crm", label: "Automation & CRM" },
] as const;

export default function SeoAndVisibilityPage() {
  return (
    <>
      <ServiceTopicJsonLd
        path={PATH}
        name="SEO and search visibility"
        description={desc}
        serviceType="Search engine optimization, content strategy, technical SEO"
      />
      <MarketingPageShell
        title="SEO & search visibility"
        maxWidthClass="max-w-4xl"
        subtitle="Built for businesses that want durable discovery in traditional search — national, regional, or hybrid — with reporting that connects to pipeline, not just impressions."
        cta="full"
      >
        <div className="space-y-14">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              How we think about SEO
            </h2>
            <p>
              Effective SEO matches{" "}
              <strong className="text-neutral-900 dark:text-white">what people search</strong> to{" "}
              <strong className="text-neutral-900 dark:text-white">pages that deserve to rank</strong> — clear intent, strong on-page structure, credible internal linking, and a site Google can crawl efficiently. We don’t chase tricks; we align content and technical basics with how your buyers actually look for solutions.
            </p>
            <p>
              Whether your market is nationwide or a set of regions, the process is similar: prioritize topics that drive commercial outcomes, publish and refresh with consistency, and fix structural issues that cap performance.
            </p>
          </section>

          <section className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-8">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              What we work on
            </h2>
            <ul className="list-inside list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>Keyword and topic mapping tied to services and landing pages</li>
              <li>On-page titles, headings, and content depth matched to intent</li>
              <li>Technical checks: indexation, canonicals, sitemaps, Core Web Vitals hygiene</li>
              <li>Internal linking from blogs, hubs, and service pages to conversion paths</li>
              <li>Analytics and Search Console interpretation focused on qualified traffic</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              GEO (AI visibility) alongside SEO
            </h2>
            <p>
              Traditional SEO and generative-engine visibility overlap but aren’t identical. Where it helps your brand, we align entity-rich copy, FAQs, and authoritative summaries so both search engines and AI systems have clear signals. Your{" "}
              <Link href="/services/websites-and-leads" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
                site structure
              </Link>{" "}
              is the foundation for both.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: "How long until we see movement?",
                  a: "Most sites show meaningful trends in a few months; compounding continues over 6–12 months as content and authority build. Timelines depend on competition, current site health, and how fast we can publish and fix issues.",
                },
                {
                  q: "Do you guarantee rankings?",
                  a: "No — no ethical partner can. We guarantee disciplined execution, transparent reporting, and prioritization tied to business outcomes.",
                },
                {
                  q: "Is this only for local businesses?",
                  a: "No. Local packs matter for some models; for others, national or category-level content is the lever. We scope strategy to where your buyers actually search.",
                },
              ].map((item) => (
                <div
                  key={item.q}
                  className="rounded-xl border border-neutral-200/90 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/60"
                >
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{item.q}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-neutral-200 pt-8 dark:border-neutral-800">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-400">
              Related topics
            </p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {RELATED.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="inline-flex rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
              <li>
                <ScheduleCtaLink className="inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
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
