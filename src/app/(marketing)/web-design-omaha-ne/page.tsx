import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { OmahaLocalServiceJsonLd } from "@/components/marketing/OmahaLocalServiceJsonLd";
import { ScheduleCtaLink } from "@/components/scheduling/ScheduleCtaLink";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/web-design-omaha-ne";

const desc =
  "Web design and lead-ready websites for Omaha, Lincoln, and the Nebraska metro — fast, mobile-first builds with SEO structure, forms that route to your team, and optional national remote delivery.";

export const metadata: Metadata = {
  title: "Web Design Omaha, NE | N-Tech Digital Solutions",
  description: desc,
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: ogForPath(PATH, "Web Design Omaha, NE | N-Tech Digital Solutions", desc),
};

const RELATED = [
  { href: "/omaha-web-design", label: "Omaha web design (full local landing)" },
  { href: "/omaha-seo", label: "Omaha SEO" },
  { href: "/digital-marketing-omaha-ne", label: "Digital marketing — Omaha" },
  { href: "/services/websites-and-leads", label: "Websites & leads (national)" },
] as const;

export default function WebDesignOmahaPage() {
  return (
    <>
      <OmahaLocalServiceJsonLd
        path={PATH}
        name="Web design in Omaha, Nebraska"
        description={desc}
        serviceType="Web design, landing pages, conversion optimization"
      />
      <MarketingPageShell
        title="Web design in Omaha, Nebraska"
        maxWidthClass="max-w-4xl"
        subtitle="Local and regional projects across the Omaha–Lincoln corridor, with the same systems we use for remote clients nationwide."
        cta="full"
      >
        <div className="space-y-10">
          <p className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            For our dedicated Omaha web design landing (audit-first, FAQs, conversion focus), see{" "}
            <Link href="/omaha-web-design" className="font-semibold text-amber-900 underline-offset-2 hover:underline dark:text-amber-200">
              Omaha web design
            </Link>
            . This page stays for legacy links and short context.
          </p>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Built for businesses that need leads — not just a brochure
            </h2>
            <p>
              Whether you run a home-services company, a professional practice, or a regional brand,
              your site should make it obvious what you do, who you serve, and what happens when
              someone is ready to talk. We structure pages for{" "}
              <strong className="text-neutral-900 dark:text-white">
                search intent, speed, and conversion
              </strong>
              : clear service hierarchy, strong calls to action, and forms that notify the right
              person or CRM.
            </p>
            <p>
              We work in WordPress, Webflow, Shopify (when commerce matters), and custom React/Next
              stacks when performance and flexibility are priorities.
            </p>
          </section>

          <section className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              What Omaha clients typically ask for
            </h2>
            <ul className="list-inside list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>Redesigns that match how buyers actually search (service + city/neighborhood)</li>
              <li>Landing pages for ads, GBP, and referral campaigns</li>
              <li>Core Web Vitals–conscious implementation and on-page SEO baseline</li>
              <li>Handoff and training so your team can update copy and photos safely</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Nebraska metro + national delivery
            </h2>
            <p>
              We&apos;re based in Omaha and routinely work with teams in Lincoln and surrounding
              markets. If you operate in multiple states, we align your local pages and national
              messaging so they don&apos;t compete with each other — and we tie builds to{" "}
              <Link
                href="/services/seo-and-visibility"
                className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400"
              >
                SEO
              </Link>{" "}
              and{" "}
              <Link
                href="/services/automation-and-crm"
                className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400"
              >
                automation
              </Link>{" "}
              when you&apos;re ready.
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
