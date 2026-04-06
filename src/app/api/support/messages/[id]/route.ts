import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * PATCH /api/support/messages/:id
 * Body: { read: boolean }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    let body: { read?: boolean };
    try {
      body = (await request.json()) as { read?: boolean };
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const read = body.read === true;
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("support_inbound_messages")
      .update({
        read_at: read ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .select("id, read_at")
      .maybeSingle();

    if (error) {
      console.error("support message patch:", error);
      return NextResponse.json({ error: "Failed to update." }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: data });
  } catch (e) {
    console.error("support message PATCH:", e);
    return NextResponse.json({ error: "Failed to update." }, { status: 500 });
  }
}
