export const LEAD_TEMPERATURES = ["hot", "warm", "cold"] as const;

export type LeadTemperature = (typeof LEAD_TEMPERATURES)[number];

export function isLeadTemperature(s: string): s is LeadTemperature {
  return (LEAD_TEMPERATURES as readonly string[]).includes(s);
}

export function normalizeLeadTemperature(value: unknown): LeadTemperature {
  const s = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (isLeadTemperature(s)) return s;
  return "warm";
}

export function temperatureLabel(t: string): string {
  const x = normalizeLeadTemperature(t);
  return x.charAt(0).toUpperCase() + x.slice(1);
}
