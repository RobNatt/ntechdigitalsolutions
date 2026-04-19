/**
 * Registry of marketing funnel landings used for:
 * - CEO dashboard quick links (`CeoFunnelPagesSection`) — grouped by niche
 * - First-party `funnel_view` analytics (`AnalyticsTracker`)
 *
 * Keep paths in sync with `src/app/(marketing)/...` routes.
 */
export type MarketingFunnelPageNiche =
  /** Diagnostic / trust / pain funnels and audit LP for dental practices */
  | "Dental practice marketing"
  /** Tiered dental patient acquisition product pages */
  | "PatientFlow™ (dental packages)";

export type MarketingFunnelPageDef = {
  path: `/${string}`;
  /** Stable slug stored in analytics metadata (`funnel_view.funnel`). */
  funnel: string;
  label: string;
  niche: MarketingFunnelPageNiche;
};

/** Order defines niche order and link order within each niche. */
export const MARKETING_FUNNEL_PAGES: readonly MarketingFunnelPageDef[] = [
  {
    path: "/free-patient-flow-audit",
    funnel: "free_patient_flow_audit",
    label: "Free Patient Flow Audit™",
    niche: "Dental practice marketing",
  },
  {
    path: "/dental-patient-growth-case-study",
    funnel: "dental_patient_growth_case_study",
    label: "Dental patient growth case study",
    niche: "Dental practice marketing",
  },
  {
    path: "/why-dental-practices-trust-ntech-digital",
    funnel: "why_dental_practices_trust_ntech",
    label: "Why dental practices trust N-Tech",
    niche: "Dental practice marketing",
  },
  {
    path: "/new-patient-leak-funnel",
    funnel: "new_patient_leak_funnel",
    label: "New patient leak funnel",
    niche: "Dental practice marketing",
  },
  {
    path: "/why-dental-website-isnt-booking-patients",
    funnel: "why_dental_website_isnt_booking_patients",
    label: "Why your dental website isn't booking patients",
    niche: "Dental practice marketing",
  },
  {
    path: "/why-agencies-fail-dentists",
    funnel: "why_agencies_fail_dentists",
    label: "Why agencies fail dentists",
    niche: "Dental practice marketing",
  },
  {
    path: "/cost-of-lost-patients",
    funnel: "cost_of_lost_patients",
    label: "Cost of lost patients",
    niche: "Dental practice marketing",
  },
  {
    path: "/dental-roi-calculator",
    funnel: "dental_roi_calculator",
    label: "Dental ROI calculator",
    niche: "Dental practice marketing",
  },
  {
    path: "/patientflow-foundation",
    funnel: "patientflow_foundation",
    label: "PatientFlow Foundation™",
    niche: "PatientFlow™ (dental packages)",
  },
  {
    path: "/patientflow-lead-machine",
    funnel: "patientflow_lead_machine",
    label: "PatientFlow Lead Machine™",
    niche: "PatientFlow™ (dental packages)",
  },
  {
    path: "/patientflow-growth-system",
    funnel: "patientflow_growth_system",
    label: "PatientFlow Growth System™",
    niche: "PatientFlow™ (dental packages)",
  },
  {
    path: "/patientflow-premium-partner",
    funnel: "patientflow_premium_partner",
    label: "Premium Growth Partner™",
    niche: "PatientFlow™ (dental packages)",
  },
] as const;

export function getMarketingFunnelSlugForPath(pathname: string): string | null {
  const base = pathname.split("?")[0];
  if (!base.startsWith("/")) return null;
  const hit = MARKETING_FUNNEL_PAGES.find((x) => x.path === base);
  return hit?.funnel ?? null;
}

/** CEO dashboard: one section per niche, same links as `MARKETING_FUNNEL_PAGES`. */
export function getMarketingFunnelNichesForDashboard(): {
  niche: string;
  items: { href: string; label: string }[];
}[] {
  const order: string[] = [];
  const map = new Map<string, { href: string; label: string }[]>();
  for (const p of MARKETING_FUNNEL_PAGES) {
    if (!map.has(p.niche)) {
      order.push(p.niche);
      map.set(p.niche, []);
    }
    map.get(p.niche)!.push({ href: p.path, label: p.label });
  }
  return order.map((niche) => ({ niche, items: map.get(niche)! }));
}
