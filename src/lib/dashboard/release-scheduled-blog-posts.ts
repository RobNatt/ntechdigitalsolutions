import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Promotes drafts whose `scheduled_publish_at` is in the past to `published`
 * with `published_at` set from the scheduled time. Safe to call on every
 * public /blog load and dashboard blog list fetch.
 */
export async function releaseDueScheduledBlogPosts(): Promise<{ released: number }> {
  const admin = createAdminClient();
  const nowIso = new Date().toISOString();
  const { data: rows, error } = await admin
    .from("dashboard_blog_posts")
    .select("id, scheduled_publish_at")
    .eq("status", "draft")
    .not("scheduled_publish_at", "is", null)
    .lte("scheduled_publish_at", nowIso);

  if (error) {
    console.error("releaseDueScheduledBlogPosts select:", error.message);
    return { released: 0 };
  }

  let released = 0;
  for (const row of rows ?? []) {
    const scheduled = row.scheduled_publish_at as string | null;
    if (!scheduled) continue;
    const { error: uerr } = await admin
      .from("dashboard_blog_posts")
      .update({
        status: "published",
        published_at: scheduled,
        scheduled_publish_at: null,
        updated_at: nowIso,
      })
      .eq("id", row.id);
    if (uerr) {
      console.error("releaseDueScheduledBlogPosts update:", row.id, uerr.message);
    } else {
      released += 1;
    }
  }
  return { released };
}
