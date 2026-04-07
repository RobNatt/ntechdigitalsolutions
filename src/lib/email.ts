import type { InvoiceLineItemStored } from "@/lib/invoices/line-items";

interface LeadNotificationPayload {
  id?: string;
  name: string;
  phone: string;
  address: string;
  leadType: string;
  source: string;
  details: Record<string, unknown>;
}

export async function sendLeadNotification(payload: LeadNotificationPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.LEAD_NOTIFICATION_FROM ?? "nTech Leads <onboarding@resend.dev>";

  if (!apiKey || !toEmail) {
    console.warn("Lead notification skipped: missing RESEND_API_KEY and/or LEAD_NOTIFICATION_EMAIL", {
      hasResendApiKey: !!apiKey,
      hasLeadNotificationEmail: !!toEmail,
    });
    return;
  }

  const detailsStr = Object.entries(payload.details)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? (v as string[]).join(", ") : v}`)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: toEmail,
      subject: `New lead: ${payload.name} (${payload.leadType})`,
      text: [
        `New lead from ${payload.source}`,
        "",
        `Name: ${payload.name}`,
        `Phone: ${payload.phone}`,
        `Address: ${payload.address}`,
        `Type: ${payload.leadType}`,
        "",
        "Details:",
        detailsStr || "(none)",
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error: ${err}`);
  }

  console.log("Lead notification email sent", {
    to: toEmail,
    from,
    leadName: payload.name,
    leadType: payload.leadType,
    source: payload.source,
  });
}

export type InquiryNotificationPayload = {
  id?: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  message: string;
  planInterest?: string | null;
  sourcePage?: string | null;
};

export async function sendInquiryNotification(payload: InquiryNotificationPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.LEAD_NOTIFICATION_FROM ?? "nTech Leads <onboarding@resend.dev>";

  if (!apiKey || !toEmail) {
    console.warn("Inquiry notification skipped: missing RESEND_API_KEY and/or LEAD_NOTIFICATION_EMAIL", {
      hasResendApiKey: !!apiKey,
      hasLeadNotificationEmail: !!toEmail,
    });
    return;
  }

  const lines = [
    "New inquiry from the website contact form",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.planInterest ? `Plan / package interest: ${payload.planInterest}` : null,
    payload.sourcePage ? `Submitted from: ${payload.sourcePage}` : null,
    payload.id ? `Lead ID (CRM): ${payload.id}` : null,
    "",
    "Message:",
    payload.message,
  ].filter((l): l is string => l != null);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: toEmail,
      subject: `Website inquiry: ${payload.name}`,
      text: lines.join("\n"),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error: ${err}`);
  }

  console.log("Inquiry notification email sent", { to: toEmail, name: payload.name });
}

export async function sendInquiryAutoReply(payload: {
  name: string;
  email: string;
  sourcePage?: string | null;
  planInterest?: string | null;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_NOTIFICATION_FROM ?? "nTech Leads <onboarding@resend.dev>";
  if (!apiKey) return;

  const firstName = payload.name.split(" ")[0] || payload.name;
  const lines = [
    `Hi ${firstName},`,
    "",
    "Thanks for reaching out to N-Tech Digital Solutions.",
    "We received your inquiry and will follow up shortly with next steps.",
    payload.planInterest ? `Package interest noted: ${payload.planInterest}` : null,
    payload.sourcePage ? `Submitted from: ${payload.sourcePage}` : null,
    "",
    "If this is urgent, reply directly to this email with your priority and timeline.",
    "",
    "— N-Tech Digital Solutions",
  ].filter((l): l is string => l != null);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.email,
      subject: "We got your inquiry — N-Tech Digital Solutions",
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Inquiry auto-reply failed:", err);
  }
}

export async function sendInquirySmsFollowUp(payload: {
  name: string;
  phone: string;
}): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) return;

  const rawDigits = payload.phone.replace(/\D/g, "");
  if (rawDigits.length < 10) return;
  const to = rawDigits.length === 10 ? `+1${rawDigits}` : `+${rawDigits}`;
  const firstName = payload.name.split(" ")[0] || payload.name;
  const body = `Hi ${firstName}, thanks for reaching out to N-Tech. We got your inquiry and will follow up shortly with next steps.`;

  const form = new URLSearchParams({
    To: to,
    From: from,
    Body: body,
  });
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Inquiry SMS follow-up failed:", err);
  }
}

export async function sendGroqVerificationReminderEmail(payload: {
  leadId: string;
  bookingDate: string;
  bookingTime: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.SUPPORT_NOTIFICATION_EMAIL?.trim() ||
    process.env.LEAD_NOTIFICATION_EMAIL?.trim();
  const from = process.env.LEAD_NOTIFICATION_FROM ?? "nTech Leads <onboarding@resend.dev>";
  if (!apiKey || !toEmail) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: toEmail,
      subject: "Groq reminder: verify new booked call in dashboard",
      text: [
        "Groq assistant reminder:",
        "",
        `Please verify this booking in the CEO dashboard assistant flow.`,
        `Lead ID: ${payload.leadId}`,
        `Scheduled: ${payload.bookingDate} ${payload.bookingTime}`,
        "",
        "Open Dashboard > Assistant to confirm the invite workflow.",
      ].join("\n"),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Groq verification reminder email failed:", err);
  }
}

export type SupportInboxNotificationPayload = {
  id: string;
  fromEmail: string;
  fromName?: string | null;
  subject: string;
  preview: string;
};

/** Notify internal inbox when a support message is stored (webhook). Uses SUPPORT_NOTIFICATION_EMAIL or LEAD_NOTIFICATION_EMAIL. */
export async function sendSupportInboxNotification(
  payload: SupportInboxNotificationPayload
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.SUPPORT_NOTIFICATION_EMAIL?.trim() ||
    process.env.LEAD_NOTIFICATION_EMAIL?.trim();
  const from = process.env.LEAD_NOTIFICATION_FROM ?? "nTech Leads <onboarding@resend.dev>";

  if (!apiKey || !toEmail) {
    console.warn("Support inbox notification skipped: missing RESEND or notification email", {
      hasResendApiKey: !!apiKey,
      hasTo: !!toEmail,
    });
    return;
  }

  const lines = [
    "New message for support inbox (hello@ntechdigital.solutions pipeline)",
    "",
    `From: ${payload.fromName ? `${payload.fromName} <${payload.fromEmail}>` : payload.fromEmail}`,
    `Subject: ${payload.subject}`,
    payload.id ? `Record ID: ${payload.id}` : null,
    "",
    "Preview:",
    payload.preview || "(empty body)",
  ].filter((l): l is string => l != null);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: toEmail,
      subject: `Support: ${payload.subject}`.slice(0, 998),
      text: lines.join("\n"),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error: ${err}`);
  }

  console.log("Support inbox notification sent", { to: toEmail, id: payload.id });
}

export type SendInvoiceToClientParams = {
  toEmail: string;
  clientName: string | null;
  invoiceNumber: string;
  currency: string;
  lineItems: InvoiceLineItemStored[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  notes: string | null;
};

function formatMoney(cents: number, currency: string): string {
  const code = currency?.trim() || "USD";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

/** Email invoice PDF-style summary to the client (Resend). */
export async function sendInvoiceToClient(params: SendInvoiceToClientParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.INVOICE_NOTIFICATION_FROM?.trim() ||
    process.env.LEAD_NOTIFICATION_FROM?.trim() ||
    "nTech Digital <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY — cannot send invoice email.");
  }

  const greeting = params.clientName?.trim() ? `Hi ${params.clientName.trim()},` : "Hi,";

  const rows = params.lineItems.map((row) => {
    const line = row.quantity * row.unit_price_cents;
    return `${row.description} — ${row.quantity} × ${formatMoney(row.unit_price_cents, params.currency)} = ${formatMoney(line, params.currency)}`;
  });

  const text = [
    greeting,
    "",
    `Invoice ${params.invoiceNumber}`,
    "",
    ...rows,
    "",
    `Subtotal: ${formatMoney(params.subtotalCents, params.currency)}`,
    params.taxCents > 0 ? `Tax: ${formatMoney(params.taxCents, params.currency)}` : null,
    `Total due: ${formatMoney(params.totalCents, params.currency)}`,
    params.notes?.trim() ? ["", "Notes:", params.notes.trim()] : null,
    "",
    "Thank you for your business.",
    "— nTech Digital Solutions",
  ]
    .flat()
    .filter((l): l is string => l != null);

  const tableRows = params.lineItems
    .map(
      (row) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(row.description)}</td>` +
          `<td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${row.quantity}</td>` +
          `<td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatMoney(row.unit_price_cents, params.currency)}</td>` +
          `<td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatMoney(row.quantity * row.unit_price_cents, params.currency)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111">
<p>${escapeHtml(greeting)}</p>
<p><strong>Invoice ${escapeHtml(params.invoiceNumber)}</strong></p>
<table style="width:100%;max-width:560px;border-collapse:collapse;font-size:14px">
<thead><tr>
<th align="left" style="padding:8px;border-bottom:2px solid #ccc">Description</th>
<th align="right" style="padding:8px;border-bottom:2px solid #ccc">Qty</th>
<th align="right" style="padding:8px;border-bottom:2px solid #ccc">Unit</th>
<th align="right" style="padding:8px;border-bottom:2px solid #ccc">Line</th>
</tr></thead>
<tbody>${tableRows}</tbody>
</table>
<p style="margin-top:16px">Subtotal: <strong>${formatMoney(params.subtotalCents, params.currency)}</strong><br/>
${params.taxCents > 0 ? `Tax: ${formatMoney(params.taxCents, params.currency)}<br/>` : ""}
Total due: <strong>${formatMoney(params.totalCents, params.currency)}</strong></p>
${params.notes?.trim() ? `<p style="margin-top:16px"><strong>Notes</strong><br/>${escapeHtml(params.notes.trim()).replace(/\n/g, "<br/>")}</p>` : ""}
<p style="margin-top:24px;color:#444">Thank you for your business.<br/>— nTech Digital Solutions</p>
</body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: params.toEmail,
      subject: `Invoice ${params.invoiceNumber}`,
      text: text.join("\n"),
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error: ${err}`);
  }

  console.log("Invoice email sent", { to: params.toEmail, invoiceNumber: params.invoiceNumber });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
