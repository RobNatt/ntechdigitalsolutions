import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
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
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as string | undefined;
    if (!["ceo", "admin", "developer"].includes(role || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      email,
      password,
      full_name,
      login_id,
      phone_number,
      role: newRole,
    } = body as {
      email?: string;
      password?: string;
      full_name?: string;
      login_id?: string;
      phone_number?: string;
      role?: string;
    };

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const { data: newUser, error } = await admin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name?.trim() || "",
        role: ["ceo", "admin", "developer", "member"].includes(newRole || "")
          ? newRole
          : "member",
        login_id: login_id?.trim() || "",
        phone_number: phone_number?.trim() || "",
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user?.id,
        email: newUser.user?.email,
      },
    });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
