export type InvoiceLineItemInput = {
  description: string;
  quantity: number;
  unitPriceCents: number;
};

export type InvoiceLineItemStored = {
  description: string;
  quantity: number;
  unit_price_cents: number;
};

export function normalizeLineItems(raw: unknown): InvoiceLineItemStored[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: InvoiceLineItemStored[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") return null;
    const d = (row as { description?: unknown }).description;
    const q = (row as { quantity?: unknown }).quantity;
    const u = (row as { unit_price_cents?: unknown }).unit_price_cents;
    const u2 = (row as { unitPriceCents?: unknown }).unitPriceCents;
    const desc = typeof d === "string" ? d.trim().slice(0, 500) : "";
    const qty = typeof q === "number" && Number.isFinite(q) ? Math.floor(q) : NaN;
    const cents =
      typeof u === "number" && Number.isFinite(u)
        ? Math.round(u)
        : typeof u2 === "number" && Number.isFinite(u2)
          ? Math.round(u2)
          : NaN;
    if (!desc || qty < 1 || qty > 99_999 || cents < 0 || cents > 100_000_000) return null;
    out.push({ description: desc, quantity: qty, unit_price_cents: cents });
  }
  return out;
}

export function totalsFromLineItems(
  items: InvoiceLineItemStored[],
  taxCents: number
): { subtotal_cents: number; total_cents: number } {
  const subtotal = items.reduce((s, r) => s + r.quantity * r.unit_price_cents, 0);
  const tax = Math.max(0, Math.round(taxCents));
  return { subtotal_cents: subtotal, total_cents: subtotal + tax };
}
