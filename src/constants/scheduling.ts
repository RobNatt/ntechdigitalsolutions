/** Default discovery event for inline embeds when `NEXT_PUBLIC_CALENDLY_EVENT_URL` is unset. */
export const DEFAULT_CALENDLY_EVENT_URL =
  "https://calendly.com/robnattrass-ntechdigital/discovery-call";

/** Calendly event URL when `NEXT_PUBLIC_CALENDLY_EVENT_URL` is set (used for CTA links that prefer in-app fallback). */
export function getCalendlyEventUrl(): string | undefined {
  const u = process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL?.trim();
  return u || undefined;
}

/** URL for inline Calendly widgets — env override or default discovery call. */
export function resolveCalendlyWidgetUrl(): string {
  return getCalendlyEventUrl() ?? DEFAULT_CALENDLY_EVENT_URL;
}
