import { NextResponse } from "next/server";

/** Safe read-only diagnostics for production (no secrets). Open GET /api/auth/ping in a browser. */
function envValue(raw: string | undefined): string | undefined {
  if (raw == null) return undefined;
  let t = raw.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1).trim();
  }
  return t || undefined;
}

function skip2faEnabled(): boolean {
  const v = process.env.AUTH_BOOTSTRAP_SKIP_2FA?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

function envTruthy(raw: string | undefined): boolean {
  const v = raw?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let host: string | null = null;
  try {
    host = new URL(url).hostname;
  } catch {
    host = null;
  }

  const anonOk = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceRoleOk = !!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bootstrapEmail = envValue(process.env.AUTH_BOOTSTRAP_EMAIL);

  return NextResponse.json({
    ok: true,
    supabaseUrlConfigured: !!url,
    supabaseAnonKeyConfigured: anonOk,
    supabaseHost: host,
    serviceRoleConfigured: serviceRoleOk,
    bootstrapEmailConfigured: !!bootstrapEmail,
    bootstrapLoginIdConfigured: !!envValue(process.env.AUTH_BOOTSTRAP_LOGIN_ID),
    skip2faEnabled: skip2faEnabled(),
    allowEmailSignin: envTruthy(process.env.AUTH_ALLOW_EMAIL_SIGNIN),
    note:
      "If bootstrapEmailConfigured is false, sign-in only works via profiles.login_id or AUTH_ALLOW_EMAIL_SIGNIN. Set AUTH_BOOTSTRAP_EMAIL on Vercel to your Supabase Auth user email.",
  });
}
