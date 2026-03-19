import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGmailClientForUser } from "@/lib/gmail";

const FOLDER_TO_LABEL: Record<string, string> = {
  inbox: "INBOX",
  sent: "SENT",
  drafts: "DRAFT",
  spam: "SPAM",
};

function parseEmailAddress(header: string | null | undefined): string {
  if (!header) return "";
  const match = header.match(/<([^>]+)>/);
  return match ? match[1] : header.trim();
}

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
    const folder = searchParams.get("folder") || "inbox";
    const maxResults = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    const gmail = await getGmailClientForUser(user.id);
    if (!gmail) {
      return NextResponse.json({ error: "Gmail not connected" }, { status: 400 });
    }

    const labelId = FOLDER_TO_LABEL[folder] || "INBOX";
    const listRes = await gmail.users.messages.list({
      userId: "me",
      labelIds: [labelId],
      maxResults,
    });

    const messages = listRes.data.messages || [];
    const emails = await Promise.all(
      messages.slice(0, 50).map(async (msg) => {
        const full = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "To", "Subject", "Date"],
        });

        const headers = full.data.payload?.headers || [];
        const getHeader = (name: string) =>
          headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value;

        const from = parseEmailAddress(getHeader("From"));
        const to = parseEmailAddress(getHeader("To"));
        const subject = getHeader("Subject") || "(No subject)";
        const dateHeader = getHeader("Date");
        const date = dateHeader ? new Date(dateHeader).toLocaleString() : "Unknown";

        return {
          id: full.data.id,
          from,
          to,
          subject,
          body: "", // Not fetched for list view - fetch on demand if needed
          date,
          folder,
          read: !full.data.labelIds?.includes("UNREAD"),
        };
      })
    );

    return NextResponse.json({ emails });
  } catch (err) {
    console.error("Gmail fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
