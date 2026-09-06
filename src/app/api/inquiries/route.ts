import { validateInquiry } from "@/lib/validate-inquiry";

export const runtime = "nodejs";

/*
 * Leads captured from the chat widget's "share your details" form.
 *
 * Forwards to the GoHighLevel inbound webhook set as GHL_INQUIRY_WEBHOOK_URL,
 * which creates the contact in the CRM. That is the only path — there is
 * deliberately no secondary route, because a lead that lands somewhere other
 * than the CRM is a lead nobody works.
 *
 * THE IMPORTANT PART: if that variable isn't set, this returns an honest error
 * rather than a 200. A route that accepted the submission, showed the visitor a
 * success message, and dropped the lead on the floor would be the single worst
 * failure mode on the site — the business would never know it was losing the
 * enquiries it built the whole system to capture. Better a visible failure the
 * visitor can act on than a silent one nobody sees.
 */

export async function POST(req: Request) {
  const webhook = process.env.GHL_INQUIRY_WEBHOOK_URL;
  if (!webhook) {
    return Response.json(
      {
        error:
          "Enquiry forwarding isn't configured yet. Nothing was sent.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const inquiry = validateInquiry(body);
  if (!inquiry) {
    return Response.json(
      { error: "A name, a valid email address and a message are required." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...inquiry,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      // Log enough to find it later, without echoing the visitor's details.
      console.error(
        `GHL inquiry webhook responded ${res.status} for source ${inquiry.sourcePage}`,
      );
      return Response.json(
        {
          error: "We couldn't get that through. Please try again shortly.",
        },
        { status: 502 },
      );
    }
  } catch (e) {
    console.error("GHL inquiry webhook threw", e);
    return Response.json(
      {
        error: "We couldn't get that through. Please try again shortly.",
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
