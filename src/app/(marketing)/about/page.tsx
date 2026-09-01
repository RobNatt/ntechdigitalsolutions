import type { Metadata } from "next";
import Link from "next/link";
import { ScheduleCtaLink } from "@/components/scheduling/ScheduleCtaLink";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { FaqSection, type FaqGroup } from "@/components/marketing/FaqSection";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, SITE_URL } from "@/constants/site";

const aboutDesc =
  "N-Tech Digital Solutions builds the connected infrastructure — website, AI receptionist, lead automation, social media management, and review automation — that stops local service businesses from leaking leads.";

export const metadata: Metadata = {
  title: "About | N-Tech Digital Solutions",
  description: aboutDesc,
  alternates: { canonical: canonicalUrl("/about") },
  openGraph: ogForPath("/about", "About | N-Tech Digital Solutions", aboutDesc),
};

const FAQ_SECTIONS: FaqGroup[] = [
  {
    title: "The system",
    items: [
      {
        q: "What does N-Tech actually build?",
        a: "One connected infrastructure system for local service businesses: a website with a lead form and Call Now button, an AI receptionist that answers and books calls, lead-form automation that pushes submissions into a CRM with instant follow-up, Facebook/Instagram management, and Google review automation.",
      },
      {
        q: "Why call it 'infrastructure' instead of a website or marketing service?",
        a: "Because the website is one piece, not the whole thing. Most businesses already have a website — what they're missing is what happens after someone calls, fills out a form, comments on a post, or leaves a review. That's the infrastructure layer.",
      },
      {
        q: "Do you manage paid ads too?",
        a: "Not as part of the core system. Ad management and ad spend are a separate add-on we typically bring up after onboarding, since ads convert far better once the infrastructure exists to actually catch and follow up on the leads they generate.",
      },
    ],
  },
  {
    title: "Pricing and commitment",
    items: [
      {
        q: "How is pricing structured?",
        a: "One flat monthly retainer covers the whole system — no separate build fee. We're intentionally running a limited case-study pricing phase to get honest results from real businesses before rates move up. See /pricing to book a call for your number.",
      },
      {
        q: "Is there a contract, and what happens if I want to cancel?",
        a: "We keep terms simple and will walk you through them on a call before you commit. The goal is a system you see results from, not a contract you feel stuck in.",
      },
    ],
  },
  {
    title: "Fit and results",
    items: [
      {
        q: "What kind of businesses is this built for?",
        a: "Local service businesses — the kind that lose money to missed calls, slow follow-up, and inconsistent reviews. We're launching focused on the Omaha metro and Lincoln, Nebraska, with the same system built to expand city by city.",
      },
      {
        q: "Do you have case studies yet?",
        a: "We're onboarding our first five case-study clients now. Results will be published here as they land — real call volume, lead follow-up, and review numbers, not projections.",
      },
      {
        q: "Can you guarantee results?",
        a: "No legitimate operator guarantees leads or revenue. What we commit to is installing and running the system correctly — answering calls, following up on leads within minutes, and managing your review pipeline — and being transparent about what's working.",
      },
    ],
  },
  {
    title: "Getting started",
    items: [
      {
        q: "What do you need from me to get started?",
        a: "Access to your current website/domain (if you have one), your Google Business Profile, and your Facebook/Instagram accounts. We handle setup and configuration from there and walk you through the system before it goes live.",
      },
      {
        q: "Will I own my website, data, and accounts?",
        a: "Yes. Your website, domain, CRM data, and social accounts stay yours. Nothing is locked behind our agency if you ever decide to leave.",
      },
      {
        q: "Who do I talk to if something breaks?",
        a: "You get a direct line to our team, not a ticket queue. Retainer clients get priority response on anything affecting call answering, lead capture, or booking.",
      },
    ],
  },
];

const faqMainEntity = FAQ_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  }))
);

const aboutPageUrl = `${SITE_URL.replace(/\/$/, "")}/about`;

const ABOUT_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${aboutPageUrl}#faq`,
      mainEntity: faqMainEntity,
    },
    {
      "@type": "LocalBusiness",
      "@id": `${aboutPageUrl}#organization`,
      name: "N-Tech Digital Solutions",
      url: SITE_URL.replace(/\/$/, ""),
      description: aboutDesc,
      email: SITE_CONTACT_EMAIL,
      ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
      founder: { "@id": `${aboutPageUrl}#founder` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Omaha",
        addressRegion: "NE",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "City", name: "Omaha" },
        { "@type": "City", name: "Lincoln" },
        { "@type": "State", name: "Nebraska" },
      ],
      priceRange: "$$",
    },
    {
      "@type": "Person",
      "@id": `${aboutPageUrl}#founder`,
      name: "Robert Nattrass",
      jobTitle: "Founder & Principal",
      worksFor: { "@id": `${aboutPageUrl}#organization` },
      description:
        "Founder of N-Tech Digital Solutions. Builds the website, AI receptionist, lead automation, social media, and review systems that connect a local business's marketing directly to booked appointments.",
      knowsAbout: [
        "AI receptionists",
        "Lead automation and CRM",
        "Web design",
        "Social media automation",
        "Reputation management",
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <MarketingPageShell
      title="About"
      subtitle="We install one connected system so local service businesses stop losing customers to missed calls, slow follow-up, and inconsistent reviews."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_STRUCTURED_DATA) }}
      />
      <p>
        Based in Omaha, we work with local service businesses across the Omaha metro and Lincoln,
        Nebraska that are tired of leaving money on the table — the missed call that never got returned,
        the lead that went cold waiting on a follow-up, the great review that never got asked for.
      </p>
      <p>
        Instead of selling a website, then separately pitching leads, then separately pitching social
        media, we install one system where each piece feeds the next: a call becomes a booked
        appointment, a form fill becomes a followed-up lead, a happy customer becomes a public review.
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
          href="/infrastructure"
          className="font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 dark:text-white dark:decoration-neutral-600 dark:hover:decoration-white"
        >
          see how the system works
        </Link>
        .
      </p>

      <section
        className="rounded-2xl border border-neutral-200 bg-white/80 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50 sm:p-6"
        aria-labelledby="founder-heading"
      >
        <h2
          id="founder-heading"
          className="text-lg font-semibold text-neutral-900 dark:text-white"
        >
          Founder &amp; principal
        </h2>
        <p className="mt-1 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Robert Nattrass
        </p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Robert leads N-Tech Digital Solutions from Omaha, Nebraska. He works hands-on with clients
          to install and run the infrastructure system — website, AI receptionist, lead automation,
          social media management, and review automation — and to make sure it&apos;s actually
          converting calls and clicks into booked appointments, not just sitting there.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Prefer to talk it through?{" "}
          <ScheduleCtaLink className="font-semibold text-neutral-900 underline-offset-2 hover:underline dark:text-white">
            Book a call
          </ScheduleCtaLink>{" "}
          or{" "}
          <Link
            href="/contact"
            className="font-semibold text-neutral-900 underline-offset-2 hover:underline dark:text-white"
          >
            send a message
          </Link>
          .
        </p>
      </section>

      <FaqSection
        heading="Frequently asked questions"
        intro="Grouped by system, pricing, fit, and getting started."
        groups={FAQ_SECTIONS}
      />
    </MarketingPageShell>
  );
}
