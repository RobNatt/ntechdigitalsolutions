import Link from "next/link";
import { CONSTANTS } from "@/constants/links";
import { SeoServicesCtaPair } from "@/components/seo-services/SeoServicesCtaPair";

const CONTACT_AUDIT_PATH = `${CONSTANTS.CONTACT_PATH}?plan=${encodeURIComponent("SEO audit for service business request")}`;

const INCLUDES = [
  {
    title: "Local SEO (city + service keywords)",
    body: "You show up when someone types “electrician in [your city]” or “drain cleaning near me”—not just your brand name.",
  },
  {
    title: "Service-area landing pages",
    body: "Pages that match how far you actually drive, without spamming thin duplicates that hurt more than they help.",
  },
  {
    title: "On-page SEO for key services",
    body: "Headings, service copy, and internal links that tell Google and humans exactly what you do best.",
  },
  {
    title: "Technical SEO",
    body: "Speed, mobile usability, and crawl health so rankings are not capped by a broken foundation.",
  },
  {
    title: "Content that answers real questions",
    body: "Short, useful answers to the things homeowners ask before they call—so you earn trust before the phone rings.",
  },
  {
    title: "Optimization for calls and bookings",
    body: "CTAs, tap-to-call, forms, and trust blocks placed where high-intent visitors actually decide—not buried below the fold.",
  },
] as const;

const PROCESS = [
  {
    title: "Understand your services and areas",
    body: "What you sell, where you roll trucks, seasonality, and what a booked job is worth—so we chase the right searches.",
  },
  {
    title: "Audit site, listings, and content",
    body: "Site health, GBP alignment, competitor reality, and where you are invisible today.",
  },
  {
    title: "Build or improve local/service pages",
    body: "Pages that match intent and your capacity—so you rank for work you want, not junk leads.",
  },
  {
    title: "Optimize for ranking and conversion",
    body: "Phones, forms, proof, and page speed tuned for people comparing three tabs on a lunch break.",
  },
  {
    title: "Monitor and refine",
    body: "Search Console, calls, and form fills—not just impressions—so we double down on what books jobs.",
  },
] as const;

type SeoForServiceBusinessesLandingProps = {
  scheduleUrl: string;
  faqItems: readonly { q: string; a: string }[];
};

export function SeoForServiceBusinessesLanding({ scheduleUrl, faqItems }: SeoForServiceBusinessesLandingProps) {
  return (
    <div className="bg-white text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
      <header className="border-b border-teal-200/60 bg-gradient-to-b from-teal-50 to-white px-4 py-16 dark:border-teal-900/40 dark:from-teal-950/30 dark:to-neutral-950 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-400">Trades · Home services · Local operators</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">
            SEO for Service Businesses That Get More Booked Jobs
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
            When homeowners search for a plumber, HVAC tech, electrician, cleaner, or landscaper, you want to be in that short list they actually call. We help you{" "}
            <strong className="text-neutral-900 dark:text-white">show up in those searches</strong> and{" "}
            <strong className="text-neutral-900 dark:text-white">convert clicks into booked jobs</strong>—not just more random traffic.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="seo_service_businesses_hero"
            className="mt-10 justify-center"
            primaryLabel="Get an SEO Audit for Your Service Business"
          />
        </div>
      </header>

      <article className="mx-auto max-w-3xl space-y-14 px-4 py-14 sm:px-6 lg:max-w-4xl lg:space-y-16 lg:px-8 lg:py-16">
        <section className="space-y-4" aria-labelledby="intro">
          <h2 id="intro" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            You are busy—but “busy” does not always mean “full calendar”
          </h2>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            If you run crews or vans, you know the pain: slammed in peak season, then quiet when you still have payroll. Or you are steady but{" "}
            <strong className="text-neutral-900 dark:text-white">you are not showing up when people search for what you do</strong>. That is not a moral failure of your business—it is usually a
            visibility + trust + capture problem we can map in plain English.
          </p>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            You do not need another vague “digital presence.” You need a predictable path from search to call to booked job. That is what this page is about.
          </p>
        </section>

        <section aria-labelledby="includes">
          <h2 id="includes" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            What SEO for service businesses includes
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {INCLUDES.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-teal-200/70 bg-teal-50/50 p-6 dark:border-teal-900/50 dark:bg-teal-950/20 sm:p-8" aria-labelledby="why">
          <h2 id="why" className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
            Why this matters for you
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
            People do not lovingly research ten blog posts before they call a plumber. They search <strong className="text-neutral-900 dark:text-white">“plumber in [city]”</strong>,{" "}
            <strong className="text-neutral-900 dark:text-white">“HVAC company near me,”</strong> or a service plus neighborhood. Those searches are{" "}
            <strong className="text-neutral-900 dark:text-white">high intent</strong>: the buyer is often one good page away from dialing.
          </p>
          <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
            When you show up there—with a fast page, clear pricing language, reviews, and an obvious call button—SEO ties directly to{" "}
            <strong className="text-neutral-900 dark:text-white">calls, quotes, and booked jobs</strong>. When you do not show up, you are handing those jobs to whoever ranked above you.
          </p>
        </section>

        <section aria-labelledby="process">
          <h2 id="process" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Our process for service-business SEO
          </h2>
          <ol className="mt-6 space-y-4">
            {PROCESS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white dark:bg-teal-600">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-600 dark:bg-neutral-900/30" aria-labelledby="proof">
          <h2 id="proof" className="text-xl font-semibold text-neutral-900 dark:text-white">
            Service-business markets we work in
          </h2>
          <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
            We regularly work with contractors, home services, and local operators where the phone and calendar matter more than e-commerce carts. Strategy accounts for dispatch ranges, seasonality,
            emergency vs planned work, and how homeowners compare you on a phone screen.
          </p>
          <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-950/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Case studies placeholder</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Drop in named wins when you can share them (calls, booked estimates, map movement). Until then, this stays a clean slot—no fake metrics.
            </p>
          </div>
        </section>

        <nav
          className="rounded-xl border border-neutral-200 bg-neutral-50/90 p-5 text-sm dark:border-neutral-800 dark:bg-neutral-900/50"
          aria-label="Related services"
        >
          <p className="font-semibold text-neutral-900 dark:text-white">Work with the rest of your lead system</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-teal-800 dark:text-teal-400">
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
              <Link href="/web-design-services" className="underline-offset-2 hover:underline">
                Web design services
              </Link>
            </li>
            <li>
              <Link href="/services/seo-and-visibility" className="underline-offset-2 hover:underline">
                SEO &amp; search visibility (methodology)
              </Link>
            </li>
            <li>
              <Link href="/about#faq" className="underline-offset-2 hover:underline">
                FAQ (About)
              </Link>
            </li>
          </ul>
        </nav>

        <section aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            FAQs
          </h2>
          <div className="mt-6 space-y-3">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950/60">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-2xl border border-teal-300/60 bg-gradient-to-br from-teal-50 to-white p-8 text-center dark:border-teal-800/50 dark:from-teal-950/30 dark:to-neutral-950 sm:p-10"
          aria-labelledby="final"
        >
          <h2 id="final" className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
            More booked jobs from the searches that already exist
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Get an SEO audit built for your service business—then a discovery call to align on routes, seasonality, and what “full calendar” should look like for you.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="seo_service_businesses_footer"
            className="mt-8 justify-center"
            primaryLabel="Get an SEO Audit for Your Service Business"
          />
        </section>
      </article>
    </div>
  );
}
