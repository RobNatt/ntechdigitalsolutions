import Link from "next/link";
import { CONSTANTS } from "@/constants/links";
import { SeoServicesCtaPair } from "@/components/seo-services/SeoServicesCtaPair";

const CONTACT_AUDIT_PATH = `${CONSTANTS.CONTACT_PATH}?plan=${encodeURIComponent("Omaha SEO audit request")}`;

const DELIVERABLES = [
  {
    title: "On-page SEO",
    body: "Service pages, titles, and headings tuned to how Omahans search—by neighborhood, by city, and by the exact work you want to book (not generic filler).",
  },
  {
    title: "Technical SEO",
    body: "Indexation, speed, mobile usability, and crawl paths so Google can trust and serve your site when someone searches from Midtown or West Omaha on a phone.",
  },
  {
    title: "Local SEO",
    body: "Google Business Profile, categories, service areas, and consistency between your site and the map results people use before they call.",
  },
  {
    title: "Content support",
    body: "New or refreshed pages for the services and suburbs you actually cover—written so a local buyer understands why you, not a competitor five miles away.",
  },
  {
    title: "Internal linking",
    body: "A clear path from informational searches to conversion pages so authority and clicks flow to the URLs that generate calls and form fills.",
  },
  {
    title: "Audit and strategy",
    body: "A prioritized roadmap: what to fix first in the Omaha market you serve, what to publish next, and how we will measure leads—not just impressions.",
  },
] as const;

const PROCESS = [
  {
    step: "1",
    title: "Audit",
    body: "We review your site, GBP, competitors in your trade, and the queries that should drive calls in your service area.",
  },
  {
    step: "2",
    title: "Strategy",
    body: "We agree on target pages, suburbs, and services worth winning—scoped to where you actually want trucks, crews, or appointments.",
  },
  {
    step: "3",
    title: "Optimization",
    body: "Technical fixes, on-page updates, and map-layer alignment so Search and Maps reinforce each other.",
  },
  {
    step: "4",
    title: "Content and implementation",
    body: "Ship or refresh pages, internal links, and structured details your team can maintain—without a mystery backlog.",
  },
  {
    step: "5",
    title: "Reporting and refinement",
    body: "Straightforward readouts on visibility, clicks, and conversions, plus what to do next quarter as the metro and your offers evolve.",
  },
] as const;

type OmahaSeoLandingProps = {
  scheduleUrl: string;
  faqItems: readonly { q: string; a: string }[];
};

export function OmahaSeoLanding({ scheduleUrl, faqItems }: OmahaSeoLandingProps) {
  return (
    <div className="bg-neutral-50 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
      <section className="border-b border-emerald-200/60 bg-gradient-to-b from-emerald-50/90 to-white px-4 py-16 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-neutral-950 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-400">
            Omaha · Nebraska metro
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">
            Omaha SEO Services That Bring in More Local Leads
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
            When someone in the Omaha area searches for what you do, they should find you—not a competitor with a cleaner profile and clearer service pages. We help Omaha businesses show up in
            search and maps, then turn that visibility into calls and qualified inquiries.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="omaha_seo_hero"
            className="mt-10 justify-center"
            primaryLabel="Get an Omaha SEO Audit"
          />
          <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-500">
            Same team as our national{" "}
            <Link href="/seo-services" className="font-medium text-emerald-800 underline-offset-2 hover:underline dark:text-emerald-400">
              SEO services
            </Link>
            —this page is built for Omaha intent and local lead flow.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-16 px-4 py-16 sm:px-6 lg:space-y-20 lg:px-8 lg:py-20">
        <section className="space-y-4" aria-labelledby="local-intro">
          <h2 id="local-intro" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Who we help in Omaha
          </h2>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            We work with owners and marketing leads who serve the Omaha metro and nearby towns—whether your trucks roll through Millard and Elkhorn, you book appointments near Midtown and
            Blackstone, or you draw clients from Lincoln and Council Bluffs when that matches how you operate.
          </p>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            Local search visibility matters because most high-intent buyers still start on Google: they compare reviews, scan maps, and open two or three websites before they call. If your
            business is invisible in that moment—or your site does not match what the map promises—you lose the job to whoever looks more credible in ten seconds.
          </p>
        </section>

        <section className="space-y-6" aria-labelledby="includes-heading">
          <h2 id="includes-heading" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            What Omaha SEO services include
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300">
            Every engagement is scoped to your trade and service area. The mix below is how we typically support{" "}
            <strong className="text-neutral-900 dark:text-white">Omaha-focused lead generation</strong>, not a generic checklist copied from a national template.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {DELIVERABLES.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-8" aria-labelledby="why-omaha">
          <h2 id="why-omaha" className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
            Why Omaha businesses need SEO
          </h2>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            Local search behavior is blunt: people type a service plus a place, tap a map result, or add &quot;Omaha&quot; when they want a business that actually serves their neighborhood. Commercial
            and service-based queries—plumbing, legal, dental, remodeling, IT support—come with intent to book. Ranking is not vanity; it is phone calls, form fills, and foot traffic you can
            measure.
          </p>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            Paid ads can buy presence, but organic visibility compounds: strong pages, accurate GBP data, and fast mobile experiences keep working when the campaign budget dips. SEO is how you
            earn a durable share of that intent in the Omaha market.
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="omaha-relevance">
          <h2 id="omaha-relevance" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Omaha market context
          </h2>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            N-Tech is based in the Omaha–Lincoln corridor and works with local service businesses, professional firms, and regional operators that care about how they show up from Benson to
            Papillion—and across the river when Iowa is part of your footprint. We think in drive times, service rings, and the suburbs where your crews actually work, not a one-size national
            keyword list.
          </p>
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/80 p-6 dark:border-neutral-600 dark:bg-neutral-900/30">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-500">Proof placeholder</p>
            <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">Local case metrics (add when approved)</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Replace this block with a named Omaha-area outcome—e.g. map pack movement, call volume from organic, or lead form lift tied to a date range. Until then, we keep this space so the
              page stays easy to update without rewriting the whole layout.
            </p>
          </div>
        </section>

        <section className="space-y-6" aria-labelledby="process-heading">
          <h2 id="process-heading" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            How we work with Omaha clients
          </h2>
          <ol className="space-y-4">
            {PROCESS.map((phase) => (
              <li
                key={phase.step}
                className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-sm font-bold text-white dark:bg-emerald-600"
                  aria-hidden
                >
                  {phase.step}
                </span>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{phase.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{phase.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-emerald-50/40 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20 sm:p-8" aria-labelledby="related-services">
          <h2 id="related-services" className="text-lg font-semibold text-neutral-900 dark:text-white">
            Often paired with Omaha SEO
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            Search brings people to your site; the site and follow-up close the loop. When you are ready to connect visibility to pipeline, these pages are the usual next reads.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li>
              <Link
                href="/web-design-services"
                className="inline-flex rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                Web design services
              </Link>
            </li>
            <li>
              <Link
                href="/services/automation-and-crm"
                className="inline-flex rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                Lead systems &amp; CRM automation
              </Link>
            </li>
            <li>
              <Link
                href="/seo-services"
                className="inline-flex rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                SEO services (national overview)
              </Link>
            </li>
            <li>
              <Link
                href="/about#faq"
                className="inline-flex rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                Company FAQ
              </Link>
            </li>
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Omaha SEO FAQs
          </h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950/60"
              >
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-neutral-950 sm:p-10"
          aria-labelledby="final-cta"
        >
          <h2 id="final-cta" className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
            Get found in Omaha. Then get the call.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Request an Omaha SEO audit to see what is holding back maps and search visibility—or book a discovery call if you already know you want a local growth plan.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="omaha_seo_footer"
            className="mt-8 justify-center"
            primaryLabel="Get an Omaha SEO Audit"
          />
        </section>
      </article>
    </div>
  );
}
