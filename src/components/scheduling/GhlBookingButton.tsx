"use client";

import Script from "next/script";
import { cn } from "@/lib/utils";

type GhlBookingButtonProps = {
  bookingUrl: string;
  label?: string;
  className?: string;
  brandColor?: string;
  disabled?: boolean;
};

export function GhlBookingButton({
  bookingUrl,
  label = "Book a call",
  className,
  brandColor,
  disabled = false,
}: GhlBookingButtonProps) {
  const url = bookingUrl.trim();

  return (
    <>
      <Script src="https://calendar.ntechdigitalsolutions.com/js/form_embed.js" strategy="lazyOnload" />
      <button
        type="button"
        disabled={disabled || !url}
        onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
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
