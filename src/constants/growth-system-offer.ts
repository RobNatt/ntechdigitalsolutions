/** Public funnel path (no trailing slash). */
export const GROWTH_SYSTEM_FUNNEL_PATH = "/growthsystem";

/** Calendly event for qualified applicants (30-minute call). */
export const GROWTH_SYSTEM_CALENDLY_EVENT_URL =
  process.env.NEXT_PUBLIC_GROWTH_SYSTEM_CALENDLY_URL?.trim() ??
  "https://calendly.com/robertnattrass/30-minute-call";

export const GROWTH_SYSTEM_OFFER_NAME =
  "The 3 Step Scale System for Service Businesses";

export const MONTHLY_REVENUE_OPTIONS = [
  { value: "0", label: "$0" },
  { value: "1k-3k", label: "$1,000 – $3,000" },
  { value: "3k-5k", label: "$3,000 – $5,000" },
  { value: "5k-10k", label: "$5,000 – $10,000" },
  { value: "10k-plus", label: "$10,000+" },
] as const;

export type MonthlyRevenueValue = (typeof MONTHLY_REVENUE_OPTIONS)[number]["value"];

export function isQualifiedRevenue(value: string): value is "5k-10k" | "10k-plus" {
  return value === "5k-10k" || value === "10k-plus";
}

export function revenueLabel(value: string): string {
  const row = MONTHLY_REVENUE_OPTIONS.find((o) => o.value === value);
  return row?.label ?? value;
}
