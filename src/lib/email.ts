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
