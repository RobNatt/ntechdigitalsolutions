import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

const TWO_FA_COOKIE = "ntech_2fa_verified";
const TWO_FA_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: Request) {
  try {
    const { code } = (await request.json()) as { code: string };
    if (!code?.trim()) {
      return NextResponse.json({ error: "Code required" }, { status: 400 });
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Session expired. Sign in again." }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: rows, error: fetchError } = await admin
      .from("auth_verification_codes")
      .select("id")
      .eq("user_id", user.id)
      .eq("code", code.trim())
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    const row = rows?.[0];

    if (fetchError || !row) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    await admin.from("auth_verification_codes").delete().eq("id", row.id);

    const response = NextResponse.json({ success: true });
    response.cookies.set(TWO_FA_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: TWO_FA_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("2FA verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
