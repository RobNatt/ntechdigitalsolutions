import { resolveCalendlyWidgetUrl } from "@/constants/scheduling";
import { buildCalendlyPrefillUrl } from "@/lib/growth-system/build-calendly-prefill-url";
import type { OsLeadRow } from "@/lib/os/leads-types";
import type { OsSettingsRow } from "@/lib/os/types";

export type OsCalendlyBookingUrls = {
  discovery: string;
  proposal: string;
};

export function resolveOsCalendlyBookingUrls(
  settings: Pick<
    OsSettingsRow,
    "integration_calendly_discovery_url" | "integration_calendly_proposal_url"
  >
): OsCalendlyBookingUrls {
  const fallback = resolveCalendlyWidgetUrl();
  const discovery = settings.integration_calendly_discovery_url?.trim() || fallback;
  const proposal =
    settings.integration_calendly_proposal_url?.trim() ||
    settings.integration_calendly_discovery_url?.trim() ||
    fallback;
  return { discovery, proposal };
}

export function pickCalendlyBaseUrlForLead(leadStatus: string, urls: OsCalendlyBookingUrls): string {
  const s = leadStatus.trim().toLowerCase();
  if (s.includes("proposal")) return urls.proposal;
  if (s.includes("discovery")) return urls.discovery;
  return urls.discovery;
}

export function leadCalendlyInviteeName(lead: OsLeadRow): string {
  return lead.lead_name?.trim() || lead.business_name?.trim() || "";
}

export function buildLeadCalendlyBookingUrl(lead: OsLeadRow, urls: OsCalendlyBookingUrls): string {
  const base = pickCalendlyBaseUrlForLead(lead.status, urls);
  return buildCalendlyPrefillUrl({
    baseUrl: base,
    fullName: leadCalendlyInviteeName(lead),
    email: lead.email?.trim() || "",
    utmContent: lead.id,
  });
}

export function calendlyEventLabelForLead(leadStatus: string): string {
  const s = leadStatus.trim().toLowerCase();
  if (s.includes("proposal")) return "Proposal meeting";
  if (s.includes("discovery")) return "Discovery call";
  return "Discovery call";
}
