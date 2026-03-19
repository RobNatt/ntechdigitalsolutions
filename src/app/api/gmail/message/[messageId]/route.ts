import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGmailClientForUser } from "@/lib/gmail";

function decodeBase64(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const base64 = pad ? padded + "=".repeat(4 - pad) : padded;
  return Buffer.from(base64, "base64").toString("utf-8");
}

function getBody(payload: { body?: { data?: string }; parts?: Array<{ body?: { data?: string }; mimeType?: string }> }): string {
  if (payload.body?.data) {
    return decodeBase64(payload.body.data);
  }
  const part = payload.parts?.find((p) => p.mimeType === "text/plain") || payload.parts?.[0];
  return part?.body?.data ? decodeBase64(part.body.data) : "";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ messageId: string }> }
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

    const { messageId } = await params;
    if (!messageId) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    const gmail = await getGmailClientForUser(user.id);
    if (!gmail) {
      return NextResponse.json({ error: "Gmail not connected" }, { status: 400 });
    }

    const full = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

    const headers = full.data.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value;

    const parseAddr = (h: string | undefined) => {
      if (!h) return "";
      const m = h.match(/<([^>]+)>/);
      return m ? m[1] : h.trim();
    };

    const payload = full.data.payload as { body?: { data?: string }; parts?: Array<{ body?: { data?: string }; mimeType?: string }> } | undefined;
    const body = payload ? getBody(payload) : "";

    return NextResponse.json({
      id: full.data.id,
      from: parseAddr(getHeader("From")),
      to: parseAddr(getHeader("To")),
      subject: getHeader("Subject") || "(No subject)",
      body,
      date: getHeader("Date") ? new Date(getHeader("Date")!).toLocaleString() : "Unknown",
    });
  } catch (err) {
    console.error("Gmail message fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 });
  }
}
