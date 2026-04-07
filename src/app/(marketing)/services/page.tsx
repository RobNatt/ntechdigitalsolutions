import type { Metadata } from "next";
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
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "What We Do | N-Tech Digital Solutions",
  description:
    "N-Tech Digital Solutions designs websites, lead systems, automation, and SEO for businesses that want traffic to turn into booked conversations — not dead ends.",
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

export default function ServicesPage() {
  return (
    <MarketingPageShell
      title="What we do"
      maxWidthClass="max-w-4xl"
      subtitle="N-Tech is a digital partner for businesses that are tired of pretty websites that don’t produce leads. We connect your front end (what people see) to the back end (what happens after they click) — so marketing spend turns into conversations you can track."
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
                Service businesses and teams that sell on trust — contractors, professional services, and local/regional brands that are ready to invest in a system, not a one-page brochure. If you’re already spending on ads or referrals and feel the leak is “after the click,” we should talk.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 border-t border-neutral-200 pt-10 dark:border-neutral-800 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Ready to map your funnel? Tell us what you&apos;re trying to fix — we&apos;ll suggest a practical starting point.
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
          </div>
        </section>
      </div>
    </MarketingPageShell>
  );
}
