import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { ServiceTopicJsonLd } from "@/components/marketing/ServiceTopicJsonLd";
import { ScheduleCtaLink } from "@/components/scheduling/ScheduleCtaLink";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/services/websites-and-leads";

const desc =
  "High-converting websites and landing pages for U.S. small businesses — structured for search, built to turn visits into qualified leads, with clear handoff to CRM and follow-up.";

export const metadata: Metadata = {
  title: "Websites & Lead-Ready Builds | N-Tech Digital Solutions",
  description: desc,
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: ogForPath(PATH, "Websites & Lead-Ready Builds | N-Tech Digital Solutions", desc),
};

const RELATED = [
  { href: "/services/seo-and-visibility", label: "SEO & search visibility" },
  { href: "/services/automation-and-crm", label: "Automation & CRM" },
] as const;

export default function WebsitesAndLeadsPage() {
  return (
    <>
      <ServiceTopicJsonLd
        path={PATH}
        name="Websites and lead-ready builds"
        description={desc}
        serviceType="Web design, landing pages, conversion optimization"
      />
      <MarketingPageShell
        title="Websites & lead-ready builds"
        maxWidthClass="max-w-4xl"
        subtitle="National and remote-friendly delivery. We focus on pages people actually find, trust, and act on — not brochure sites that look fine but don’t move pipeline."
        cta="full"
      >
        <div className="space-y-14">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              What “lead-ready” means
            </h2>
            <p>
              A lead-ready site lines up <strong className="text-neutral-900 dark:text-white">search intent, messaging, and the next step</strong> (book, call, form, or calendar). That includes fast load times, mobile-first layout, clear service hierarchy, and forms that route somewhere accountable — not into a black hole.
            </p>
            <p>
              We work in the stack that fits your team: modern React/Next builds, WordPress, Webflow, or Shopify when commerce is central. The goal is the same:{" "}
              <strong className="text-neutral-900 dark:text-white">credibility + discoverability + conversion</strong>.
            </p>
          </section>

          <section className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-8">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              What we typically ship
            </h2>
            <ul className="list-inside list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>Information architecture and on-page structure aligned to how buyers search</li>
              <li>Landing pages for campaigns and priority services</li>
              <li>Core Web Vitals–conscious implementation and technical SEO baseline</li>
              <li>Schema and metadata that match each page’s intent</li>
              <li>Handoff documentation so your team can update content safely</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              How this pairs with SEO and automation
            </h2>
            <p>
              Traffic without follow-up still leaks. We design pages so they connect cleanly to{" "}
              <Link href="/services/seo-and-visibility" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
                SEO and content
              </Link>{" "}
              on the front end, and to{" "}
              <Link href="/services/automation-and-crm" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
                automation and CRM routing
              </Link>{" "}
              on the back end — so you can see which pages and sources produce real conversations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do you only work with local businesses?",
                  a: "No. We work with teams across the U.S. Remote delivery is standard; we align messaging to your markets whether they’re regional or national.",
                },
                {
                  q: "Can you improve an existing site instead of rebuilding?",
                  a: "Often yes. If the foundation is sound, we prioritize conversion paths, speed, structure, and tracking first — then recommend rebuilds when that’s the faster path to results.",
                },
                {
                  q: "How do you measure success?",
                  a: "Qualified leads, booked calls, and pipeline contribution — supported by analytics and search visibility trends, not vanity traffic alone.",
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
