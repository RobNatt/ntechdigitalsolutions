import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInvoiceToClient } from "@/lib/email";
import type { InvoiceLineItemStored } from "@/lib/invoices/line-items";

export const runtime = "nodejs";

type InvoiceRow = {
  id: string;
  invoice_number: string;
  client_id: string;
  status: string;
  currency: string;
  line_items: InvoiceLineItemStored[] | unknown;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  notes: string | null;
};

type ClientRow = {
  id: string;
  name: string | null;
  email: string | null;
};

/**
 * POST /api/invoices/:id/send
 * Emails the invoice to the client (Resend) and sets status to sent.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: inv, error: invErr } = await admin
      .from("invoices")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (invErr || !inv) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    const invoice = inv as InvoiceRow;
    if (invoice.status === "void") {
      return NextResponse.json({ error: "Cannot send a void invoice." }, { status: 400 });
    }
    if (invoice.status === "paid") {
      return NextResponse.json({ error: "Invoice already marked paid." }, { status: 400 });
    }

    const { data: client, error: clientErr } = await admin
      .from("clients")
      .select("id, name, email")
      .eq("id", invoice.client_id)
      .maybeSingle();

    if (clientErr || !client) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }

    const c = client as ClientRow;
    const toEmail = c.email?.trim();
    if (!toEmail) {
      return NextResponse.json(
        { error: "Client has no email in CRM. Add an email on the client record first." },
        { status: 400 }
      );
    }

    const lineItems = Array.isArray(invoice.line_items)
      ? (invoice.line_items as InvoiceLineItemStored[])
      : [];

    await sendInvoiceToClient({
      toEmail,
      clientName: c.name,
      invoiceNumber: invoice.invoice_number,
      currency: invoice.currency || "USD",
      lineItems,
      subtotalCents: invoice.subtotal_cents,
      taxCents: invoice.tax_cents,
      totalCents: invoice.total_cents,
      notes: invoice.notes,
    });

    const now = new Date().toISOString();
    const { data: updated, error: updErr } = await admin
      .from("invoices")
      .update({
        status: "sent",
        sent_at: now,
        updated_at: now,
      })
      .eq("id", id)
      .select("id, status, sent_at")
      .single();

    if (updErr || !updated) {
      console.error("invoice send update:", updErr);
      return NextResponse.json(
        { error: "Email may have sent but failed to update invoice status." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, invoice: updated });
  } catch (e) {
    console.error("invoice send:", e);
    const msg = e instanceof Error ? e.message : "Failed to send invoice.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
