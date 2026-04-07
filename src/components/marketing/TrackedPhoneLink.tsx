"use client";

import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";

export function TrackedPhoneLink({
  phone,
  className,
}: {
  phone: string;
  className?: string;
}) {
  return (
    <a
      href={`tel:${phone.replace(/\s/g, "")}`}
      onClick={() =>
        trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CALL_CLICK, {
          placement: "contact_page",
        })
      }
      className={className}
    >
      {phone}
    </a>
  );
}
