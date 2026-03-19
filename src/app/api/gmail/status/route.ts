import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: conn, error } = await admin
      .from("gmail_connections")
      .select("gmail_address")
      .eq("user_id", user.id)
      .single();

    if (error || !conn) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
      connected: true,
      gmailAddress: conn.gmail_address || undefined,
    });
  } catch (err) {
    console.error("Gmail status error:", err);
    return NextResponse.json({ connected: false });
  }
}
