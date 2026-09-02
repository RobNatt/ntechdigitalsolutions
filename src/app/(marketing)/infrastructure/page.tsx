import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Globe2, MessageSquareText, Share2, Star } from "lucide-react";
import { PageShell } from "@/components/ntech/PageShell";
import {
  ActivityLog,
  ActivityRow,
  ChannelChip,
  type RowChannel,
} from "@/components/ntech/primitives";
import { ServiceTopicJsonLd } from "@/components/marketing/ServiceTopicJsonLd";
import { ReviewRoutingDemo } from "@/components/marketing/demos/ReviewRoutingDemo";
import { buildFaqJsonLd, canonicalUrl, ogForPath } from "@/lib/seo-metadata";
import { SITE_SERVICE_AREAS } from "@/constants/site";

const infrastructureDesc =
  "The five connected systems N-Tech installs so local service businesses stop leaking leads: website, AI receptionist, lead-form automation, social media management, and Google review automation.";

export const metadata: Metadata = {
  title: "Infrastructure | N-Tech Digital Solutions",
  description: infrastructureDesc,
  alternates: { canonical: canonicalUrl("/infrastructure") },
  openGraph: ogForPath(
    "/infrastructure",
    "Infrastructure | N-Tech Digital Solutions",
    infrastructureDesc
  ),
};

type Component = {
  id: string;
  icon: typeof Globe2;
  name: string;
  serviceType: string;
  description: string;
  bullets: readonly string[];
  /** What this component actually writes into the log. */
  rows: readonly { stamp: string; channel: RowChannel; action: string; outcome: string }[];
  next?: { href: string; label: string };
};

const COMPONENTS: readonly Component[] = [
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
    rows: [
      { stamp: "6:18 PM", channel: "form", action: "Visitor lands on a service page", outcome: "Lead form in view" },
      { stamp: "6:19 PM", channel: "call", action: "Taps Call Now", outcome: "Routed to receptionist" },
    ],
    next: { href: "#ai-receptionist", label: "What answers that call" },
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
    rows: [
      { stamp: "7:42 PM", channel: "call", action: "Incoming call, nobody free", outcome: "Answered" },
      { stamp: "7:44 PM", channel: "calendar", action: "Appointment offered and taken", outcome: "Booked Tue 9:00 AM" },
    ],
    next: { href: "#lead-automation", label: "What happens to a form instead" },
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
    rows: [
      { stamp: "9:15 AM", channel: "form", action: "Form submitted", outcome: "Saved to CRM" },
      { stamp: "9:15 AM", channel: "crm", action: "Confirmation SMS and email sent", outcome: "Delivered" },
    ],
    next: { href: "#social-media", label: "Where else leads arrive" },
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
    rows: [
      { stamp: "1:03 PM", channel: "social", action: "Comment on a post", outcome: "Auto-reply sent" },
      { stamp: "1:04 PM", channel: "crm", action: "Commenter added to pipeline", outcome: "Saved to CRM" },
    ],
    next: { href: "#review-automation", label: "What happens after the job" },
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
    rows: [
      { stamp: "5:30 PM", channel: "review", action: "Job marked complete, request sent", outcome: "5 stars" },
      { stamp: "5:41 PM", channel: "review", action: "Rating below 5 intercepted", outcome: "Private feedback" },
    ],
  },
];

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
    <PageShell
      eyebrow="The system"
      title="One connected system, not five separate vendors."
      lede={`Every component below writes into the same log. A missed call becomes a booked appointment. A social comment becomes a lead. A finished job becomes a public review. Built for local service businesses across ${SITE_SERVICE_AREAS}`}
      width="max-w-5xl"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(FAQ_ITEMS)) }}
      />

      <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12">
        {/* Wayfinding rail — the log's index. */}
        <nav aria-label="Components" className="mb-10 lg:sticky lg:top-24 lg:mb-0 lg:self-start">
          <p className="type-data text-[0.75rem] uppercase text-muted-ink">Five components</p>
          <ol className="mt-4 space-y-0.5">
            {COMPONENTS.map((component, i) => (
              <li key={component.id}>
                <a
                  href={`#${component.id}`}
                  className="type-data flex min-h-11 items-center gap-2.5 rounded text-[0.8125rem] text-muted-ink transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
                >
                  <span className="text-muted-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {component.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-16">
          {COMPONENTS.map((component, i) => {
            const Icon = component.icon;
            return (
              <section
                key={component.id}
                id={component.id}
                className="scroll-mt-24"
                aria-labelledby={`${component.id}-heading`}
              >
                <ServiceTopicJsonLd
                  path={`/infrastructure#${component.id}`}
                  name={component.name}
                  description={component.description}
                  serviceType={component.serviceType}
                />

                <div className="flex items-center gap-3">
                  <span className="type-data text-[0.75rem] text-muted-ink tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="h-5 w-5 text-ink" aria-hidden />
                  <h2
                    id={`${component.id}-heading`}
                    className="type-heading text-[var(--text-step-2)] text-ink"
                  >
                    {component.name}
                  </h2>
                </div>

                <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink">
                  {component.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {component.bullets.map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted-ink"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-live" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <p className="type-data mt-8 text-[0.75rem] uppercase text-muted-ink">
                  What it writes into the log
                </p>
                <ActivityLog label={`${component.name} output`} className="mt-3">
                  {component.rows.map((row) => (
                    <ActivityRow key={row.action} {...row} state="done" />
                  ))}
                </ActivityLog>

                {component.id === "review-automation" ? (
                  <div className="mt-8">
                    <ReviewRoutingDemo />
                  </div>
                ) : null}

                {component.next ? (
                  <p className="mt-8">
                    <Link
                      href={component.next.href}
                      className="type-data inline-flex items-center gap-2 text-[0.8125rem] text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
                    >
                      <span aria-hidden className="text-muted-ink">
                        ↓
                      </span>
                      {component.next.label}
                    </Link>
                  </p>
                ) : null}
              </section>
            );
          })}

          <section aria-labelledby="infra-faq" className="border-t border-rule pt-12">
            <h2 id="infra-faq" className="type-heading text-[var(--text-step-2)] text-ink">
              Infrastructure FAQ
            </h2>
            <div className="mt-6 rounded-xl border border-rule bg-white px-4 sm:px-6">
              {FAQ_ITEMS.map((item, i) => (
                <details
                  key={item.q}
                  className="group border-b border-rule last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-start gap-3 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action">
                    <span className="type-data mt-0.5 shrink-0 text-[0.75rem] text-muted-ink tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="type-heading flex-1 text-[1rem] text-ink">{item.q}</span>
                    <ChannelChip tone="muted" className="mt-0.5 group-open:hidden">
                      Open
                    </ChannelChip>
                  </summary>
                  <p className="pb-5 text-[0.9375rem] leading-relaxed text-muted-ink sm:pl-[2.5rem]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
