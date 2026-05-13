"use client";

import Script from "next/script";
import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { cn } from "@/lib/utils";

type CalendlyInlineWidgetProps = {
  className?: string;
  /** Full Calendly event URL (e.g. with prefill query). Overrides default widget URL when set. */
  eventUrl?: string;
};

/**
 * Calendly-hosted inline scheduler (official embed pattern).
 * URL: `eventUrl`, else `NEXT_PUBLIC_CALENDLY_EVENT_URL`, else the default discovery event.
 */
export function CalendlyInlineWidget({ className, eventUrl }: CalendlyInlineWidgetProps) {
  const dataUrl = (eventUrl?.trim() || resolveCalendlyWidgetUrl()).replace(/\/$/, "");

  return (
    <>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <div
        key={dataUrl}
        className={cn("calendly-inline-widget", className)}
        data-url={dataUrl}
        style={{ minWidth: "320px", height: "700px" }}
      />
    </>
  );
}
