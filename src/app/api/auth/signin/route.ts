import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const CODE_EXPIRY_MINUTES = 10;
const TWO_FA_COOKIE = "ntech_2fa_verified";
const TWO_FA_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function skip2faEnabled(): boolean {
  const v = process.env.AUTH_BOOTSTRAP_SKIP_2FA?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

function envTruthy(raw: string | undefined): boolean {
  const v = raw?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

/** Trim and strip one pair of surrounding quotes (common .env mistake). */
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

/** User-visible copy for Supabase Auth errors (safe in production; avoids silent generic failures). */
function invalidCredsMessage(err: { message?: string } | null): string {
  const msg = (err?.message || "").trim();
  const lower = msg.toLowerCase();

  if (
    lower.includes("email not confirmed") ||
    lower.includes("email address not confirmed") ||
    lower.includes("confirm your email")
  ) {
    return "Email not confirmed. In Supabase: Authentication → Users → confirm the user, or disable “Confirm email” for that user / project.";
  }

  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid_credentials") ||
    lower.includes("invalid email or password")
  ) {
    return "Invalid email or password. If this is production, confirm Vercel env points to the same Supabase project where the user exists, and AUTH_BOOTSTRAP_EMAIL matches that user’s email (or use AUTH_ALLOW_EMAIL_SIGNIN + your email as Login ID).";
  }

  if (process.env.NODE_ENV === "development" && msg) {
    return msg;
  }

  return "Invalid ID or password";
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function set2faVerifiedCookie(res: NextResponse) {
  res.cookies.set(TWO_FA_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TWO_FA_MAX_AGE,
    path: "/",
  });
}

/**
 * Route handlers must write auth cookies onto the same NextResponse you return;
 * using only cookies().set() often does not attach Set-Cookie to the API response.
 */
async function createSupabaseForSignInResponse(response: NextResponse) {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });
}

async function sendSms(phone: string, code: string): Promise<boolean> {
  if (process.env.NODE_ENV === "development") {
    console.log(`[2FA] Code for ${phone}: ${code}`);
    return true;
  }
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !from) {
    console.error("Twilio not configured. Add TWILIO_* env vars.");
    return false;
  }
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      },
      body: new URLSearchParams({
        To: phone,
        From: from,
        Body: `Your nTech Digital Solutions sign-in code: ${code}`,
      }),
    }
  );
  return res.ok;
}

/** After Supabase password auth succeeds on `responseForSession` (session cookies on resDone/res2fa). */
async function finishSignInWithOptional2fa(
  admin: ReturnType<typeof createAdminClient>,
  user: SupabaseUser,
  resDone: NextResponse,
  res2fa: NextResponse
): Promise<NextResponse> {
  if (skip2faEnabled()) {
    set2faVerifiedCookie(resDone);
    return resDone;
  }

  const { data: row, error: profileError } = await admin
    .from("profiles")
    .select("id, phone_number")
    .eq("id", user.id)
    .single();

  if (profileError || !row) {
    return NextResponse.json(
      {
        error: "No profile on file. Contact admin.",
        ...(process.env.NODE_ENV === "development" && {
          hint: "Turn on AUTH_BOOTSTRAP_SKIP_2FA=true to skip SMS when you have no profile row yet, or add a profiles row for this user.",
        }),
      },
      { status: 400 }
    );
  }

  if (!row.phone_number) {
    return NextResponse.json(
      { error: "No phone number on file. Contact admin." },
      { status: 400 }
    );
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000).toISOString();
  await admin.from("auth_verification_codes").insert({
    user_id: row.id,
    code,
    expires_at: expiresAt,
  });
  const sent = await sendSms(row.phone_number, code);
  if (!sent) {
    return NextResponse.json(
      { error: "Could not send verification code. Try again later." },
      { status: 500 }
    );
  }
  return res2fa;
}

function looksLikeEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export async function POST(request: Request) {
  try {
    const { loginId, password } = (await request.json()) as { loginId: string; password: string };
    if (!loginId?.trim() || !password) {
      return NextResponse.json({ error: "ID and password required" }, { status: 400 });
    }

    let admin: ReturnType<typeof createAdminClient>;
    try {
      admin = createAdminClient();
    } catch {
      console.error("Sign-in: missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL");
      return NextResponse.json(
        { error: "Server configuration error. Check Supabase env vars." },
        { status: 500 }
      );
    }

    const idNorm = loginId.trim();
    const idLower = idNorm.toLowerCase();

    const bootstrapLoginId = envValue(process.env.AUTH_BOOTSTRAP_LOGIN_ID);
    const bootstrapEmail = envValue(process.env.AUTH_BOOTSTRAP_EMAIL);

    const matchesBootstrapLoginId =
      !!bootstrapLoginId && !!bootstrapEmail && idLower === bootstrapLoginId.toLowerCase();
    const matchesBootstrapEmail =
      !!bootstrapEmail && idLower === bootstrapEmail.toLowerCase();

    const useBootstrapAuth = matchesBootstrapLoginId || matchesBootstrapEmail;

    if (!bootstrapEmail && process.env.NODE_ENV === "production") {
      console.warn(
        "[auth/signin] AUTH_BOOTSTRAP_EMAIL is unset — bootstrap sign-in disabled; only profiles.login_id or AUTH_ALLOW_EMAIL_SIGNIN paths apply."
      );
    }

    if (useBootstrapAuth && bootstrapEmail) {
      console.info("[auth/signin] bootstrap sign-in branch");
      const resDone = NextResponse.json({ success: true, step: "done" as const });
      const res2fa = NextResponse.json({ success: true, step: "2fa" as const });
      const responseForSession = skip2faEnabled() ? resDone : res2fa;

      let supabase;
      try {
        supabase = await createSupabaseForSignInResponse(responseForSession);
      } catch {
        return NextResponse.json(
          { error: "Server configuration error. Check Supabase env vars." },
          { status: 500 }
        );
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: bootstrapEmail,
        password,
      });

      if (signInError || !signInData.user) {
        return NextResponse.json(
          {
            error: invalidCredsMessage(
              signInError ?? { message: "Sign-in returned no user" }
            ),
          },
          { status: 401 }
        );
      }

      return finishSignInWithOptional2fa(admin, signInData.user, resDone, res2fa);
    }

    const allowEmailSignin = envTruthy(process.env.AUTH_ALLOW_EMAIL_SIGNIN);
    if (allowEmailSignin && looksLikeEmail(idNorm)) {
      console.info("[auth/signin] AUTH_ALLOW_EMAIL_SIGNIN branch");
      const resDone = NextResponse.json({ success: true, step: "done" as const });
      const res2fa = NextResponse.json({ success: true, step: "2fa" as const });
      const responseForSession = skip2faEnabled() ? resDone : res2fa;

      let supabase;
      try {
        supabase = await createSupabaseForSignInResponse(responseForSession);
      } catch {
        return NextResponse.json(
          { error: "Server configuration error. Check Supabase env vars." },
          { status: 500 }
        );
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: idNorm,
        password,
      });

      if (signInError || !signInData.user) {
        return NextResponse.json(
          { error: invalidCredsMessage(signInError ?? { message: "Sign-in returned no user" }) },
          { status: 401 }
        );
      }

      return finishSignInWithOptional2fa(admin, signInData.user, resDone, res2fa);
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, phone_number")
      .eq("login_id", idNorm)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          error: "Invalid ID or password",
          ...(process.env.NODE_ENV === "development" && {
            hint: "Use your AUTH_BOOTSTRAP_EMAIL as Login ID (same spelling), set AUTH_BOOTSTRAP_LOGIN_ID, enable AUTH_ALLOW_EMAIL_SIGNIN=true to sign in with email, or add profiles.login_id in Supabase.",
          }),
        },
        { status: 401 }
      );
    }

    const { data: authUser, error: userError } = await admin.auth.admin.getUserById(profile.id);
    if (userError || !authUser?.user?.email) {
      return NextResponse.json({ error: "Invalid ID or password" }, { status: 401 });
    }

    const resDone = NextResponse.json({ success: true, step: "done" as const });
    const res2fa = NextResponse.json({ success: true, step: "2fa" as const });
    const responseForSession = skip2faEnabled() ? resDone : res2fa;

    let supabase2;
    try {
      supabase2 = await createSupabaseForSignInResponse(responseForSession);
    } catch {
      return NextResponse.json(
        { error: "Server configuration error. Check Supabase env vars." },
        { status: 500 }
      );
    }

    const { data: signInData2, error: signInError } = await supabase2.auth.signInWithPassword({
      email: authUser.user.email,
      password,
    });

    if (signInError || !signInData2.user) {
      return NextResponse.json({ error: invalidCredsMessage(signInError) }, { status: 401 });
    }

    return finishSignInWithOptional2fa(admin, signInData2.user, resDone, res2fa);
  } catch (err) {
    console.error("Sign-in error:", err);
    return NextResponse.json({ error: "Sign-in failed" }, { status: 500 });
  }
}
