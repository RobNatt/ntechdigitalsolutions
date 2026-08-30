import type { Metadata } from "next";
import { Bot, Globe2, MessageSquareText, Share2, Star } from "lucide-react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { ServiceTopicJsonLd } from "@/components/marketing/ServiceTopicJsonLd";
import { FaqSection } from "@/components/marketing/FaqSection";
import { VideoPlaceholder } from "@/components/marketing/VideoPlaceholder";
import { MarketingInquiryForm } from "@/components/marketing/MarketingInquiryForm";
import { ReviewRoutingDemo } from "@/components/marketing/demos/ReviewRoutingDemo";
import { buildFaqJsonLd, canonicalUrl, ogForPath } from "@/lib/seo-metadata";
import { SITE_SERVICE_AREAS } from "@/constants/site";

const infrastructureDesc =
  "The five connected systems N-Tech installs so local service businesses stop leaking leads: website, AI receptionist, lead-form automation, social media management, and Google review automation.";

export const metadata: Metadata = {
  title: "Infrastructure | N-Tech Digital Solutions",
  description: infrastructureDesc,
  alternates: { canonical: canonicalUrl("/infrastructure") },
  openGraph: ogForPath("/infrastructure", "Infrastructure | N-Tech Digital Solutions", infrastructureDesc),
};

const COMPONENTS = [
  {
    id: "website",
    icon: Globe2,
    name: "Website",
    serviceType: "Website design and hosting",
    description:
      "A fast, mobile-first website built around one job: turn visitors into contacts. Every page carries a lead form and a Call Now button — no dead ends, no guessing what to click next.",
    bullets: [
      "Lead form wired directly into the system below — no manual entry",
      "Call Now button routes straight to your AI receptionist",
      "Built for speed and mobile, so it doesn't lose visitors before they act",
    ],
  },
  {
    id: "ai-receptionist",
    icon: Bot,
    name: "AI Receptionist",
    serviceType: "AI-powered call answering and appointment booking",
    description:
      "Every call your team can't take gets answered anyway. The AI receptionist picks up, attempts to book an appointment, collects the caller's info, and pushes it straight into your CRM.",
    bullets: [
      "Answers calls you'd otherwise miss — nights, weekends, busy days",
      "Attempts to book the appointment on the call, not after",
      "Every caller's details land in your CRM automatically",
    ],
  },
  {
    id: "lead-automation",
    icon: MessageSquareText,
    name: "Lead Form Automation",
    serviceType: "Lead capture and follow-up automation",
    description:
      "A form submission means nothing if nobody follows up fast. Every submission hits your CRM instantly and triggers an SMS/email to confirm the lead's contact info — then your AI receptionist takes over follow-up.",
    bullets: [
      "Instant CRM entry the moment a form is submitted",
      "Automatic SMS/email confirms the lead is reachable",
      "AI receptionist follow-up kicks in once contact info is confirmed",
    ],
  },
  {
    id: "social-media",
    icon: Share2,
    name: "Social Media Management",
    serviceType: "Social media management and lead automation",
    description:
      "We manage your Facebook and Instagram posting, plus automation that reaches out to anyone who engages with a post — turning likes and comments into conversations that funnel into your lead system.",
    bullets: [
      "Ongoing post management on Facebook and Instagram",
      "Automated outreach (DM/CTA) to anyone who engages with a post",
      "Engaged followers get funneled straight into the same lead pipeline",
    ],
  },
  {
    id: "review-automation",
    icon: Star,
    name: "Google Review Automation",
    serviceType: "Reputation management and review automation",
    description:
      "5-star experiences get routed to post publicly on Google. Anything below 5 stars gets intercepted as private feedback first, so you can fix it before it ever becomes a public review.",
    bullets: [
      "5-star reviews are routed to post publicly",
      "Anything less is caught privately as feedback, not a public review",
      "Protects your rating while surfacing real complaints you can act on",
    ],
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "What is included in N-Tech's digital infrastructure system?",
    a: "Five connected components: a website with lead form and Call Now button, an AI receptionist that answers and books calls, lead-form automation that pushes submissions into your CRM with instant follow-up, social media management with engagement automation, and Google review automation. They're built to work together, not as separate add-ons.",
  },
  {
    q: "Do I need all 5 components, or can I start with just one?",
    a: "The system is designed as one connected infrastructure — each piece feeds the next, from a missed call to a booked appointment. Our primary offer bundles all five for that reason. If budget is the blocker, ask about the baseline plan with a smaller set of components.",
  },
  {
    q: "How is this different from just having a website?",
    a: "A website alone doesn't answer your phone, follow up on a lead within minutes, manage your social presence, or protect your review rating. Those are the leaks that cost local businesses the most customers — the website is one component of the system, not the whole system.",
  },
  {
    q: "Does the AI receptionist replace my staff answering the phone?",
    a: "It catches the calls you'd otherwise miss — after hours, during busy periods, or when no one's free to answer. It attempts to book the appointment and always logs the caller's details in your CRM, so no call goes untracked.",
  },
  {
    q: "What happens to a negative review under this system?",
    a: "Anything below 5 stars is intercepted as private feedback instead of going live publicly. You see the complaint and can respond directly, while your public Google rating reflects your best experiences.",
  },
] as const;

export default function InfrastructurePage() {
  return (
    <MarketingPageShell
      title="One connected system, not five separate vendors."
      subtitle={`Every component below talks to the others. A missed call becomes a booked appointment. A social comment becomes a lead. A 5-star moment becomes a public review. Built for local service businesses across ${SITE_SERVICE_AREAS}`}
      maxWidthClass="max-w-4xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(FAQ_ITEMS)) }}
      />

      <div className="space-y-10">
        {COMPONENTS.map((component) => {
          const Icon = component.icon;
          return (
            <section
              key={component.id}
              id={component.id}
              className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50 sm:p-8"
              aria-labelledby={`${component.id}-heading`}
            >
              <ServiceTopicJsonLd
                path={`/infrastructure#${component.id}`}
                name={component.name}
                description={component.description}
                serviceType={component.serviceType}
              />
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/50 dark:text-sky-300">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2
                  id={`${component.id}-heading`}
                  className="text-xl font-semibold text-neutral-900 dark:text-white"
                >
                  {component.name}
                </h2>
              </div>
              <p className="mt-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {component.description}
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                {component.bullets.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500"
                      aria-hidden
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {component.id === "review-automation" ? (
                <div className="mt-6">
                  <ReviewRoutingDemo />
                </div>
              ) : null}

              {component.id === "lead-automation" ? (
                <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-400">
                    Try it — this form is live
                  </p>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Fill this out with your own info and you&apos;ll get a real confirmation email.
                  </p>
                  <div className="mt-4">
                    <MarketingInquiryForm analyticsSurface="infrastructure_demo" />
                  </div>
                </div>
              ) : null}

              {component.id === "ai-receptionist" ? (
                <div className="mt-6">
                  <VideoPlaceholder
                    title="AI Receptionist walkthrough"
                    description="Video explainer — coming soon"
                  />
                </div>
              ) : null}

              {component.id === "social-media" ? (
                <div className="mt-6">
                  <VideoPlaceholder
                    title="Social media management walkthrough"
                    description="Video explainer — coming soon"
                  />
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <FaqSection
        heading="Infrastructure FAQ"
        intro="Common questions about how the five components fit together."
        items={FAQ_ITEMS}
      />
    </MarketingPageShell>
  );
}
