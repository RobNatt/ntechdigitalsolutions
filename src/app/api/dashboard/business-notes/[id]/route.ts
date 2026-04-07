import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
    note?: string;
    pinned?: boolean;
    archived?: boolean;
  };

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };
  if (typeof body.title === "string") patch.title = body.title.trim();
  if (typeof body.note === "string") patch.note = body.note.trim();
  if (typeof body.pinned === "boolean") patch.pinned = body.pinned;
  if (typeof body.archived === "boolean") patch.archived = body.archived;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dashboard_business_notes")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("dashboard business notes patch:", error);
    return NextResponse.json({ error: "Failed to update note." }, { status: 500 });
  }
  return NextResponse.json({ note: data });
}
