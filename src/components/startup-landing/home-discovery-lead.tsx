"use client";

import { MarketingInquiryForm } from "@/components/marketing/MarketingInquiryForm";

export function HomeDiscoveryLead() {
  return (
    <section
      aria-labelledby="home-discovery-heading"
      className="relative z-20 mx-auto w-full max-w-lg px-4 pb-4 pt-14 md:max-w-xl md:px-6 md:pb-8 md:pt-20"
    >
      <h2
        id="home-discovery-heading"
        className="text-balance text-center text-[1.25rem] font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-xl md:text-2xl md:leading-snug"
      >
        Why wait? Submit your contact information for a discovery call and we will call you
      </h2>
      <div className="mt-8 rounded-2xl border border-neutral-200/90 bg-white/85 p-5 shadow-sm backdrop-blur-md dark:border-neutral-700/70 dark:bg-neutral-900/55 md:p-7">
        <MarketingInquiryForm showBudget analyticsSurface="home_discovery" />
      </div>
    </section>
  );
}
