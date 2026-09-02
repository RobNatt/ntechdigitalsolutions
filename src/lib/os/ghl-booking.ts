import type { OsLeadRow } from "@/lib/os/leads-types";
import type { OsSettingsRow } from "@/lib/os/types";

const GHL_ORIGIN = "https://calendar.ntechdigitalsolutions.com";

export type OsGhlBookingConfig = {
  discovery: string; // booking ID for discovery calls
  proposal: string; // booking ID for proposal meetings
};

export function resolveOsGhlBookingConfig(
  settings: Pick<OsSettingsRow, "integration_ghl_discovery_booking_id" | "integration_ghl_proposal_booking_id">
): OsGhlBookingConfig | null {
  const discovery = settings.integration_ghl_discovery_booking_id?.trim();
  const proposal = settings.integration_ghl_proposal_booking_id?.trim();
  if (!discovery) return null;
  return {
    discovery,
    proposal: proposal || discovery,
  };
}

export function pickGhlBookingIdForLead(leadStatus: string, config: OsGhlBookingConfig): string {
  const s = leadStatus.trim().toLowerCase();
  if (s.includes("proposal")) return config.proposal;
  if (s.includes("discovery")) return config.discovery;
  return config.discovery;
}

export function leadGhlContactInfo(lead: OsLeadRow): { name: string; email: string } {
  const name = lead.lead_name?.trim() || lead.business_name?.trim() || "";
  const email = lead.email?.trim() || "";
  return { name, email };
}

export function buildGhlBookingUrl(
  lead: OsLeadRow,
  config: OsGhlBookingConfig
): string {
  const bookingId = pickGhlBookingIdForLead(lead.status, config);
  const contactInfo = leadGhlContactInfo(lead);
  const url = new URL(`${GHL_ORIGIN}/widget/booking/${bookingId}`);

  if (contactInfo.name) {
    url.searchParams.set("name", contactInfo.name);
  }
  if (contactInfo.email) {
    url.searchParams.set("email", contactInfo.email);
  }
  // Pass lead ID for tracking
  if (lead.id) {
    url.searchParams.set("utm_content", lead.id);
  }

  return url.toString();
}

export function ghlEventLabelForLead(leadStatus: string): string {
  const s = leadStatus.trim().toLowerCase();
  if (s.includes("proposal")) return "Proposal meeting";
  if (s.includes("discovery")) return "Discovery call";
  return "Discovery call";
}
