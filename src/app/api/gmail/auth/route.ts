import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUrl } from "@/lib/gmail";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
    }

    const state = Buffer.from(JSON.stringify({ userId: user.id })).toString("base64url");
    const url = getAuthUrl(state);
    return NextResponse.redirect(url);
  } catch (err) {
    console.error("Gmail auth error:", err);
    return NextResponse.redirect(
      new URL("/dashboard?gmail_error=auth_failed", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    );
  }
}
