import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";

const aboutDesc =
  "N-Tech Digital Solutions builds websites, lead systems, and automation for businesses that want measurable growth.";

export const metadata: Metadata = {
  title: "About | N-Tech Digital Solutions",
  description: aboutDesc,
  alternates: { canonical: canonicalUrl("/about") },
  openGraph: ogForPath("/about", "About | N-Tech Digital Solutions", aboutDesc),
};

const FAQ_SECTIONS = [
  {
    title: "Services and capability",
    items: [
      {
        q: "What's the difference between SEO and GEO?",
        a: "SEO (Search Engine Optimization) improves visibility on traditional search engines like Google and Bing through technical health, keyword targeting, and content strategy. GEO (Generative Engine Optimization) improves how often your content is cited or summarized by AI tools like ChatGPT, Perplexity, and AI Overviews. SEO gets clicks. GEO gets citations.",
      },
      {
        q: "Do I need all three services or can I pick just one?",
        a: "You can start with one service. The system works best when website, search visibility, and automation work together, but we recommend based on your stage and goals, not maximum scope.",
      },
      {
        q: "What platforms do you build websites on?",
        a: "We build with Webflow, WordPress, Shopify, and custom code (HTML, CSS, JavaScript, React) based on your requirements and performance goals.",
      },
      {
        q: "Will my website be mobile-friendly and fast?",
        a: "Yes. We build responsive sites and optimize performance using Core Web Vitals best practices, optimized media, caching, and CDN delivery.",
      },
      {
        q: "What automations do you actually set up?",
        a: "Common automations include lead capture to CRM, appointment booking workflows, review requests, lead notifications, monthly reporting, and abandoned inquiry follow-up.",
      },
    ],
  },
  {
    title: "Results, timelines, and outcomes",
    items: [
      {
        q: "How long does SEO take to show results?",
        a: "Many businesses see measurable movement in 3-6 months, with stronger compounding gains over 6-12 months depending on competition, content consistency, and baseline site health.",
      },
      {
        q: "Can you guarantee first-page rankings?",
        a: "No. Rankings are controlled by search engines, so guarantees are not realistic. We focus on proven execution and transparent reporting.",
      },
      {
        q: "How will I know if GEO optimization is working?",
        a: "We track AI-answer visibility, citation frequency, branded search growth, and direct traffic/lead trends.",
      },
      {
        q: "What kind of ROI should I expect?",
        a: "ROI varies by industry and offer value. We establish a baseline during onboarding and track performance against your business KPIs.",
      },
      {
        q: "How long does it take to build my website?",
        a: "Most websites take 4-8 weeks. More complex builds can take 10-16 weeks depending on scope and content readiness.",
      },
    ],
  },
  {
    title: "Engagement, ownership, and support",
    items: [
      {
        q: "What do you need from me to get started?",
        a: "Typically: brand assets, current content, example references, domain/hosting access, and clarity on goals/audience. We guide onboarding so nothing is missed.",
      },
      {
        q: "Will I own my website and content?",
        a: "Yes. You own your website, content, domain, and data. Everything is transferred to accounts you control.",
      },
      {
        q: "Can I update the site myself after it's built?",
        a: "Yes. We build with maintainability in mind and provide launch training so your team can edit text, images, and basic content.",
      },
      {
        q: "Who do I contact if something breaks?",
        a: "You get a dedicated support path. Retainer clients receive priority support, and post-launch packages are available for project-only builds.",
      },
      {
        q: "Are you a solo freelancer or an agency?",
        a: "We are a boutique agency with specialists in web, SEO/GEO strategy, and automation.",
      },
    ],
  },
  {
    title: "Pricing and commercials",
    items: [
      {
        q: "How much does this cost?",
        a: "Typical ranges: website builds $2,500-$15,000+, SEO/GEO retainers $750-$2,500/month, automation setups $500-$3,000+. Final pricing depends on scope.",
      },
      {
        q: "Is it a one-time fee or monthly retainer?",
        a: "Website projects are usually one-time. SEO/GEO is typically ongoing. Automations can be one-time, ongoing, or hybrid.",
      },
      {
        q: "What's included vs. what costs extra?",
        a: "Core scope usually includes discovery, design, development, QA, launch, and short post-launch support. Add-ons can include copywriting, media, software subscriptions, paid ads, and ongoing growth operations.",
      },
      {
        q: "Do you require long-term contracts?",
        a: "SEO/GEO commonly starts with a 3-month minimum so meaningful data can accrue, then moves month-to-month.",
      },
      {
        q: "What happens if I want to cancel?",
        a: "After any initial term, cancellation is typically 30 days written notice and assets/access are handed over cleanly.",
      },
    ],
  },
  {
    title: "Fit and proof",
    items: [
      {
        q: "Do you work with businesses in my industry?",
        a: "We support home services, healthcare, legal, real estate, e-commerce, hospitality, and professional services, then tailor strategy to your market.",
      },
      {
        q: "Can I see examples of past work?",
        a: "Yes. We share relevant examples during discovery so you can evaluate fit.",
      },
      {
        q: "Do you have case studies or client results?",
        a: "Yes. We share case studies that focus on traffic growth, ranking movement, lead volume, and automation efficiency.",
      },
      {
        q: "Do you work with local businesses or nationally?",
        a: "Both. Strategy and targeting are adjusted for local/regional versus national reach.",
      },
    ],
  },
] as const;

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function AboutPage() {
  return (
    <MarketingPageShell
      title="About"
      subtitle="We&apos;re a small team obsessed with systems: clear messaging, fast sites, and pipelines that don&apos;t depend on heroics."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <p>
        Based in Omaha, we work with local and regional businesses that are ready to invest in a web
        presence and lead flow that compounds — not one-off pages that sit still after launch.
      </p>
      <p>
        Our projects usually combine design, engineering, and light process design so your team
        actually uses what we ship.
      </p>
      <p>
        Curious if we&apos;re a fit?{" "}
        <Link
          href="/contact"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          Contact us
        </Link>{" "}
        or{" "}
        <Link
          href="/services"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          browse services
        </Link>
        .
      </p>
      <section className="pt-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Frequently asked questions</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Grouped by service, delivery, pricing, and fit so you can quickly find what matters.
        </p>
        <div className="mt-5 space-y-5">
          {FAQ_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-neutral-200 bg-white/70 p-4 dark:border-neutral-800 dark:bg-neutral-950/50"
            >
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                {section.title}
              </h3>
              <div className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900/40"
                  >
                    <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.q}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </MarketingPageShell>
  );
}
