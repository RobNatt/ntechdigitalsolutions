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

type Row = {
  status: string;
  published_at: string | null;
  scheduled_publish_at: string | null;
};

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
    scheduledPublishAt?: string | null;
  };

  const admin = createAdminClient();
  const { data: existing, error: loadErr } = await admin
    .from("dashboard_blog_posts")
    .select("status, published_at, scheduled_publish_at")
    .eq("id", id)
    .maybeSingle();

  if (loadErr || !existing) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const ex = existing as Row;
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };

  if (typeof body.title === "string") patch.title = body.title.trim();
  if (typeof body.excerpt === "string") patch.excerpt = body.excerpt.trim() || null;
  if (typeof body.content === "string") patch.content = body.content.trim();

  const nextStatus = body.status ?? ex.status;
  const scheduledKeyPresent = "scheduledPublishAt" in body;

  if (scheduledKeyPresent) {
    if (body.scheduledPublishAt === null) {
      patch.scheduled_publish_at = null;
    } else if (typeof body.scheduledPublishAt === "string") {
      const parsed = new Date(body.scheduledPublishAt.trim());
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "Invalid scheduled publish date." }, { status: 400 });
      }
      const iso = parsed.toISOString();
      if (nextStatus === "draft") {
        patch.scheduled_publish_at = iso;
      } else {
        patch.published_at = iso;
        patch.scheduled_publish_at = null;
      }
    }
  }

  if (body.status === "draft" || body.status === "published") {
    patch.status = body.status;
    if (body.status === "draft") {
      patch.published_at = null;
    } else if (!("published_at" in patch)) {
      const clearedPlanned = body.scheduledPublishAt === null;
      const plannedSource =
        clearedPlanned && ex.status === "draft" ? null : ex.scheduled_publish_at;
      const plannedMs = plannedSource ? new Date(plannedSource).getTime() : NaN;
      const plannedOk = !Number.isNaN(plannedMs) && plannedMs > Date.now();
      if (plannedOk) {
        patch.published_at = ex.scheduled_publish_at;
        patch.scheduled_publish_at = null;
      } else {
        patch.published_at = new Date().toISOString();
        patch.scheduled_publish_at = null;
      }
    }
  }

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
