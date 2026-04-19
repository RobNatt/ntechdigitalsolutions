import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { OmahaLocalServiceJsonLd } from "@/components/marketing/OmahaLocalServiceJsonLd";
import { ScheduleCtaLink } from "@/components/scheduling/ScheduleCtaLink";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/digital-marketing-omaha-ne";

const desc =
  "Digital marketing, lead systems, and automation for Omaha and Nebraska businesses — websites, funnels, CRM routing, and follow-up so ad and search traffic turns into booked conversations.";

export const metadata: Metadata = {
  title: "Digital Marketing Omaha, NE | N-Tech Digital Solutions",
  description: desc,
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: ogForPath(PATH, "Digital Marketing Omaha, NE | N-Tech Digital Solutions", desc),
};

const RELATED = [
  { href: "/web-design-omaha-ne", label: "Web design — Omaha" },
  { href: "/omaha-seo", label: "Omaha SEO" },
  { href: "/growth-system", label: "Growth System" },
] as const;

export default function DigitalMarketingOmahaPage() {
  return (
    <>
      <OmahaLocalServiceJsonLd
        path={PATH}
        name="Digital marketing in Omaha, Nebraska"
        description={desc}
        serviceType="Digital marketing, lead generation, marketing automation"
      />
      <MarketingPageShell
        title="Digital marketing in Omaha, Nebraska"
        maxWidthClass="max-w-4xl"
        subtitle="One coherent system from first click to follow-up — not disconnected tools your team forgets to check."
        cta="full"
      >
        <div className="space-y-10">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              What &quot;digital marketing&quot; means here
            </h2>
            <p>
              We use it in the practical sense:{" "}
              <strong className="text-neutral-900 dark:text-white">
                getting qualified attention, earning trust on the page, capturing the lead, and
                making sure someone responds
              </strong>
              . That spans your website, landing pages, organic and local visibility, light
              automation, and the handoff to sales or operations.
            </p>
            <p>
              For Omaha metro businesses, that often pairs a credible local presence (site + GBP +
              reviews) with offers and pages that match how people actually choose vendors in your
              category.
            </p>
          </section>

          <section className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Typical building blocks
            </h2>
            <ul className="list-inside list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>Lead-ready site or funnel pages with clear CTAs</li>
              <li>Form and calendar flows wired to email, SMS, or CRM</li>
              <li>SEO and content that support your services — not generic traffic for its own sake</li>
              <li>Reporting that ties sessions to inquiries and booked calls</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Start local, scale when it works
            </h2>
            <p>
              Many teams begin with a focused rebuild or funnel plus automation, then layer ongoing
              SEO and content. Explore the{" "}
              <Link href="/growth-system" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
                Growth System
              </Link>{" "}
              overview for how we package those phases — or jump to{" "}
              <Link
                href="/services/automation-and-crm"
                className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400"
              >
                automation &amp; CRM
              </Link>{" "}
              if operations are your bottleneck today.
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
