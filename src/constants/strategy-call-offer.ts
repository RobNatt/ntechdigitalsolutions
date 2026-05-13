/** Strategy-call qualification funnel — monthly revenue tiers (self-reported). */
export const STRATEGY_MONTHLY_REVENUE_OPTIONS = [
  { value: "under-5k", label: "Under $5k/month" },
  { value: "5k-15k", label: "$5k–$15k/month" },
  { value: "15k-50k", label: "$15k–$50k/month" },
  { value: "50k-100k", label: "$50k–$100k/month" },
  { value: "100k-plus", label: "$100k+/month" },
] as const;

export type StrategyMonthlyRevenueValue = (typeof STRATEGY_MONTHLY_REVENUE_OPTIONS)[number]["value"];

const QUALIFIED = new Set<string>(["15k-50k", "50k-100k", "100k-plus"]);

export function isStrategySessionQualified(monthlyRevenue: string): boolean {
  return QUALIFIED.has(monthlyRevenue);
}

export function strategyMonthlyRevenueLabel(value: string): string {
  const row = STRATEGY_MONTHLY_REVENUE_OPTIONS.find((o) => o.value === value);
  return row?.label ?? value;
}
