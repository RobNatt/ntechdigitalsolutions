/**
 * Registry of marketing funnel landings used for:
 * - CEO dashboard quick links (`CeoFunnelPagesSection`)
 * - First-party `funnel_view` analytics (`MarketingFunnelViewTracker`)
 *
 * Keep paths in sync with `src/app/(marketing)/...` routes.
 */
export type MarketingFunnelPageGroupTitle =
  | "Conversion"
  | "Dental funnel landings"
  | "PatientFlow™ offers";

export type MarketingFunnelPageDef = {
  path: `/${string}`;
  /** Stable slug stored in analytics metadata (`funnel_view.funnel`). */
  funnel: string;
  label: string;
  group: MarketingFunnelPageGroupTitle;
};

/** Order defines group order and row order within each group. */
export const MARKETING_FUNNEL_PAGES: readonly MarketingFunnelPageDef[] = [
  {
    path: "/free-patient-flow-audit",
    funnel: "free_patient_flow_audit",
    label: "Free Patient Flow Audit™",
    group: "Conversion",
  },
  {
    path: "/dental-patient-growth-case-study",
    funnel: "dental_patient_growth_case_study",
    label: "Dental patient growth case study",
    group: "Dental funnel landings",
  },
  {
    path: "/why-dental-practices-trust-ntech-digital",
    funnel: "why_dental_practices_trust_ntech",
    label: "Why dental practices trust N-Tech",
    group: "Dental funnel landings",
  },
  {
    path: "/new-patient-leak-funnel",
    funnel: "new_patient_leak_funnel",
    label: "New patient leak funnel",
    group: "Dental funnel landings",
  },
  {
    path: "/why-dental-website-isnt-booking-patients",
    funnel: "why_dental_website_isnt_booking_patients",
    label: "Why your dental website isn't booking patients",
    group: "Dental funnel landings",
  },
  {
    path: "/why-agencies-fail-dentists",
    funnel: "why_agencies_fail_dentists",
    label: "Why agencies fail dentists",
    group: "Dental funnel landings",
  },
  {
    path: "/cost-of-lost-patients",
    funnel: "cost_of_lost_patients",
    label: "Cost of lost patients",
    group: "Dental funnel landings",
  },
  {
    path: "/dental-roi-calculator",
    funnel: "dental_roi_calculator",
    label: "Dental ROI calculator",
    group: "Dental funnel landings",
  },
  {
    path: "/patientflow-foundation",
    funnel: "patientflow_foundation",
    label: "PatientFlow Foundation™",
    group: "PatientFlow™ offers",
  },
  {
    path: "/patientflow-lead-machine",
    funnel: "patientflow_lead_machine",
    label: "PatientFlow Lead Machine™",
    group: "PatientFlow™ offers",
  },
  {
    path: "/patientflow-growth-system",
    funnel: "patientflow_growth_system",
    label: "PatientFlow Growth System™",
    group: "PatientFlow™ offers",
  },
  {
    path: "/patientflow-premium-partner",
    funnel: "patientflow_premium_partner",
    label: "Premium Growth Partner™",
    group: "PatientFlow™ offers",
  },
] as const;

export function getMarketingFunnelSlugForPath(pathname: string): string | null {
  const base = pathname.split("?")[0];
  if (!base.startsWith("/")) return null;
  const hit = MARKETING_FUNNEL_PAGES.find((x) => x.path === base);
  return hit?.funnel ?? null;
}

/** Dashboard sidebar: grouped links (same order as `MARKETING_FUNNEL_PAGES`). */
export function getMarketingFunnelPageGroupsForDashboard(): {
  title: string;
  items: { href: string; label: string }[];
}[] {
  const order: string[] = [];
  const map = new Map<string, { href: string; label: string }[]>();
  for (const p of MARKETING_FUNNEL_PAGES) {
    if (!map.has(p.group)) {
      order.push(p.group);
      map.set(p.group, []);
    }
    map.get(p.group)!.push({ href: p.path, label: p.label });
  }
  return order.map((title) => ({ title, items: map.get(title)! }));
}
