import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
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
    await admin.from("gmail_connections").delete().eq("user_id", user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Gmail disconnect error:", err);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
