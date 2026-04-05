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
