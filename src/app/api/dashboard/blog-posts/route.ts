import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dashboard_blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("dashboard blog posts fetch:", error);
    return NextResponse.json({ error: "Failed to load posts." }, { status: 500 });
  }
  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
    excerpt?: string;
    content?: string;
    publish?: boolean;
  };

  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  const excerpt = String(body.excerpt ?? "").trim();
  if (title.length < 3 || content.length < 20) {
    return NextResponse.json(
      { error: "Title and content are required (content min 20 chars)." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const baseSlug = slugify(title) || "post";
  let slug = baseSlug;
  let i = 1;
  while (true) {
    const { data: existing } = await admin
      .from("dashboard_blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    i += 1;
    slug = `${baseSlug}-${i}`;
  }

  const publish = body.publish === true;
  const { data, error } = await admin
    .from("dashboard_blog_posts")
    .insert({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      status: publish ? "published" : "draft",
      published_at: publish ? new Date().toISOString() : null,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    console.error("dashboard blog posts create:", error);
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
  return NextResponse.json({ post: data });
}
