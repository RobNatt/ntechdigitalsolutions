import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

const CODE_EXPIRY_MINUTES = 10;

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendSms(phone: string, code: string): Promise<boolean> {
  // Add Twilio integration: https://www.twilio.com/docs/sms
  // For now, log in dev (never log in production)
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

    const admin = createAdminClient();
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

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error: signInError } = await supabase.auth.signInWithPassword({
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

    return NextResponse.json({ success: true, step: "2fa" });
  } catch (err) {
    console.error("Sign-in error:", err);
    return NextResponse.json({ error: "Sign-in failed" }, { status: 500 });
  }
}
