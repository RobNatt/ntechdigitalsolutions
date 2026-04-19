"use client";

import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { OldNewSiteSlider } from "@/components/web-design-services/OldNewSiteSlider";
import { WebDesignCalendlyEmbed } from "@/components/web-design-services/WebDesignCalendlyEmbed";

const CALENDLY_SCHEDULE_URL = resolveCalendlyWidgetUrl();

function trackCta(placement: string, cta: string) {
  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta });
}

const problemCards = [
  {
    title: "Visitors Leave Without Contacting You",
    description:
      "Your website gets traffic but the phone isn't ringing. A confusing layout and weak calls-to-action are silently killing your leads.",
  },
  {
    title: "It Looks Terrible on Mobile",
    description:
      "Over 60% of web traffic is mobile. If your site isn't optimized, you're handing those customers directly to your competitors.",
  },
  {
    title: "Google Can't Find You",
    description:
      "An outdated site with poor SEO means you're invisible to people actively searching for what you offer right now.",
  },
  {
    title: "It Loads Too Slowly",
    description:
      "53% of visitors abandon a site that takes more than 3 seconds to load. A slow website is a leaky bucket — no matter how much you spend on ads.",
  },
  {
    title: "It Doesn't Reflect Your Brand",
    description:
      "Your business has grown, but your website still looks like it did years ago. First impressions matter — and yours may be sending the wrong message.",
  },
  {
    title: "You're Losing to Competitors",
    description:
      "When prospects compare you to competitors online, a polished, modern website wins the deal before a single conversation happens.",
  },
] as const;

const statCards = [
  { stat: "3X", description: "More Leads Generated" },
  { stat: "67%", description: "Faster Load Times" },
  { stat: "Top 3", description: "Average Google Ranking" },
] as const;

const auditChecklist = [
  "Speed Check",
  "Mobile Readiness",
  "Responsiveness",
  "Search Engine Visibility",
  "AI visibility",
] as const;

export function WebDesignServicesLanding() {
  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      <section className="relative -mt-20 overflow-hidden bg-gradient-to-b from-[#E4E7ED] to-[#D8DCE4] px-8 pb-28 pt-40 md:px-14 md:pb-40 md:pt-52 lg:-mt-24 lg:px-20 lg:pb-52 lg:pt-64 xl:px-24 xl:pb-60 xl:pt-80">
        <AuroraBackground />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl tracking-tight md:text-6xl" style={{ color: "#2B2E33" }}>
            Your Website Is Costing You
            <br />
            Customers Every Day
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl" style={{ color: "#7B7F85" }}>
            Find out exactly what&apos;s broken — and how to fix it — with a FREE Website Audit from N-Tech Digital
            Solutions.
          </p>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <a
                href={CALENDLY_SCHEDULE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta("web_design_services_hero", "schedule_free_audit")}
                className="rounded-lg px-8 py-4 transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "#2B2E33", color: "#F5F6F7" }}
              >
                Schedule My Free Audit
              </a>

              <a
                href="#signs"
                className="flex items-center gap-2 transition-opacity hover:opacity-70"
                style={{ color: "#7B7F85" }}
              >
                <span>See if this is for you</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 4L10 16M10 16L16 10M10 16L4 10"
                    stroke="#7B7F85"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            <div className="flex flex-col gap-4 text-sm md:flex-row md:gap-6">
              {["100% Free Audit", "No Obligation", "Results-Driven Agency"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.3333 4L6 11.3333L2.66667 8"
                      stroke="#2B2E33"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ color: "#7B7F85" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="signs" className="px-6 py-20 md:py-24" style={{ backgroundColor: "#2B2E33" }}>
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-center text-sm uppercase tracking-wide" style={{ color: "#C1C4C8" }}>
            Sound Familiar?
          </p>

          <h2 className="mb-4 text-center text-3xl tracking-tight md:text-5xl" style={{ color: "#F5F6F7" }}>
            Signs Your Website Is Working Against You
          </h2>

          <p className="mx-auto mb-16 max-w-3xl text-center" style={{ color: "#C1C4C8" }}>
            If any of these hit close to home, you&apos;re not alone — and the good news is every single one is
            fixable.
          </p>

          <div className="mb-12 grid gap-6 md:grid-cols-3">
            {problemCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border p-8"
                style={{
                  backgroundColor: "#F5F6F7",
                  borderColor: "#7B7F85",
                }}
              >
                <h3 className="mb-4 font-semibold" style={{ color: "#2B2E33" }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed md:text-base" style={{ color: "#7B7F85" }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <a
              href={CALENDLY_SCHEDULE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCta("web_design_services_problems", "get_my_free_audit_now")}
              className="flex items-center gap-3 rounded-lg px-8 py-4 transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "#F5F6F7", color: "#2B2E33" }}
            >
              <span className="font-semibold">GET MY FREE AUDIT NOW</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 10H16M16 10L10 4M16 10L10 16"
                  stroke="#2B2E33"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F6F7] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-center text-sm uppercase tracking-wide" style={{ color: "#7B7F85" }}>
            The Transformation
          </p>

          <h2 className="mb-4 text-center text-3xl tracking-tight md:text-5xl" style={{ color: "#2B2E33" }}>
            From Outdated to Outstanding
          </h2>

          <p className="mx-auto mb-12 max-w-3xl text-center" style={{ color: "#7B7F85" }}>
            We don&apos;t just build websites — we build revenue-generating machines that work for you 24/7.
          </p>

          <div className="mb-16">
            <OldNewSiteSlider />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {statCards.map((card) => (
              <div
                key={card.stat}
                className="rounded-2xl border p-8 text-center"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#C1C4C8",
                }}
              >
                <h3 className="mb-3 text-4xl md:text-5xl" style={{ color: "#2B2E33" }}>
                  {card.stat}
                </h3>
                <p style={{ color: "#7B7F85" }}>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-24" style={{ backgroundColor: "#2B2E33" }}>
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-sm uppercase tracking-wide" style={{ color: "#C1C4C8" }}>
            What&apos;s next?
          </p>

          <h2 className="mb-6 text-center text-3xl tracking-tight md:text-5xl" style={{ color: "#F5F6F7" }}>
            Get a Free Website Audit and Schedule your Discovery Call
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-center" style={{ color: "#C1C4C8" }}>
            Schedule a time to discuss your business needs and the results of your website audit. Every business has
            different needs and requires a different strategy for online growth. The audit will paint a clear picture of
            where you&apos;re starting from. The audit includes:
          </p>

          <div className="mx-auto flex max-w-md flex-col gap-4">
            {auditChecklist.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#F5F6F7" />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="#2B2E33"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-lg" style={{ color: "#F5F6F7" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <WebDesignCalendlyEmbed />
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href={CALENDLY_SCHEDULE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCta("web_design_services_footer", "schedule_free_audit")}
              className="rounded-lg px-8 py-4 font-semibold transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "#F5F6F7", color: "#2B2E33" }}
            >
              Start with a free audit
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
