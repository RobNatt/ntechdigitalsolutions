import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

const CODE_EXPIRY_MINUTES = 10;
const TWO_FA_COOKIE = "ntech_2fa_verified";
const TWO_FA_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function skip2faEnabled(): boolean {
  const v = process.env.AUTH_BOOTSTRAP_SKIP_2FA?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
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

    const bootstrapLoginId = process.env.AUTH_BOOTSTRAP_LOGIN_ID?.trim();
    const bootstrapEmail = process.env.AUTH_BOOTSTRAP_EMAIL?.trim();

    if (bootstrapLoginId && bootstrapEmail && loginId.trim() === bootstrapLoginId) {
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
        return NextResponse.json({ error: "Invalid ID or password" }, { status: 401 });
      }

      const user = signInData.user;

      if (skip2faEnabled()) {
        set2faVerifiedCookie(resDone);
        return resDone;
      }

      const { data: bootProfile, error: bootProfileError } = await admin
        .from("profiles")
        .select("id, phone_number")
        .eq("id", user.id)
        .single();

      if (bootProfileError || !bootProfile) {
        return NextResponse.json(
          { error: "No profile on file. Contact admin." },
          { status: 400 }
        );
      }

      if (!bootProfile.phone_number) {
        return NextResponse.json(
          { error: "No phone number on file. Contact admin." },
          { status: 400 }
        );
      }

      const code = generateCode();
      const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000).toISOString();
      await admin.from("auth_verification_codes").insert({
        user_id: bootProfile.id,
        code,
        expires_at: expiresAt,
      });
      const sent = await sendSms(bootProfile.phone_number, code);
      if (!sent) {
        return NextResponse.json(
          { error: "Could not send verification code. Try again later." },
          { status: 500 }
        );
      }
      return res2fa;
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, phone_number")
      .eq("login_id", loginId.trim())
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Invalid ID or password" }, { status: 401 });
    }

    const { data: authUser, error: userError } = await admin.auth.admin.getUserById(profile.id);
    if (userError || !authUser?.user?.email) {
      return NextResponse.json({ error: "Invalid ID or password" }, { status: 401 });
    }

    const res2fa = NextResponse.json({ success: true, step: "2fa" as const });
    let supabase2;
    try {
      supabase2 = await createSupabaseForSignInResponse(res2fa);
    } catch {
      return NextResponse.json(
        { error: "Server configuration error. Check Supabase env vars." },
        { status: 500 }
      );
    }

    const { error: signInError } = await supabase2.auth.signInWithPassword({
      email: authUser.user.email,
      password,
    });

    if (signInError) {
      return NextResponse.json({ error: "Invalid ID or password" }, { status: 401 });
    }

    if (!profile.phone_number) {
      return NextResponse.json(
        { error: "No phone number on file. Contact admin." },
        { status: 400 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000).toISOString();
    await admin.from("auth_verification_codes").insert({
      user_id: profile.id,
      code,
      expires_at: expiresAt,
    });
    const sent = await sendSms(profile.phone_number, code);
    if (!sent) {
      return NextResponse.json(
        { error: "Could not send verification code. Try again later." },
        { status: 500 }
      );
    }
    return res2fa;
  } catch (err) {
    console.error("Sign-in error:", err);
    return NextResponse.json({ error: "Sign-in failed" }, { status: 500 });
  }
}
