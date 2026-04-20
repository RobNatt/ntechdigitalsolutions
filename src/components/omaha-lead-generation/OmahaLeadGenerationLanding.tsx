import Link from "next/link";
import { CONSTANTS } from "@/constants/links";
import { SeoServicesCtaPair } from "@/components/seo-services/SeoServicesCtaPair";

const CONTACT_AUDIT_PATH = `${CONSTANTS.CONTACT_PATH}?plan=${encodeURIComponent("Omaha lead generation audit request")}`;

const INCLUDES = [
  {
    title: "Lead-focused website audit",
    body: "Where trust breaks, forms fail, and mobile friction kills quotes before you ever see them.",
  },
  {
    title: "Funnel mapping",
    body: "How traffic from search, maps, and ads becomes a call or quote—and where people quietly drop.",
  },
  {
    title: "CRM / follow-up and automation",
    body: "Routing, reminders, and speed-to-lead so your crew or front desk does not lose jobs to slower competitors.",
  },
  {
    title: "Simple lead-capture offers",
    body: "When it fits your trade, we shape offers and landing paths that make the next step obvious—not clever for clever’s sake.",
  },
  {
    title: "Local SEO + visibility",
    body: "Discovery that supports booked work in the Omaha metro and the routes you actually run.",
  },
  {
    title: "Ongoing optimization guidance",
    body: "What to test next, what to stop, and how to read results in jobs and revenue—not dashboard theater.",
  },
] as const;

const WHO_FOR = [
  "Local service businesses—contractors, home services, trades—where the calendar should not feel random.",
  "Omaha businesses with a site that “looks fine” but does not produce enough calls or booked estimates.",
  "Owners who want a repeatable lead system—not another round of ad-hoc marketing experiments.",
] as const;

const PROCESS = [
  {
    title: "Understand your business and funnel",
    body: "Offers, service area, capacity, and how you actually win jobs today—so we do not optimize the wrong scoreboard.",
  },
  {
    title: "Audit site, ads, and capture",
    body: "Technical and conversion reality plus any paid traffic alignment. We name leaks in plain language.",
  },
  {
    title: "Build a clear lead path",
    body: "Pages, CTAs, and proof structured so a motivated buyer knows what to do in under a minute.",
  },
  {
    title: "Implement CRM / automation",
    body: "Workflows your team can run: notifications, follow-up, handoffs—so leads do not die in spam folders.",
  },
  {
    title: "Optimize over time",
    body: "Iterate on what moves booked jobs; cut what burns budget without pipeline impact.",
  },
] as const;

type OmahaLeadGenerationLandingProps = {
  scheduleUrl: string;
  faqItems: readonly { q: string; a: string }[];
};

export function OmahaLeadGenerationLanding({ scheduleUrl, faqItems }: OmahaLeadGenerationLandingProps) {
  return (
    <div className="bg-amber-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-amber-200/80 bg-gradient-to-br from-amber-100 via-white to-orange-50/60 px-4 py-16 dark:border-amber-900/40 dark:from-amber-950/40 dark:via-neutral-950 dark:to-orange-950/20 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900 dark:text-amber-400">Omaha · Small business</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Omaha Lead Generation for Small Businesses That Book More Jobs
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-lg">
            We help Omaha owners turn scattered traffic into a <strong className="text-neutral-900 dark:text-white">predictable flow of qualified calls and booked work</strong>—with a system
            (site, capture, follow-up, visibility), not a one-off stunt that dies in two weeks.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="omaha_lead_gen_hero"
            className="mt-10 justify-center"
            primaryLabel="Get a Lead Generation Audit"
          />
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-14 px-4 py-14 sm:px-6 lg:max-w-4xl lg:space-y-16 lg:px-8 lg:py-16">
        <section className="space-y-4" aria-labelledby="intro">
          <h2 id="intro" className="text-2xl font-semibold tracking-tight dark:text-white">
            If the calendar feels empty, the problem is rarely “more posts”
          </h2>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            We work with small businesses in Omaha and nearby routes that are tired of inconsistent leads—busy one week, quiet the next, with no clear reason why. The goal is a{" "}
            <strong className="text-neutral-900 dark:text-white">lead system</strong>: a defined path from discovery to booked job, with follow-up that does not rely on whoever remembered to
            check the inbox.
          </p>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            That means fixing the boring stuff that actually moves revenue: clearer offers, faster mobile pages, honest proof, forms that work, and automation where humans drop the ball. Random
            tactics without that backbone rarely compound.
          </p>
        </section>

        <section aria-labelledby="includes">
          <h2 id="includes" className="text-2xl font-semibold tracking-tight dark:text-white">
            What this offer includes
          </h2>
          <ul className="mt-6 divide-y divide-amber-200/80 rounded-2xl border border-amber-200/90 bg-white dark:divide-amber-900/50 dark:border-amber-900/40 dark:bg-neutral-900/60">
            {INCLUDES.map((item) => (
              <li key={item.title} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:gap-6">
                <h3 className="shrink-0 text-sm font-semibold text-amber-950 dark:text-amber-200 sm:w-52">{item.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50 sm:p-8" aria-labelledby="who">
          <h2 id="who" className="text-xl font-semibold dark:text-white">
            Who this is for
          </h2>
          <ul className="mt-4 space-y-3">
            {WHO_FOR.map((line) => (
              <li key={line} className="flex gap-3 text-neutral-700 dark:text-neutral-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-amber-500" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="systems">
          <h2 id="systems" className="text-2xl font-semibold tracking-tight dark:text-white">
            Systems beat random tactics
          </h2>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            Random boosts—throwing budget at ads, posting without a path, swapping agencies every quarter—rarely compound. They feel busy; they do not reliably fill the schedule. A{" "}
            <strong className="text-neutral-900 dark:text-white">system</strong> ties together the pages people land on, the capture moment, the speed of follow-up, and the metrics that map to{" "}
            <strong className="text-neutral-900 dark:text-white">calls, bookings, and revenue</strong>.
          </p>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            When that system is tight, you can add traffic with confidence. When it is not, more traffic usually increases waste. We build for the boring scoreboard: booked jobs and margin—not
            vanity reach.
          </p>
        </section>

        <section aria-labelledby="process">
          <h2 id="process" className="text-2xl font-semibold tracking-tight dark:text-white">
            How we work
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/70"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">Step {i + 1}</p>
                <h3 className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-dashed border-amber-300/90 bg-amber-50/50 p-6 dark:border-amber-800/60 dark:bg-amber-950/20" aria-labelledby="proof">
          <h2 id="proof" className="text-xl font-semibold dark:text-white">
            Omaha small-business markets
          </h2>
          <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
            We are based in the Omaha–Lincoln corridor and work with trades, home services, and local operators where reputation, response time, and clarity decide who gets the job. We plan around
            real dispatch areas and how buyers compare you on a phone screen—not a national playbook.
          </p>
          <div className="mt-6 rounded-xl border border-amber-200/80 bg-white/80 p-4 dark:border-amber-900/50 dark:bg-neutral-900/40">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Results placeholder</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Add booked-lead or revenue-linked examples when you can publish them. Until then, this block keeps the page honest and easy to upgrade without rewriting the whole story.
            </p>
          </div>
        </section>

        <nav
          className="rounded-xl border border-neutral-200 bg-white p-5 text-sm dark:border-neutral-800 dark:bg-neutral-900/50"
          aria-label="Related services"
        >
          <p className="font-semibold text-neutral-900 dark:text-white">Connect the system to your stack</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-amber-900 dark:text-amber-400">
            <li>
              <Link href="/seo-services" className="underline-offset-2 hover:underline">
                SEO services
              </Link>
            </li>
            <li>
              <Link href="/seo-for-service-businesses" className="underline-offset-2 hover:underline">
                SEO for service businesses
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
              <Link href="/omaha-web-design" className="underline-offset-2 hover:underline">
                Omaha web design
              </Link>
            </li>
            <li>
              <Link href="/about#faq" className="underline-offset-2 hover:underline">
                FAQ (About)
              </Link>
            </li>
          </ul>
        </nav>

        <section aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-2xl font-semibold tracking-tight dark:text-white">
            FAQs
          </h2>
          <div className="mt-6 space-y-3">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-100 to-white p-8 text-center dark:border-amber-800/50 dark:from-amber-950/40 dark:to-neutral-950 sm:p-10"
          aria-labelledby="final"
        >
          <h2 id="final" className="text-xl font-semibold sm:text-2xl dark:text-white">
            System-first lead generation for Omaha
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Start with a lead generation audit to see where jobs are leaking—or book a discovery call if you already know you need a tighter funnel and follow-up machine.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="omaha_lead_gen_footer"
            className="mt-8 justify-center"
            primaryLabel="Get a Lead Generation Audit"
          />
        </section>
      </article>
    </div>
  );
}
