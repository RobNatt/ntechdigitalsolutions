import Link from "next/link";
import { CONSTANTS } from "@/constants/links";
import { SeoServicesCtaPair } from "@/components/seo-services/SeoServicesCtaPair";

const CONTACT_AUDIT_PATH = `${CONSTANTS.CONTACT_PATH}?plan=${encodeURIComponent("SEO audit request")}`;

const DELIVERABLES = [
  {
    title: "Strategy & priorities",
    body: "We map what your buyers search for, which pages should win those queries, and what to fix first so effort matches revenue—not random blog volume.",
  },
  {
    title: "On-page SEO",
    body: "Titles, headings, intent-matched copy, and structured pages so both people and search engines understand what you offer on each URL.",
  },
  {
    title: "Technical SEO",
    body: "Crawlability, indexation, canonicals, sitemaps, Core Web Vitals hygiene, and fixes that remove invisible ceilings on performance.",
  },
  {
    title: "Content support",
    body: "New service and hub pages, refreshes for pages that should rank but do not, and briefs your team can run with—aligned to search intent.",
  },
  {
    title: "Internal linking",
    body: "A sensible link mesh from blogs and supporting content into money pages so authority and discovery flow where conversions happen.",
  },
  {
    title: "Local SEO (when it fits)",
    body: "Google Business Profile, local landing pages, and consistency for service-area businesses competing in maps and “near me” intent.",
  },
] as const;

const PROCESS = [
  {
    step: "1",
    title: "Audit",
    body: "We review technical health, current visibility, competitors, and conversion paths so we know what is broken and what will move the needle.",
  },
  {
    step: "2",
    title: "Strategy",
    body: "We agree on topics, pages, and timelines tied to leads—not a generic keyword list disconnected from your sales process.",
  },
  {
    step: "3",
    title: "Implementation",
    body: "On-page updates, technical fixes, content shipped or refreshed, and local assets updated where they matter.",
  },
  {
    step: "4",
    title: "Optimization",
    body: "We iterate on what the data shows: underperforming pages, new queries worth owning, and structural gaps as your market shifts.",
  },
  {
    step: "5",
    title: "Reporting & next steps",
    body: "Clear readouts on qualified traffic, visibility changes, and recommended next priorities—so you always know what is next and why.",
  },
] as const;

const PLACEHOLDER_RESULTS = [
  {
    headline: "Client outcome slot 1",
    metric: "—",
    detail: "Replace with a concrete metric (e.g. organic leads per month, booked calls from organic).",
  },
  {
    headline: "Client outcome slot 2",
    metric: "—",
    detail: "Replace with period-over-period visibility or traffic lift tied to a campaign or page cluster.",
  },
  {
    headline: "Client outcome slot 3",
    metric: "—",
    detail: "Replace with a revenue- or pipeline-linked win your team can share publicly.",
  },
] as const;

type SeoServicesLandingProps = {
  scheduleUrl: string;
  faqItems: readonly { q: string; a: string }[];
};

export function SeoServicesLanding({ scheduleUrl, faqItems }: SeoServicesLandingProps) {
  return (
    <div className="bg-neutral-50 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
      <section className="border-b border-neutral-200 bg-white px-4 py-16 dark:border-neutral-800 dark:bg-neutral-950 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-400">
            SEO services
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">
            SEO Services That Drive More Qualified Leads
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
            SEO is how your business shows up when people search for what you sell. We improve visibility, traffic quality, and the path from search
            results to a real conversation—so growth is measurable, not mysterious.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="seo_services_hero"
            className="mt-10 justify-center"
          />
          <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-500">
            Prefer email first?{" "}
            <Link href={CONTACT_AUDIT_PATH} className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
              Request an SEO audit
            </Link>{" "}
            — we reply within one business day.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-16 px-4 py-16 sm:px-6 lg:space-y-20 lg:px-8 lg:py-20">
        <section className="space-y-4" aria-labelledby="what-seo-means">
          <h2 id="what-seo-means" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            What SEO services are (in plain language)
          </h2>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            <strong className="text-neutral-900 dark:text-white">Search engine optimization</strong> is the work of making your website the best
            answer for the searches that matter to your business—so Google is more likely to show you, and visitors are more likely to trust you and
            reach out. It is not one trick; it is ongoing alignment between your offers, your content, your site’s technical health, and how real
            people look for help online.
          </p>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            For small and local businesses, that usually means clearer service pages, stronger local signals, faster pages, and content that matches
            what your customers type into the search bar—not generic filler.
          </p>
        </section>

        <section className="space-y-6" aria-labelledby="deliverables-heading">
          <div>
            <h2 id="deliverables-heading" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              What our SEO services include
            </h2>
            <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
              One primary engagement: <strong className="text-neutral-900 dark:text-white">SEO services</strong> scoped to your market. Deliverables
              flex by industry, but the core levers stay consistent.
            </p>
          </div>
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
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            For how we layer <strong className="text-neutral-900 dark:text-white">AI visibility and GEO</strong> with traditional SEO, see our{" "}
            <Link href="/services/seo-and-visibility" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
              SEO &amp; search visibility
            </Link>{" "}
            topic guide—same team, expanded framing for entity-rich copy and durable discovery.
          </p>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-8" aria-labelledby="who-for">
          <h2 id="who-for" className="text-xl font-semibold text-neutral-900 dark:text-white">
            Who this is for
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
            <li>Small businesses that depend on inbound interest—not brand-only traffic.</li>
            <li>Local service businesses (trades, professional services, clinics) competing in maps and city-level search.</li>
            <li>Teams that want more visibility and leads without guessing what to publish next.</li>
          </ul>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            Serving the Omaha metro and Lincoln region in person, with the same SEO systems for remote clients nationwide.{" "}
            <Link href="/omaha-seo" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
              Omaha SEO services
            </Link>
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="why-us">
          <h2 id="why-us" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Why work with N-Tech
          </h2>
          <ul className="space-y-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
            <li>
              <strong className="text-neutral-900 dark:text-white">Clarity first.</strong> You should understand what we are doing and why—without
              jargon walls.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Strategy tied to leads.</strong> We prioritize pages and topics that connect to
              revenue, not vanity metrics on keywords that never convert.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Measurable outcomes.</strong> Rankings and traffic matter when they reflect
              qualified demand. We report in that frame.
            </li>
          </ul>
        </section>

        <section className="space-y-6" aria-labelledby="process-heading">
          <h2 id="process-heading" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            How we work
          </h2>
          <ol className="space-y-4">
            {PROCESS.map((phase) => (
              <li
                key={phase.step}
                className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white dark:bg-white dark:text-neutral-900"
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

        <section className="space-y-6" aria-labelledby="results-heading">
          <div>
            <h2 id="results-heading" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Results &amp; proof
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Drop in verified wins when you have permission to share them. Until then, this layout keeps the page credible and easy to update.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {PLACEHOLDER_RESULTS.map((row) => (
              <div
                key={row.headline}
                className="flex flex-col rounded-2xl border border-dashed border-neutral-300 bg-white/80 p-5 dark:border-neutral-600 dark:bg-neutral-900/30"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-500">Placeholder</p>
                <p className="mt-2 font-semibold text-neutral-900 dark:text-white">{row.headline}</p>
                <p className="mt-3 text-2xl font-bold text-sky-800 dark:text-sky-300">{row.metric}</p>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{row.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            See also:{" "}
            <Link href="/services" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
              What we do
            </Link>{" "}
            for a traffic-to-leads case snapshot, and{" "}
            <Link href="/web-design-services" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
              web design services
            </Link>{" "}
            when the constraint is conversion, not discovery.
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Frequently asked questions
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
          className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-8 text-center dark:border-sky-900/50 dark:from-sky-950/30 dark:to-neutral-950 sm:p-10"
          aria-labelledby="final-cta"
        >
          <h2 id="final-cta" className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
            Ready for clearer SEO and better leads?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Start with an SEO audit request, or book a discovery call—we&apos;ll map what is worth fixing first.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="seo_services_footer"
            className="mt-8 justify-center"
          />
        </section>
      </article>
    </div>
  );
}
