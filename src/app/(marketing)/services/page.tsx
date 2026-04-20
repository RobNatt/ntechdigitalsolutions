import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Funnel,
  Globe,
  MapPin,
  MessagesSquare,
  Puzzle,
  Sparkles,
  Workflow,
} from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { CONSTANTS } from "@/constants/links";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";
import { cn } from "@/lib/utils";

const servicesDesc =
  "N-Tech Digital Solutions designs websites, lead systems, automation, and SEO for businesses that want traffic to turn into booked conversations — not dead ends.";

export const metadata: Metadata = {
  title: "What We Do | N-Tech Digital Solutions",
  description: servicesDesc,
  alternates: { canonical: canonicalUrl("/services") },
  openGraph: ogForPath("/services", "What We Do | N-Tech Digital Solutions", servicesDesc),
};

const CAPABILITIES = [
  {
    icon: Sparkles,
    title: "Strategy & positioning",
    body: "We clarify who you serve, what you promise, and how that shows up on the page — so your site and ads tell one coherent story.",
  },
  {
    icon: Globe,
    title: "Websites & landing experiences",
    body: "Fast, credible sites and focused landing pages built for real people and search engines — not templates that sit unused after launch.",
  },
  {
    icon: Funnel,
    title: "Lead capture & qualification",
    body: "Forms, routing, and light qualification so the right leads reach the right inbox or CRM instead of getting lost in a generic “contact us” black hole.",
  },
  {
    icon: Workflow,
    title: "Automation & follow-up",
    body: "SMS, email, and workflow glue so follow-up happens automatically: reminders, handoffs, and notifications your team can actually rely on.",
  },
  {
    icon: MapPin,
    title: "Local SEO & visibility",
    body: "Structure, content, and ongoing attention aimed at showing up where your customers search — especially for service-area and local businesses.",
  },
  {
    icon: BarChart3,
    title: "Measurement & iteration",
    body: "First-party analytics, dashboards where it helps, and a bias toward improving what converts — not guessing from vanity metrics.",
  },
] as const;

const PHASES = [
  {
    step: "01",
    title: "Discover",
    body: "We learn your market, offers, and constraints — what’s working, what’s leaking, and what “success” means in numbers you care about.",
  },
  {
    step: "02",
    title: "Design & build",
    body: "We ship the site, funnels, and integrations as one system so launch day isn’t a pile of disconnected tools.",
  },
  {
    step: "03",
    title: "Launch & train",
    body: "We turn it on with your team: how leads flow, who gets notified, and how to keep content and campaigns aligned.",
  },
  {
    step: "04",
    title: "Improve",
    body: "We revisit what the data shows — pages, messaging, and automation — so the system gets stronger after go-live, not weaker.",
  },
] as const;

const PROOF_IMAGES = {
  before: "/pre/before.png",
  after: "/after/result.png",
} as const;

function CapabilityCard({
  icon: Icon,
  title,
  body,
}: {
  icon: (typeof CAPABILITIES)[number]["icon"];
  title: string;
  body: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200/90 bg-white/80 p-5 shadow-sm",
        "dark:border-neutral-800 dark:bg-neutral-950/60"
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200">
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </div>
      <h2 className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{body}</p>
    </div>
  );
}

export default async function ServicesPage() {
  const proofImages = PROOF_IMAGES;

  return (
    <MarketingPageShell
      title="What we do"
      maxWidthClass="max-w-4xl"
      subtitle="N-Tech is a digital partner for businesses that are tired of pretty websites that don’t produce leads. We connect your front end (what people see) to the back end (what happens after they click) — so marketing spend turns into conversations you can track. We serve Omaha and the Nebraska metro with in-market strategy and execution, while still delivering nationwide for growth-focused teams."
      cta="full"
    >
      <div className="space-y-14">
        <section className="space-y-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>
            We’re not a generic “we do everything” agency. We focus on the path from{" "}
            <strong className="font-semibold text-neutral-900 dark:text-white">attention → trust → lead → follow-up</strong>
            . That usually means websites and landing pages, lead capture, CRM and pipeline wiring, automation, and SEO — implemented together, not as one-off tickets.
          </p>
          <p>
            Some clients need a full growth system end to end. Others need a strong site plus a few automations. We scope to what moves the needle for you, then document and hand off so your team isn’t dependent on mystery workflows.
          </p>
        </section>

        <section className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-white p-6 dark:border-sky-900/50 dark:from-sky-950/25 dark:to-neutral-950 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-400">
            Topic guides
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Deeper dives (national & remote-friendly)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Intent-focused pages you can link from ads, email, and editorial content — each with its own title, summary, and internal links into the rest of the site.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6">
            {[
              {
                href: "/seo-services",
                title: "SEO services",
                blurb: "Commercial overview: audit, deliverables, process, and FAQs for small businesses.",
              },
              {
                href: "/seo-for-service-businesses",
                title: "SEO for service businesses",
                blurb: "Trades and home services: local search, service pages, booked-job outcomes.",
              },
              {
                href: "/dentist-seo",
                title: "Dentist SEO",
                blurb: "Dental practices: local patients, treatment pages, GBP and booking paths.",
              },
              {
                href: "/services/websites-and-leads",
                title: "Websites & lead-ready builds",
                blurb: "Conversion-first sites and landing pages, structured for search.",
              },
              {
                href: "/services/seo-and-visibility",
                title: "SEO & search visibility",
                blurb: "Topics, technical baseline, and measurement tied to pipeline.",
              },
              {
                href: "/services/automation-and-crm",
                title: "Automation & CRM",
                blurb: "Routing, follow-up, and handoffs that match how you sell.",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-full flex-col rounded-xl border border-neutral-200/90 bg-white/90 p-4 transition hover:border-sky-300/80 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950/60 dark:hover:border-sky-800"
                >
                  <span className="font-semibold text-neutral-900 dark:text-white">{item.title}</span>
                  <span className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.blurb}</span>
                  <span className="mt-3 text-sm font-medium text-sky-700 dark:text-sky-400">Read more →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white p-6 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-neutral-950 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800 dark:text-emerald-400">
            Omaha &amp; Nebraska metro
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Local landing pages (web, SEO, growth)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Metro landings for Omaha and Lincoln-area intent, lead systems for small businesses, plus a statewide SEO page for
            multi-city Nebraska coverage. Use these for ads, GBP, and email deep links.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              {
                href: "/omaha-web-design",
                title: "Omaha web design",
                blurb: "Local landing: audits, conversion-focused builds, and discovery.",
              },
              {
                href: "/omaha-lead-generation-small-business",
                title: "Omaha lead generation",
                blurb: "System-first funnels, capture, and follow-up for booked jobs.",
              },
              {
                href: "/omaha-seo",
                title: "Omaha SEO",
                blurb: "Local search, maps, and pages built for Omaha metro lead flow.",
              },
              {
                href: "/nebraska-seo",
                title: "Nebraska SEO",
                blurb: "Statewide and multi-city visibility beyond a single metro.",
              },
              {
                href: "/digital-marketing-omaha-ne",
                title: "Digital marketing — Omaha, NE",
                blurb: "Funnels, automation, and full-funnel growth.",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-full flex-col rounded-xl border border-neutral-200/90 bg-white/90 p-4 transition hover:border-emerald-300/80 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950/60 dark:hover:border-emerald-800"
                >
                  <span className="font-semibold text-neutral-900 dark:text-white">{item.title}</span>
                  <span className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.blurb}
                  </span>
                  <span className="mt-3 text-sm font-medium text-emerald-800 dark:text-emerald-400">
                    View page →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-400">
            Proof layer
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            From no meaningful traffic to ~200 visitors per week
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            One recent client had almost no useful traffic before optimization. After we improved
            structure, technical SEO, and conversion flow, they started averaging around 200 weekly
            visitors with stronger lead intent.
          </p>
          {proofImages.before && proofImages.after ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <figure className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/40">
                <Image
                  src={proofImages.before}
                  alt="Pre-launch analytics snapshot"
                  width={1200}
                  height={700}
                  className="h-auto w-full object-cover"
                />
                <figcaption className="border-t border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                  Pre-launch: minimal traffic and weak discovery
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/40">
                <Image
                  src={proofImages.after}
                  alt="Post-launch results snapshot"
                  width={1200}
                  height={700}
                  className="h-auto w-full object-cover"
                />
                <figcaption className="border-t border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                  Post-launch: consistent weekly traffic and stronger lead flow
                </figcaption>
              </figure>
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-amber-300/70 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Add the screenshots in <code>public/</code> with names containing{" "}
              <code>pre</code>/<code>before</code> and <code>after</code>/<code>result</code> to
              auto-display the case proof.
            </p>
          )}
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-400">
                Capabilities
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                How we help you grow
              </h2>
            </div>
            <Puzzle className="hidden h-8 w-8 text-neutral-300 dark:text-neutral-600 sm:block" aria-hidden />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((item) => (
              <CapabilityCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-400">
            Process
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            How we tend to work
          </h2>
          <ol className="mt-8 space-y-6">
            {PHASES.map((phase) => (
              <li
                key={phase.step}
                className="flex gap-4 rounded-xl border border-neutral-200/90 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/40"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-white dark:bg-white dark:text-neutral-900"
                  aria-hidden
                >
                  {phase.step}
                </span>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{phase.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {phase.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-sky-50/90 to-white p-6 dark:border-neutral-800 dark:from-sky-950/30 dark:to-neutral-950 sm:p-8">
          <div className="flex gap-3">
            <MessagesSquare
              className="mt-0.5 h-6 w-6 shrink-0 text-sky-700 dark:text-sky-400"
              strokeWidth={1.75}
              aria-hidden
            />
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Who we work best with</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                Business owners and teams who want a website that drives traffic into sales leads — not
                just a digital brochure. If your business depends on trust and follow-up (contractors,
                local services, professional firms), we build the front end and back end together.
              </p>
            </div>
          </div>
        </section>

        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-400">
            Common questions
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Objections we handle early
          </h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How long does this take to start producing results?",
                a: "Most builds launch in weeks, not quarters. Traffic and lead quality improvements typically compound over the first 60-120 days as content, SEO, and follow-up systems settle in.",
              },
              {
                q: "What if we already have a website?",
                a: "We can rebuild, iterate, or layer conversion and automation onto what you have. We choose the lowest-friction path that actually improves pipeline.",
              },
              {
                q: "Will this work for my industry?",
                a: "If your buyers search, compare, and then contact you, the model applies. We tailor messaging, pages, and qualification flow to your exact service and market.",
              },
              {
                q: "Do I need to manage all the tech after launch?",
                a: "No. We document the system and can stay involved with optimization, reporting, and support based on your package.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-neutral-200/90 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/40"
              >
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{item.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3 border-t border-neutral-200 pt-10 dark:border-neutral-800 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Ready to turn site traffic into qualified leads? Tell us what you&apos;re trying to fix — we&apos;ll suggest the practical starting point.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={CONSTANTS.CONTACT_PATH}
              className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Get in touch
            </Link>
            <Link
              href="/growth-system"
              className="inline-flex items-center justify-center rounded-lg border border-sky-500/50 bg-sky-50 px-5 py-2.5 text-sm font-semibold text-sky-950 transition hover:bg-sky-100 dark:border-sky-700/50 dark:bg-sky-950/50 dark:text-sky-100 dark:hover:bg-sky-900/50"
            >
              Growth System overview
            </Link>
            <Link
              href="/growth-system?v=b"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Funnel variant B
            </Link>
            <Link
              href="/growth-system?v=c"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Funnel variant C
            </Link>
          </div>
        </section>
      </div>
    </MarketingPageShell>
  );
}
