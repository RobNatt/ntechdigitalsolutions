"use client";

import { CalendlyInlineWidget } from "@/components/scheduling/CalendlyInlineWidget";

/** Calendly block in the web-design services footer (dark section). */
export function WebDesignCalendlyEmbed() {
  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#F5F6F7] shadow-sm">
      <CalendlyInlineWidget className="w-full" />
    </div>
  );
}
