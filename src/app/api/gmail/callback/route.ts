import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOAuth2Client } from "@/lib/gmail";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const dashboardUrl = `${baseUrl}/dashboard`;

  if (error) {
    console.error("Gmail OAuth error:", error);
    return NextResponse.redirect(`${dashboardUrl}?gmail_error=${error}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${dashboardUrl}?gmail_error=missing_params`);
  }

  try {
    let userId: string;
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
      userId = decoded.userId;
    } catch {
      return NextResponse.redirect(`${dashboardUrl}?gmail_error=invalid_state`);
    }

    const oauth2 = getOAuth2Client();
    const { tokens } = await oauth2.getToken(code);
    if (!tokens.access_token) {
      return NextResponse.redirect(`${dashboardUrl}?gmail_error=no_tokens`);
    }

    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: "me" });
    const gmailAddress = profile.data.emailAddress || null;

    const expiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date).toISOString()
      : new Date(Date.now() + 3600 * 1000).toISOString();

    const admin = createAdminClient();
    await admin.from("gmail_connections").upsert(
      {
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        expires_at: expiresAt,
        gmail_address: gmailAddress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    return NextResponse.redirect(`${dashboardUrl}?gmail_connected=1`);
  } catch (err) {
    console.error("Gmail callback error:", err);
    return NextResponse.redirect(`${dashboardUrl}?gmail_error=callback_failed`);
  }
}
