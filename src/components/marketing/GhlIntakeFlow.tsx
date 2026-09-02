"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";

const FORM_ID = "R5cLPJUnb6wNr6YN3QXP";
const BOOKING_ID = "6LMDYsdQ50MGu1XW1oRR";
const GHL_ORIGIN = "https://calendar.ntechdigitalsolutions.com";

interface GhlIntakeFlowProps {
  /** Tag for analytics (e.g. "home", "infrastructure"). */
  analyticsSurface: string;
}

/**
 * GHL-hosted intake form -> "book a call" hand-off, used identically on the homepage and the
 * infrastructure page. GHL's embed protocol posts array-shaped messages from the form iframe
 * (confirmed pattern: `["msgsndr-booking-complete", ...]` for calendar bookings; field-data
 * messages for form submissions carry the submitted values, e.g. "email", as a JSON string
 * inside the array). Since GHL doesn't document a single official "form submitted" event name,
 * detection here is intentionally layered:
 *   1. Best-effort auto-detect: any array message from *this* form iframe that mentions "email"
 *      is treated as a real submission (resize/init pings don't carry field data).
 *   2. Manual fallback link, always visible under the form, so the booking step is never fully
 *      gated behind a heuristic that might not match GHL's exact payload in production.
 */
export function GhlIntakeFlow({ analyticsSurface }: GhlIntakeFlowProps) {
  const [submitted, setSubmitted] = useState(false);
  const formIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== GHL_ORIGIN) return;
      if (event.source !== formIframeRef.current?.contentWindow) return;
      if (!Array.isArray(event.data)) return;

      let payload = "";
      try {
        payload = JSON.stringify(event.data).toLowerCase();
      } catch {
        return;
      }
      if (!payload.includes("email")) return;

      setSubmitted(true);
      trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.INFO_SUBMIT, {
        surface: `${analyticsSurface}_ghl_intake`,
        status: "submitted",
      });
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [analyticsSurface]);

  function revealBooking() {
    if (submitted) return;
    setSubmitted(true);
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CTA_CLICK, {
      placement: `${analyticsSurface}_ghl_intake_manual`,
    });
  }

  return (
    <div>
      <Script src="https://calendar.ntechdigitalsolutions.com/js/form_embed.js" strategy="afterInteractive" />

      {!submitted ? (
        <>
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            <iframe
              ref={formIframeRef}
              src={`${GHL_ORIGIN}/widget/form/${FORM_ID}`}
              style={{ width: "100%", height: "837px", border: "none", borderRadius: 8 }}
              id={`inline-${FORM_ID}`}
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Infrastructure Intake form"
              data-height="837"
              data-layout-iframe-id={`inline-${FORM_ID}`}
              data-form-id={FORM_ID}
              data-cookie-consent="true"
              data-cookie-consent-provider="auto"
              title="Infrastructure Intake form"
            />
          </div>
          <button
            type="button"
            onClick={revealBooking}
            className="mt-4 text-sm font-medium text-neutral-500 underline underline-offset-4 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200"
          >
            Already submitted the form above? Book your call now
          </button>
        </>
      ) : (
        <div>
          <div className="text-center">
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">Thanks — we got it.</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Lock in a time below and we&apos;ll talk through your system.
            </p>
          </div>
          <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            <iframe
              src={`${GHL_ORIGIN}/widget/booking/${BOOKING_ID}`}
              allow="payment"
              style={{ width: "100%", height: "780px", border: "none", overflow: "hidden" }}
              scrolling="no"
              id={`${BOOKING_ID}_1`}
              title="Book a call"
            />
          </div>
        </div>
      )}
    </div>
  );
}
