import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { ServiceTopicJsonLd } from "@/components/marketing/ServiceTopicJsonLd";
import { ScheduleCtaLink } from "@/components/scheduling/ScheduleCtaLink";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const PATH = "/services/automation-and-crm";

const desc =
  "Lead automation, CRM routing, and follow-up systems for U.S. businesses — so web and ad traffic turns into tracked conversations, reminders, and handoffs your team can rely on.";

export const metadata: Metadata = {
  title: "Automation & CRM Systems | N-Tech Digital Solutions",
  description: desc,
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: ogForPath(PATH, "Automation & CRM Systems | N-Tech Digital Solutions", desc),
};

const RELATED = [
  { href: "/services/websites-and-leads", label: "Websites & lead-ready builds" },
  { href: "/services/seo-and-visibility", label: "SEO & search visibility" },
] as const;

export default function AutomationAndCrmPage() {
  return (
    <>
      <ServiceTopicJsonLd
        path={PATH}
        name="Automation and CRM lead operations"
        description={desc}
        serviceType="Marketing automation, CRM integration, lead routing"
      />
      <MarketingPageShell
        title="Automation & CRM systems"
        maxWidthClass="max-w-4xl"
        subtitle="We connect forms, calendars, SMS, and email to the tools you already use — or help you adopt simpler stacks — so nothing falls through when volume picks up."
        cta="full"
      >
        <div className="space-y-14">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Why automation belongs next to the website
            </h2>
            <p>
              Most “leads” die in the gap between <strong className="text-neutral-900 dark:text-white">submit</strong> and{" "}
              <strong className="text-neutral-900 dark:text-white">someone actually responding</strong>. Automation tightens that gap: instant confirmations, routed notifications, tasks for sales, and sequences that respect opt-in and frequency rules.
            </p>
            <p>
              We implement with your operations in mind — who owns the lead, what fields matter, and how you want handoffs to look when a human steps in.
            </p>
          </section>

          <section className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-8">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Common building blocks
            </h2>
            <ul className="list-inside list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>Form-to-CRM or form-to-sheet flows with deduplication basics</li>
              <li>Pipeline stages that match how you actually qualify work</li>
              <li>Email and SMS follow-up for speed-to-lead (with compliance awareness)</li>
              <li>Calendar booking embeds aligned with your sales process</li>
              <li>Lightweight reporting: source, page, and outcome visibility</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Works with your front-end strategy
            </h2>
            <p>
              The best automation still needs pages worth filling out. We usually pair this work with{" "}
              <Link href="/services/websites-and-leads" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
                lead-ready sites
              </Link>{" "}
              and{" "}
              <Link href="/services/seo-and-visibility" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
                search-driven traffic
              </Link>{" "}
              so volume and quality rise together.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Which CRMs do you support?",
                  a: "We’ve integrated HubSpot, Go High Level, Salesforce-family tools, Pipedrive, and lighter stacks (Sheets, Airtable, Notion-adjacent workflows). If you tell us what you use, we design around it.",
                },
                {
                  q: "Will we be locked into your setup?",
                  a: "No. You own accounts, workflows are documented, and we avoid opaque black boxes so your team or another vendor can maintain what we ship.",
                },
                {
                  q: "Remote delivery?",
                  a: "Yes — workshops and handoffs are remote-first across U.S. time zones.",
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
