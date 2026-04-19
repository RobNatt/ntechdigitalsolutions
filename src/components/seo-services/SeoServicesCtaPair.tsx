"use client";

import Link from "next/link";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";

type SeoServicesCtaPairProps = {
  scheduleUrl: string;
  contactAuditHref: string;
  placement: string;
  className?: string;
};

export function SeoServicesCtaPair({ scheduleUrl, contactAuditHref, placement, className }: SeoServicesCtaPairProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <Link
        href={contactAuditHref}
        onClick={() =>
          trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta: "seo_audit" })
        }
        className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Get an SEO Audit
      </Link>
      <a
        href={scheduleUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, { placement, cta: "discovery_call" })
        }
        className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        Schedule a Discovery Call
      </a>
    </div>
  );
}
