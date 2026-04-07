export type LeadTemperature = "cold" | "warm" | "hot";

export function scoreInquiryLead(input: {
  phone: string | null;
  company: string | null;
  planInterest: string | null;
  message: string;
  sourcePage: string | null;
}): { score: number; temperature: LeadTemperature } {
  let score = 0;
  if (input.phone) score += 30;
  if (input.company) score += 10;
  if (input.planInterest) score += 20;
  if (input.message.trim().length >= 80) score += 20;
  if (input.sourcePage && /growth-system|plan|pricing/i.test(input.sourcePage)) score += 20;
  if (score >= 70) return { score, temperature: "hot" };
  if (score >= 40) return { score, temperature: "warm" };
  return { score, temperature: "cold" };
}
