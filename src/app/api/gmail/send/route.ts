import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGmailClientForUser } from "@/lib/gmail";

function encodeBase64(str: string): string {
  return Buffer.from(str, "utf-8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

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

    const body = await request.json();
    const { to, subject, body: emailBody } = body as { to?: string; subject?: string; body?: string };

    if (!to?.trim()) {
      return NextResponse.json({ error: "Recipient required" }, { status: 400 });
    }

    const gmail = await getGmailClientForUser(user.id);
    if (!gmail) {
      return NextResponse.json({ error: "Gmail not connected" }, { status: 400 });
    }

    const raw = [
      `To: ${to.trim()}`,
      `Subject: ${subject || "(No subject)"}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      emailBody || "",
    ].join("\r\n");

    const encoded = encodeBase64(raw);

    const sent = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encoded,
      },
    });

    return NextResponse.json({ success: true, id: sent.data.id });
  } catch (err) {
    console.error("Gmail send error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
