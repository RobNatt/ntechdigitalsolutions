"use client";

import { MarketingInquiryForm } from "@/components/marketing/MarketingInquiryForm";
import { SITE_SERVICE_AREAS } from "@/constants/site";
import { cn } from "@/lib/utils";

type HeroDiscoveryLeadPanelProps = {
  className?: string;
};

/** Compact discovery CTA + form for the hero right column (large screens). */
export function HeroDiscoveryLeadPanel({ className }: HeroDiscoveryLeadPanelProps) {
  return (
    <aside
      className={cn("relative z-20 w-full max-w-md", className)}
      aria-label="Request a discovery call"
    >
      <div className="rounded-2xl border border-neutral-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-neutral-700/70 dark:bg-neutral-900/60 sm:p-5">
        <p className="mb-3 rounded-md border border-sky-200/80 bg-sky-50/80 px-2.5 py-1.5 text-[11px] font-medium text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-100">
          <span className="font-semibold">Service area:</span> {SITE_SERVICE_AREAS}
        </p>
        <MarketingInquiryForm showBudget analyticsSurface="home_discovery" className="space-y-3.5" />
      </div>
    </aside>
  );
}
