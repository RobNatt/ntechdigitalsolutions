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
    excerpt?: string;
    content?: string;
    status?: "draft" | "published";
  };

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };
  if (typeof body.title === "string") patch.title = body.title.trim();
  if (typeof body.excerpt === "string") patch.excerpt = body.excerpt.trim() || null;
  if (typeof body.content === "string") patch.content = body.content.trim();
  if (body.status === "draft" || body.status === "published") {
    patch.status = body.status;
    patch.published_at = body.status === "published" ? new Date().toISOString() : null;
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dashboard_blog_posts")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("dashboard blog posts patch:", error);
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
  return NextResponse.json({ post: data });
}
