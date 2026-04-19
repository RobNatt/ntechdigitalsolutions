import Link from "next/link";
import { CONSTANTS } from "@/constants/links";
import { SeoServicesCtaPair } from "@/components/seo-services/SeoServicesCtaPair";

const CONTACT_AUDIT_PATH = `${CONSTANTS.CONTACT_PATH}?plan=${encodeURIComponent("Nebraska SEO audit request")}`;

const INCLUDES = [
  {
    title: "On-page SEO",
    body: "Clear service pages, headings, and copy that match how Nebraskans search—by city, region, or statewide intent—without watering down what you actually deliver.",
  },
  {
    title: "Technical SEO",
    body: "Crawl budget, indexation, speed, and mobile experience so Google can surface the right pages whether someone is on fiber in Lincoln or LTE in rural Hall County.",
  },
  {
    title: "Local SEO",
    body: "Google Business Profile, categories, and service areas aligned with real travel and dispatch—especially when you are not a single-storefront business.",
  },
  {
    title: "Content strategy",
    body: "Editorial priorities and page types that support both “near me” demand and broader Nebraska questions your buyers ask before they shortlist vendors.",
  },
  {
    title: "Internal linking",
    body: "Hubs, service silos, and location coverage that pass authority to the URLs that should rank—so statewide intent does not collapse into one thin page.",
  },
  {
    title: "Statewide visibility",
    body: "Structure and measurement for multi-city and regional demand: where to consolidate, where to expand, and how to avoid competing with yourself in search.",
  },
] as const;

const PROCESS = [
  { title: "Audit", body: "Technical baseline, current rankings, competitor footprint, and gaps across the cities and queries that matter to your model." },
  { title: "Strategy", body: "A Nebraska-wide plan: which pages to strengthen first, which locations deserve their own URL, and what success looks like in leads." },
  { title: "Optimization", body: "On-page and technical fixes sequenced for impact—before we pour content into pages the site cannot support." },
  { title: "Content and implementation", body: "Publish or refresh pages your team can own, with internal links and schema where they help—not boilerplate city spam." },
  { title: "Reporting and refinement", body: "Monthly clarity on visibility, traffic quality, and conversions, plus the next quarter’s priorities as seasons and demand shift." },
] as const;

type NebraskaSeoLandingProps = {
  scheduleUrl: string;
  faqItems: readonly { q: string; a: string }[];
};

export function NebraskaSeoLanding({ scheduleUrl, faqItems }: NebraskaSeoLandingProps) {
  return (
    <div className="min-h-screen bg-white text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
      <header className="border-b border-neutral-200 bg-gradient-to-br from-sky-50 via-white to-amber-50/40 px-4 py-14 dark:border-neutral-800 dark:from-sky-950/30 dark:via-neutral-950 dark:to-amber-950/10 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-800 dark:text-sky-400">Statewide · Nebraska</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">
              Nebraska SEO Services That Help Businesses Get Found
            </h1>
            <p className="mt-5 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
              From Omaha and Lincoln to regional hubs and rural routes, buyers use Google to compare vendors before they call. We help Nebraska businesses earn visibility across the cities and
              searches that match how you actually operate—then connect that traffic to qualified leads.
            </p>
          </div>
          <div className="shrink-0 rounded-2xl border border-neutral-200/80 bg-white/90 p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/80 lg:max-w-sm lg:self-stretch">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Next step</p>
            <SeoServicesCtaPair
              scheduleUrl={scheduleUrl}
              contactAuditHref={CONTACT_AUDIT_PATH}
              placement="nebraska_seo_hero"
              className="mt-4 flex-col"
              primaryLabel="Get a Nebraska SEO Audit"
            />
            <p className="mt-4 text-xs leading-relaxed text-neutral-500 dark:text-neutral-500">
              National overview:{" "}
              <Link href="/seo-services" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
                SEO services
              </Link>
              . Metro focus:{" "}
              <Link href="/omaha-seo" className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400">
                Omaha SEO
              </Link>
              .
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <section className="border-l-4 border-sky-500 pl-5 dark:border-sky-600" aria-labelledby="ne-intro">
          <h2 id="ne-intro" className="text-xl font-semibold text-neutral-900 dark:text-white">
            Built for Nebraska, not one zip code
          </h2>
          <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
            This page is for companies that think in terms of <strong className="text-neutral-900 dark:text-white">Nebraska markets</strong>—not only the Omaha metro. You might dispatch crews
            across counties, run appointments in multiple cities, or sell B2B into accounts from Scottsbluff to Falls City. SEO still works the same way at the core: clear intent, credible pages,
            and a site Google can trust—but the page map and local signals have to match a wider map.
          </p>
          <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
            When buyers search by state, region, or a string of city names, they are trying to answer “who serves here?” fast. A Nebraska-aware structure helps you show up in those comparisons
            without pretending to be everywhere you are not.
          </p>
        </section>

        <hr className="my-14 border-neutral-200 dark:border-neutral-800" />

        <section aria-labelledby="who-for">
          <h2 id="who-for" className="text-xl font-semibold text-neutral-900 dark:text-white">
            Who this page is for
          </h2>
          <ul className="mt-5 space-y-3 text-neutral-700 dark:text-neutral-300">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600 dark:bg-sky-500" aria-hidden />
              <span>Businesses that serve <strong className="text-neutral-900 dark:text-white">multiple Nebraska cities</strong> from one brand or HQ.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600 dark:bg-sky-500" aria-hidden />
              <span>
                <strong className="text-neutral-900 dark:text-white">Local operators expanding</strong> across the state—adding crews, clinics, or delivery routes.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600 dark:bg-sky-500" aria-hidden />
              <span>Teams that need <strong className="text-neutral-900 dark:text-white">broader visibility</strong> than a single-city landing page can support.</span>
            </li>
          </ul>
        </section>

        <hr className="my-14 border-neutral-200 dark:border-neutral-800" />

        <section aria-labelledby="includes">
          <h2 id="includes" className="text-xl font-semibold text-neutral-900 dark:text-white">
            What Nebraska SEO services include
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Deliverables are scoped to your footprint. Below is what “Nebraska-wide” usually involves when search and leads are the goal.
          </p>
          <ol className="mt-8 list-none space-y-8 p-0">
            {INCLUDES.map((row, i) => (
              <li key={row.title} className="flex gap-4 sm:gap-6">
                <span className="w-10 shrink-0 text-right font-mono text-sm font-bold text-sky-700 dark:text-sky-400" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{row.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{row.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <hr className="my-14 border-neutral-200 dark:border-neutral-800" />

        <section className="rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-900/50 sm:p-8" aria-labelledby="why-statewide">
          <h2 id="why-statewide" className="text-xl font-semibold text-neutral-900 dark:text-white">
            Why statewide SEO matters
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
            People do not only search “near me.” They search <strong className="text-neutral-900 dark:text-white">by state, by region, and by city</strong>—sometimes in the same buying journey.
            A Nebraska-oriented page (or set of pages) helps Google connect your brand to the geography you serve, especially when your sales story is “we cover the state” or “we work along
            this corridor.”
          </p>
          <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
            Done well, statewide work builds <strong className="text-neutral-900 dark:text-white">authority and reach</strong> without splitting your message into twenty weak doorways. The
            outcome we care about is simple: more qualified calls and form fills from the places you want to work—not vanity traffic from cities you cannot serve.
          </p>
        </section>

        <hr className="my-14 border-neutral-200 dark:border-neutral-800" />

        <section aria-labelledby="process">
          <h2 id="process" className="text-xl font-semibold text-neutral-900 dark:text-white">
            How we run Nebraska engagements
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((p) => (
              <div key={p.title} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950/60">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{p.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-14 border-neutral-200 dark:border-neutral-800" />

        <section aria-labelledby="trust-ne">
          <h2 id="trust-ne" className="text-xl font-semibold text-neutral-900 dark:text-white">
            Nebraska markets we understand
          </h2>
          <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
            N-Tech is headquartered in the Omaha–Lincoln corridor and works with Nebraska businesses day to day: distance matters for dispatch, provider networks, and who shows up in local
            packs. We plan SEO around realistic service areas, competition in each pocket of the state, and how your buyers actually choose vendors—not a generic national playbook.
          </p>
          <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 p-5 dark:border-neutral-600 dark:bg-neutral-900/40">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Results placeholder</p>
            <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">Add Nebraska-specific proof when available</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Swap this box for a short case: e.g. multi-city impressions lift, lead form growth from organic, or map visibility in two metros—whatever you can publish truthfully.
            </p>
          </div>
        </section>

        <hr className="my-14 border-neutral-200 dark:border-neutral-800" />

        <nav className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-5 text-sm dark:border-neutral-800 dark:bg-neutral-900/40" aria-label="Related services">
          <p className="font-semibold text-neutral-900 dark:text-white">Related on this site</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sky-800 dark:text-sky-400">
            <li>
              <Link href="/seo-services" className="underline-offset-2 hover:underline">
                SEO services
              </Link>
            </li>
            <li>
              <Link href="/omaha-seo" className="underline-offset-2 hover:underline">
                Omaha SEO
              </Link>
            </li>
            <li>
              <Link href="/web-design-services" className="underline-offset-2 hover:underline">
                Web design services
              </Link>
            </li>
            <li>
              <Link href="/about#faq" className="underline-offset-2 hover:underline">
                FAQ (About)
              </Link>
            </li>
          </ul>
        </nav>

        <section className="mt-14" aria-labelledby="faq">
          <h2 id="faq" className="text-xl font-semibold text-neutral-900 dark:text-white">
            Nebraska SEO questions
          </h2>
          <div className="mt-6 space-y-2">
            {faqItems.map((item) => (
              <details
                key={item.q}
                className="group rounded-lg border border-neutral-200 bg-white open:shadow-sm dark:border-neutral-800 dark:bg-neutral-950/60"
              >
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-neutral-900 marker:content-none dark:text-white [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-2">
                    {item.q}
                    <span className="text-neutral-400 transition group-open:rotate-180 dark:text-neutral-500" aria-hidden>
                      ↓
                    </span>
                  </span>
                </summary>
                <p className="border-t border-neutral-100 px-4 py-3 text-sm leading-relaxed text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-sky-200/80 bg-sky-50/50 p-8 dark:border-sky-900/40 dark:bg-sky-950/20" aria-labelledby="final-cta-heading">
          <h2 id="final-cta-heading" className="text-lg font-semibold text-neutral-900 dark:text-white">
            Grow visibility across Nebraska
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Request a Nebraska SEO audit for a prioritized read on your site and markets—or book a discovery call to align on cities, capacity, and timing.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="nebraska_seo_footer"
            className="mt-6 flex-col sm:flex-row"
            primaryLabel="Get a Nebraska SEO Audit"
          />
        </section>
      </div>
    </div>
  );
}
