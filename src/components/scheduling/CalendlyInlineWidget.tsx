"use client";

import Script from "next/script";
import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { cn } from "@/lib/utils";

type CalendlyInlineWidgetProps = {
  className?: string;
};

/**
 * Calendly-hosted inline scheduler (official embed pattern).
 * URL: `NEXT_PUBLIC_CALENDLY_EVENT_URL` or the default discovery event.
 */
export function CalendlyInlineWidget({ className }: CalendlyInlineWidgetProps) {
  const dataUrl = resolveCalendlyWidgetUrl();

  return (
    <>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <div
        className={cn("calendly-inline-widget", className)}
        data-url={dataUrl}
        style={{ minWidth: "320px", height: "700px" }}
      />
    </>
  );
}
