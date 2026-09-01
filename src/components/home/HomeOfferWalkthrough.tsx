"use client";

import { useState } from "react";
import { ChevronDown, MessageSquareText, PhoneCall, Share2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoPlaceholder } from "@/components/marketing/VideoPlaceholder";
import { MarketingInquiryForm } from "@/components/marketing/MarketingInquiryForm";
import { ReviewRoutingDemo } from "@/components/marketing/demos/ReviewRoutingDemo";

type Block = {
  id: string;
  icon: typeof PhoneCall;
  name: string;
  ctaLabel: string;
  why: string;
  render: () => React.ReactNode;
};

const BLOCKS: Block[] = [
  {
    id: "ai-receptionist",
    icon: PhoneCall,
    name: "AI Receptionist",
    ctaLabel: "Learn more",
    why: "Every missed call is a lead you paid to generate and then lost for free. The receptionist answers so that traffic never leaks out the bottom of the funnel.",
    render: () => (
      <VideoPlaceholder title="AI Receptionist walkthrough" description="Video explainer — coming soon" />
    ),
  },
  {
    id: "lead-automation",
    icon: MessageSquareText,
    name: "Lead Form + CRM Automation",
    ctaLabel: "Try it",
    why: "A lead form nobody follows up on is a to-do list, not a system. This is why every submission triggers a real confirmation within seconds instead of sitting in an inbox.",
    render: () => (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
          Try it — this form is live
        </p>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Fill this out with your own info and you&apos;ll get a real confirmation email — the same
          instant confirmation your customers would get.
        </p>
        <div className="mt-5">
          <MarketingInquiryForm analyticsSurface="home_offer_walkthrough_demo" />
        </div>
      </div>
    ),
  },
  {
    id: "social-media",
    icon: Share2,
    name: "Social Media Management",
    ctaLabel: "Learn more",
    why: "Posting without follow-up wastes engagement. This is why every comment or DM on a post gets a response that funnels straight into the same lead pipeline as the website.",
    render: () => (
      <VideoPlaceholder title="Social media management walkthrough" description="Video explainer — coming soon" />
    ),
  },
  {
    id: "review-automation",
    icon: Star,
    name: "Google Review Automation",
    ctaLabel: "Try it",
    why: "One bad public review can undo months of good work. This is why the system decides what goes public before it ever reaches Google, not after.",
    render: () => <ReviewRoutingDemo />,
  },
];

export function HomeOfferWalkthrough() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="border-t border-neutral-200/70 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-900/40 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-white">
            How it works, piece by piece
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Every piece below feeds the next. Click into any of them — some you can try right now.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {BLOCKS.map((block) => {
            const Icon = block.icon;
            const isOpen = openId === block.id;
            return (
              <div
                key={block.id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-950/50"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : block.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-neutral-900 dark:text-white">
                      {block.name}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {block.why}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-white">
                    {block.ctaLabel}
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
                      aria-hidden
                    />
                  </span>
                </button>
                {isOpen ? <div className="px-5 pb-6 sm:px-6">{block.render()}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
