"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { CONSTANTS } from "@/constants/links";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { SITE_BUSINESS_PHONE, SITE_CONTACT_EMAIL, siteTelHref } from "@/constants/site";
import { cn } from "@/lib/utils";

type MarketingCtaClusterProps = {
  className?: string;
  /** When true, omit the duplicate “contact form” button (e.g. on /contact). */
  compactContact?: boolean;
};

export function MarketingCtaCluster({
  className,
  compactContact = false,
}: MarketingCtaClusterProps) {
  const tel = siteTelHref();

  return (
    <aside
      className={cn(
        "rounded-2xl border border-neutral-200 bg-neutral-50/90 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/60",
        className
      )}
    >
      <div className="flex flex-wrap gap-2">
        {!compactContact ? (
          <Link
            href={CONSTANTS.CONTACT_PATH}
            onClick={() =>
              trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
                placement: "marketing_cta_cluster",
                cta: "contact_form",
              })
            }
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Contact form
          </Link>
        ) : null}
        {tel && SITE_BUSINESS_PHONE ? (
          <a
            href={tel}
            onClick={() =>
              trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
                placement: "marketing_cta_cluster",
                cta: "call",
              })
            }
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            Call {SITE_BUSINESS_PHONE}
          </a>
        ) : null}
        <Link
          href="/growth-system"
          onClick={() =>
            trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
              placement: "marketing_cta_cluster",
              cta: "growth_system",
            })
          }
          className="inline-flex items-center justify-center rounded-lg border border-sky-500/40 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-950 transition hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-100 dark:hover:bg-sky-900/50"
        >
          Growth System
        </Link>
      </div>

      <p className="mt-4 text-xs text-neutral-600 dark:text-neutral-400">
        <span className="font-medium text-neutral-800 dark:text-neutral-200">Email: </span>
        <a
          href={`mailto:${SITE_CONTACT_EMAIL}`}
          className="font-medium text-sky-800 underline decoration-sky-400/60 underline-offset-2 hover:decoration-sky-700 dark:text-sky-300 dark:hover:decoration-sky-200"
        >
          {SITE_CONTACT_EMAIL}
        </a>
        <span className="mx-1.5 text-neutral-400">·</span>
        <span className="text-neutral-500">We reply within one business day.</span>
      </p>
    </aside>
  );
}
