import { GROWTH_SYSTEM_CALENDLY_EVENT_URL } from "@/constants/growth-system-offer";

/**
 * Appends Calendly-supported prefill query params (name + email).
 * @see https://help.calendly.com/hc/en-us/articles/226766767-Pre-fill-form-invitee-information-on-the-scheduling-page
 */
export function buildCalendlyPrefillUrl(params: {
  fullName: string;
  email: string;
  baseUrl?: string;
}): string {
  const base = (params.baseUrl ?? GROWTH_SYSTEM_CALENDLY_EVENT_URL).replace(/\/$/, "");
  const u = new URL(base);
  const name = params.fullName.trim();
  const email = params.email.trim().toLowerCase();
  if (name) u.searchParams.set("name", name);
  if (email) u.searchParams.set("email", email);
  return u.toString();
}
