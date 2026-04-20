import Link from "next/link";
import { CONSTANTS } from "@/constants/links";
import { SeoServicesCtaPair } from "@/components/seo-services/SeoServicesCtaPair";

const CONTACT_AUDIT_PATH = `${CONSTANTS.CONTACT_PATH}?plan=${encodeURIComponent("Omaha website audit request")}`;

const INCLUDES = [
  {
    title: "Custom design",
    body: "Layouts and components built for your offers—not a generic template that looks like every other contractor or clinic in the metro.",
  },
  {
    title: "Mobile responsiveness",
    body: "Readable type, tap-friendly buttons, and sections that stack cleanly on phones—where most Omaha visitors will first see you.",
  },
  {
    title: "Conversion-focused layout",
    body: "Service clarity, proof, and next steps placed where decision-makers actually scroll—not buried three clicks deep.",
  },
  {
    title: "SEO-friendly structure",
    body: "Logical headings, crawlable pages, and fast delivery so Google can understand and recommend your site alongside your SEO work.",
  },
  {
    title: "Clear calls to action",
    body: "One primary action per key page (call, form, book) so visitors know what to do the moment they are ready.",
  },
  {
    title: "Speed and usability",
    body: "Performance and UX fixes that reduce bounce—especially on mobile networks and older devices common in field teams.",
  },
] as const;

const PROCESS = [
  { title: "Audit", body: "We review your current site, competitors, and goals—speed, mobile, messaging, and where leads leak." },
  { title: "Planning", body: "Sitemap, key pages, and content responsibilities so build week is not a scramble for missing copy." },
  { title: "Design", body: "Visual system and page designs aligned to your brand and the actions you want visitors to take." },
  { title: "Development", body: "Accessible, responsive front end wired to your forms, analytics, and any integrations you rely on." },
  { title: "Launch and optimization", body: "Go-live checklist, tracking validation, and prioritized fixes after real traffic hits the new experience." },
] as const;

type OmahaWebDesignLandingProps = {
  scheduleUrl: string;
  faqItems: readonly { q: string; a: string }[];
};

export function OmahaWebDesignLanding({ scheduleUrl, faqItems }: OmahaWebDesignLandingProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <header className="relative overflow-hidden border-b border-indigo-950/80 bg-gradient-to-b from-indigo-950 via-neutral-950 to-neutral-950 px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 20%, rgb(99 102 241 / 0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgb(56 189 248 / 0.12), transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-2 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300">Omaha · Nebraska metro</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Omaha Web Design That Turns Visitors Into Leads
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            We build clean, high-performing websites for Omaha businesses—fast on phones, easy to navigate, and wired so interested visitors can contact you without friction.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="omaha_web_design_hero"
            className="mt-10 justify-center"
            primaryLabel="Get a Website Audit"
          />
          <p className="mt-6 text-sm text-neutral-500">
            National overview:{" "}
            <Link href="/web-design-services" className="font-medium text-indigo-300 underline-offset-2 hover:underline">
              Web design services
            </Link>
            .
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-14 px-4 py-14 sm:px-6 lg:max-w-4xl lg:space-y-16 lg:px-8 lg:py-16">
        <section className="space-y-4" aria-labelledby="local-intro">
          <h2 id="local-intro" className="text-2xl font-semibold tracking-tight text-white">
            Who we help in Omaha
          </h2>
          <p className="leading-relaxed text-neutral-400">
            If you serve homeowners, patients, or B2B buyers across the metro—from Elkhorn and Millard to Midtown and Council Bluffs when it fits—your site should look professional, load quickly, and
            make contacting you obvious. A good Omaha web experience is not decoration; it is how people decide whether you are serious before they ever call.
          </p>
          <p className="leading-relaxed text-neutral-400">
            We work with owners and marketers who are tired of sites that look fine but do not produce: thin service pages, slow mobile, buried phone numbers, and forms that silently fail. We fix
            those failure modes on purpose.
          </p>
        </section>

        <section aria-labelledby="includes">
          <h2 id="includes" className="text-2xl font-semibold tracking-tight text-white">
            What Omaha web design includes
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {INCLUDES.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm"
              >
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8" aria-labelledby="why-matters">
          <h2 id="why-matters" className="text-xl font-semibold text-white sm:text-2xl">
            Why your website matters
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-400">
            Design drives trust in the first few seconds: cluttered layouts, stock clichés, and slow loads signal “small operator” even when you are not. Visitors decide to stay or leave fast—if
            they bounce, ads and SEO spend leak with them.
          </p>
          <p className="mt-4 leading-relaxed text-neutral-400">
            Conversion is the scoreboard: clear services, proof, and a single obvious next step turn attention into calls and form fills. We design for those outcomes—not awards you cannot cash.
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="omaha-relevance">
          <h2 id="omaha-relevance" className="text-2xl font-semibold tracking-tight text-white">
            Built for how Omaha businesses win online
          </h2>
          <p className="leading-relaxed text-neutral-400">
            Omaha buyers compare: they open a few tabs, skim on their phones, and pick whoever looks credible and easy to reach. That is true for trades, clinics, legal and accounting firms, and
            regional distributors. Your site should match how people actually choose in this market—not a generic national template with your logo dropped in.
          </p>
          <div className="rounded-2xl border border-dashed border-neutral-600 bg-neutral-900/30 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Proof placeholder</p>
            <p className="mt-2 text-sm font-medium text-white">Local client examples (add when ready)</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Replace this block with named Omaha-area outcomes—before/after metrics, industries served, or short quotes you can publish. Until then, we keep the layout honest and easy to drop
              real proof into later.
            </p>
          </div>
        </section>

        <section aria-labelledby="process">
          <h2 id="process" className="text-2xl font-semibold tracking-tight text-white">
            How we work
          </h2>
          <ol className="mt-6 space-y-4 border-l-2 border-indigo-600/60 pl-5">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="absolute -left-[1.35rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-400">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <nav
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 text-sm"
          aria-label="Related services"
        >
          <p className="font-semibold text-white">Related on this site</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-indigo-300">
            <li>
              <Link href="/web-design-services" className="underline-offset-2 hover:underline">
                Web design services
              </Link>
            </li>
            <li>
              <Link href="/omaha-lead-generation-small-business" className="underline-offset-2 hover:underline">
                Omaha lead generation
              </Link>
            </li>
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
              <Link href="/services/automation-and-crm" className="underline-offset-2 hover:underline">
                Lead systems &amp; CRM automation
              </Link>
            </li>
            <li>
              <Link href="/about#faq" className="underline-offset-2 hover:underline">
                FAQ (About)
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-neutral-500">
            GEO / AI visibility: strong pages, FAQs, and structured summaries help both search and generative answers cite you clearly—paired with our{" "}
            <Link href="/services/seo-and-visibility" className="text-indigo-300 underline-offset-2 hover:underline">
              SEO &amp; search visibility
            </Link>{" "}
            topic guide when you want that layer explicit.
          </p>
        </nav>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-white">
            Omaha web design FAQs
          </h2>
          <div className="mt-6 space-y-3">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                <h3 className="text-sm font-semibold text-white">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-2xl border border-indigo-800/60 bg-gradient-to-br from-indigo-950/80 to-neutral-900 p-8 text-center sm:p-10"
          aria-labelledby="final-cta"
        >
          <h2 id="final-cta" className="text-xl font-semibold text-white sm:text-2xl">
            Ready for an Omaha site that earns leads?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-neutral-400">
            Start with a website audit, or book a discovery call—we will map what to fix first and what a realistic build looks like for your market.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="omaha_web_design_footer"
            className="mt-8 justify-center"
            primaryLabel="Get a Website Audit"
          />
        </section>
      </div>
    </div>
  );
}
