"use client";

import Script from "next/script";
import { getCalendlyEventUrl } from "@/constants/scheduling";

const calendlyUrl = getCalendlyEventUrl();

export function WebDesignCalendlyEmbed() {
  if (!calendlyUrl) {
    return (
      <div
        className="mx-auto flex min-h-[420px] max-w-3xl flex-col items-center justify-center gap-4 rounded-2xl border px-6 py-16 text-center"
        style={{
          borderColor: "#7B7F85",
          backgroundColor: "rgba(245,246,247,0.06)",
          color: "#C1C4C8",
        }}
      >
        <p className="text-lg" style={{ color: "#F5F6F7" }}>
          Book your discovery call
        </p>
        <p className="max-w-md text-sm leading-relaxed">
          Your live Calendly calendar will load in this space once we connect your scheduling link to the site.
        </p>
      </div>
    );
  }

  return (
    <>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <div
        className="calendly-inline-widget mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-[#F5F6F7]"
        data-url={calendlyUrl}
        style={{ minWidth: "320px", minHeight: "700px" }}
      />
    </>
  );
}
