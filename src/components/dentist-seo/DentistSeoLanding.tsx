import Link from "next/link";
import { CONSTANTS } from "@/constants/links";
import { SeoServicesCtaPair } from "@/components/seo-services/SeoServicesCtaPair";

const CONTACT_AUDIT_PATH = `${CONSTANTS.CONTACT_PATH}?plan=${encodeURIComponent("Dentist SEO audit request")}`;

const INCLUDES = [
  {
    title: "Local SEO (city + “dentist in [city]” keywords)",
    body: "You appear when someone searches for a dentist in your area—not only when they already know your practice name. We align titles, copy, and structure with how patients actually phrase those searches.",
  },
  {
    title: "Service-page SEO (cleanings, implants, emergency care, and more)",
    body: "Dedicated pages for high-value treatments help you rank for specific intent (“dental implants near me”) and give patients a clear reason to choose your office over the next tab.",
  },
  {
    title: "Google Business Profile and review strategy support",
    body: "Your profile should match your services, hours, and locations, and reviews should reflect the care you provide. We advise on categories, services, photos, and a steady approach to reputation—without gimmicks.",
  },
  {
    title: "On-page SEO for location and treatment pages",
    body: "Headings, internal links, and structured content so each page has a clear job: educate, build trust, and move the visitor toward a call or online booking.",
  },
  {
    title: "Content that answers common patient questions",
    body: "Short, accurate answers to what patients ask before they schedule—recovery times, candidacy, insurance and financing at a high level—so you earn trust before they pick up the phone.",
  },
  {
    title: "SEO-friendly booking and contact setup",
    body: "Visible phone numbers, clear primary actions, and booking flows that work on mobile. SEO should support appointments, not send people to dead ends or confusing menus.",
  },
] as const;

const PROCESS = [
  {
    title: "Understand your practice, services, locations, and typical patient",
    body: "We document what you offer, where you see patients, which procedures you want to grow, and how new patients usually enter your schedule—so search priorities match your clinical and business goals.",
  },
  {
    title: "Audit your site, local listings, and content",
    body: "Technical health, indexation, on-page gaps, competitor visibility, and how well your site and Google Business Profile agree. You receive a clear picture of constraints, not a vague scorecard.",
  },
  {
    title: "Optimize existing pages and build or improve key service pages",
    body: "We strengthen pages that should already rank and add or refine treatment and location content where patients are searching but you are underrepresented.",
  },
  {
    title: "Support local SEO elements (Google Business Profile, local keywords, reviews)",
    body: "Practical alignment between maps, organic results, and your website so patients see consistent information whether they find you on Google Search or Maps.",
  },
  {
    title: "Monitor and refine over time",
    body: "Search Console, rankings for priority treatments, and booking-related signals guide what we improve next—measured against new patient goals, not impressions alone.",
  },
] as const;

type DentistSeoLandingProps = {
  scheduleUrl: string;
  faqItems: readonly { q: string; a: string }[];
};

export function DentistSeoLanding({ scheduleUrl, faqItems }: DentistSeoLandingProps) {
  return (
    <div className="bg-white text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
      <header className="border-b border-sky-200/70 bg-gradient-to-b from-sky-50 to-white px-4 py-16 dark:border-sky-900/40 dark:from-sky-950/25 dark:to-neutral-950 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-800 dark:text-sky-400">
            Dental practices · Multi-location · Specialists
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">
            Dentist SEO That Brings In More New Patients
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
            Most new patients still begin on Google—whether they type <strong className="text-neutral-900 dark:text-white">“dentist near me,”</strong> a city and specialty, or a specific treatment. Dentist SEO helps your practice{" "}
            <strong className="text-neutral-900 dark:text-white">show up in those moments</strong> and{" "}
            <strong className="text-neutral-900 dark:text-white">convert searchers into booked appointments</strong> with clear, trustworthy pages and local signals.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="dentist_seo_hero"
            className="mt-10 justify-center"
            primaryLabel="Get a Dentist SEO Audit"
          />
        </div>
      </header>

      <article className="mx-auto max-w-3xl space-y-14 px-4 py-14 sm:px-6 lg:max-w-4xl lg:space-y-16 lg:px-8 lg:py-16">
        <section className="space-y-4" aria-labelledby="intro">
          <h2 id="intro" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Who we help
          </h2>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            We work with <strong className="text-neutral-900 dark:text-white">general dentists, specialists, and multi-location groups</strong> that want a steadier flow of new patients from organic search. Your team may already run a solid office; the gap is often that{" "}
            <strong className="text-neutral-900 dark:text-white">the right searches never surface your practice</strong>, or the website does not answer the questions patients ask before they schedule.
          </p>
          <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            Patients search for a mix of <strong className="text-neutral-900 dark:text-white">convenience and clinical intent</strong>—cleanings and exams, cosmetic options, implants, periodontal care, orthodontics, and urgent needs like tooth pain or a broken restoration. Dentist SEO is built around those queries and your real capacity to treat them.
          </p>
        </section>

        <section aria-labelledby="includes">
          <h2 id="includes" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            What dentist SEO includes
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

        <section
          className="rounded-2xl border border-sky-200/70 bg-sky-50/50 p-6 dark:border-sky-900/50 dark:bg-sky-950/20 sm:p-8"
          aria-labelledby="why"
        >
          <h2 id="why" className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
            Why SEO matters for your dental practice
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
            Before they call, most patients <strong className="text-neutral-900 dark:text-white">compare practices online</strong>: services, reviews, hours, insurance or financing notes, and how easy it is to book. Appearing in relevant search results is often their first impression of your clinical quality and professionalism.
          </p>
          <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
            Strong visibility for the right keywords supports <strong className="text-neutral-900 dark:text-white">more calls, form fills, and online bookings</strong>. Over time, that contributes to predictable new-patient flow and room to grow higher-value treatment—not vanity rankings disconnected from your schedule.
          </p>
        </section>

        <section aria-labelledby="process">
          <h2 id="process" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Our process for dentist SEO
          </h2>
          <ol className="mt-6 space-y-4">
            {PROCESS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-800 text-sm font-bold text-white dark:bg-sky-600">
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

        <section
          className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-600 dark:bg-neutral-900/30"
          aria-labelledby="proof"
        >
          <h2 id="proof" className="text-xl font-semibold text-neutral-900 dark:text-white">
            Experience with dental and healthcare markets
          </h2>
          <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
            We are familiar with how dental groups and single offices compete: local map packs, treatment-specific landing pages, review velocity, and the balance between clinical accuracy and marketing clarity. Work is structured so your team can review copy and claims before anything goes live.
          </p>
          <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-950/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Results and case studies</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              When you have outcomes you can publish (new patient counts, map visibility, or treatment-line growth), this area can feature them. Until then, we keep this section factual—no inflated metrics.
            </p>
          </div>
        </section>

        <nav
          className="rounded-xl border border-neutral-200 bg-neutral-50/90 p-5 text-sm dark:border-neutral-800 dark:bg-neutral-900/50"
          aria-label="Related services"
        >
          <p className="font-semibold text-neutral-900 dark:text-white">Related services and guides</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sky-800 dark:text-sky-400">
            <li>
              <Link href="/seo-services" className="underline-offset-2 hover:underline">
                SEO services
              </Link>
            </li>
            <li>
              <Link href="/omaha-seo" className="underline-offset-2 hover:underline">
                Omaha SEO (local search)
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
            <li>
              <Link href="/services/seo-and-visibility" className="underline-offset-2 hover:underline">
                SEO &amp; search visibility (methodology)
              </Link>
            </li>
          </ul>
        </nav>

        <section aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Frequently asked questions
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
          className="rounded-2xl border border-sky-300/60 bg-gradient-to-br from-sky-50 to-white p-8 text-center dark:border-sky-800/50 dark:from-sky-950/30 dark:to-neutral-950 sm:p-10"
          aria-labelledby="final"
        >
          <h2 id="final" className="text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
            More new patients from the searches that already happen every day
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Start with a dentist SEO audit tailored to your locations and services, then use a discovery call to align on priorities, timelines, and how you measure success in new patients and booked care.
          </p>
          <SeoServicesCtaPair
            scheduleUrl={scheduleUrl}
            contactAuditHref={CONTACT_AUDIT_PATH}
            placement="dentist_seo_footer"
            className="mt-8 justify-center"
            primaryLabel="Get a Dentist SEO Audit"
          />
        </section>
      </article>
    </div>
  );
}
