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

    // Check if user has CEO/admin role (from profile)
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as string | undefined;
    if (!["ceo", "admin", "developer"].includes(role || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: profiles, error } = await admin
      .from("profiles")
      .select("id, email, full_name, role, login_id, phone_number, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: profiles || [] });
  } catch (err) {
    console.error("Users list error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
