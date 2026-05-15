export const RANKVAULT_PATH = "/rankvault";

export const RANKVAULT_MONTHLY_REVENUE_OPTIONS = [
  "Under $5k/month",
  "$5k-$15k/month",
  "$15k-$50k/month",
  "$50k-$100k/month",
  "$100k+/month",
] as const;

export type RankVaultMonthlyRevenueValue = (typeof RANKVAULT_MONTHLY_REVENUE_OPTIONS)[number];
