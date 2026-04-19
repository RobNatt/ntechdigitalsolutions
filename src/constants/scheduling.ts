import { CONSTANTS } from "@/constants/links";

/** Calendly event URL when `NEXT_PUBLIC_CALENDLY_EVENT_URL` is set. */
export function getCalendlyEventUrl(): string | undefined {
  const u = process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL?.trim();
  return u || undefined;
}
