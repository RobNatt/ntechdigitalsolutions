"use client";

import Script from "next/script";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

type CalendlyBookButtonProps = {
  url: string;
  label?: string;
  className?: string;
  brandColor?: string;
  disabled?: boolean;
};

/** Opens a Calendly popup scheduler; falls back to a new tab if the widget script is not ready. */
export function CalendlyBookButton({
  url,
  label = "Book with Calendly",
  className,
  brandColor,
  disabled = false,
}: CalendlyBookButtonProps) {
  const open = useCallback(() => {
    const bookingUrl = url.trim();
    if (!bookingUrl) return;
    if (typeof window !== "undefined" && window.Calendly?.initPopupWidget) {
      window.Calendly.initPopupWidget({ url: bookingUrl });
      return;
    }
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  }, [url]);

  return (
    <>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <button
        type="button"
        disabled={disabled || !url.trim()}
        onClick={open}
        className={cn(
          "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50",
          className
        )}
        style={brandColor ? { backgroundColor: brandColor } : undefined}
      >
        {label}
      </button>
    </>
  );
}
