/**
 * Gmail API helpers - OAuth tokens and client creation
 */

import { google } from "googleapis";
import { createAdminClient } from "./supabase/admin";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.modify", // for labels/folders
];

export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
  }
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/gmail/callback"
  );
}

export function getAuthUrl(state: string): string {
  const oauth2 = getOAuth2Client();
  return oauth2.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force refresh token on first auth
    state,
  });
}

export async function getGmailClientForUser(userId: string) {
  const admin = createAdminClient();
  const { data: conn, error } = await admin
    .from("gmail_connections")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .single();

  if (error || !conn) {
    return null;
  }

  const oauth2 = getOAuth2Client();
  oauth2.setCredentials({
    access_token: conn.access_token,
    refresh_token: conn.refresh_token,
    expiry_date: new Date(conn.expires_at).getTime(),
  });

  // Refresh if expired
  const { credentials } = await oauth2.refreshAccessToken();
  if (credentials.access_token && credentials.expiry_date) {
    await admin
      .from("gmail_connections")
      .update({
        access_token: credentials.access_token,
        expires_at: new Date(credentials.expiry_date).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
  }

  const gmail = google.gmail({ version: "v1", auth: oauth2 });
  return gmail;
}

export async function isGmailConnected(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("gmail_connections")
    .select("id")
    .eq("user_id", userId)
    .single();
  return !error && !!data;
}
