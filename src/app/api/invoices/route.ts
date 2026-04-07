import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  normalizeLineItems,
  totalsFromLineItems,
  type InvoiceLineItemStored,
} from "@/lib/invoices/line-items";

export const runtime = "nodejs";

function makeInvoiceNumber(): string {
  return `INV-${randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}

/**
 * GET /api/invoices?clientId=
 * List invoices for a client (authenticated).
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId")?.trim();
    if (!clientId) {
      return NextResponse.json({ error: "clientId required" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("invoices")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("invoices GET:", error);
      return NextResponse.json({ error: "Failed to load invoices." }, { status: 500 });
    }

    return NextResponse.json({ invoices: data ?? [] });
  } catch (e) {
    console.error("invoices GET:", e);
    return NextResponse.json({ error: "Failed to load invoices." }, { status: 500 });
  }
}

/**
 * POST /api/invoices
 * Body: { clientId, lineItems: [{ description, quantity, unitPriceCents }], taxCents?, notes? }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: {
      clientId?: string;
      lineItems?: unknown;
      taxCents?: number;
      notes?: string | null;
    };
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const clientId = typeof body.clientId === "string" ? body.clientId.trim() : "";
    if (!clientId) {
      return NextResponse.json({ error: "clientId required" }, { status: 400 });
    }

    const items = normalizeLineItems(body.lineItems);
    if (!items) {
      return NextResponse.json(
        { error: "lineItems must be a non-empty array of { description, quantity, unitPriceCents }." },
        { status: 400 }
      );
    }

    const taxCents =
      typeof body.taxCents === "number" && Number.isFinite(body.taxCents)
        ? Math.max(0, Math.round(body.taxCents))
        : 0;

    const notes =
      typeof body.notes === "string" && body.notes.trim()
        ? body.notes.trim().slice(0, 4000)
        : null;

    const { subtotal_cents, total_cents } = totalsFromLineItems(items as InvoiceLineItemStored[], taxCents);

    const admin = createAdminClient();
    const { data: client, error: clientErr } = await admin
      .from("clients")
      .select("id, company_id")
      .eq("id", clientId)
      .maybeSingle();

    if (clientErr || !client) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }

    const lineItemsJson = items.map((r) => ({
      description: r.description,
      quantity: r.quantity,
      unit_price_cents: r.unit_price_cents,
    }));

    let invoiceNumber = makeInvoiceNumber();
    let inserted: { id: string } | null = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await admin
        .from("invoices")
        .insert({
          invoice_number: invoiceNumber,
          client_id: clientId,
          company_id: client.company_id ?? null,
          status: "draft",
          currency: "USD",
          line_items: lineItemsJson,
          subtotal_cents,
          tax_cents: taxCents,
          total_cents,
          notes,
        })
        .select("id, invoice_number, status, total_cents, created_at")
        .single();

      if (!error && data) {
        inserted = data;
        break;
      }
      if (error?.code === "23505") {
        invoiceNumber = makeInvoiceNumber();
        continue;
      }
      console.error("invoices insert:", error);
      return NextResponse.json({ error: "Failed to create invoice." }, { status: 500 });
    }

    if (!inserted) {
      return NextResponse.json({ error: "Failed to create invoice." }, { status: 500 });
    }

    return NextResponse.json({ invoice: inserted });
  } catch (e) {
    console.error("invoices POST:", e);
    return NextResponse.json({ error: "Failed to create invoice." }, { status: 500 });
  }
}
