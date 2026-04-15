import { NextResponse } from "next/server";
import { releaseDueScheduledBlogPosts } from "@/lib/dashboard/release-scheduled-blog-posts";

export const runtime = "nodejs";

/**
 * Vercel Cron: set CRON_SECRET in project env; Vercel sends Authorization: Bearer <CRON_SECRET>.
 * Schedule in vercel.json (e.g. every 15 minutes).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { released } = await releaseDueScheduledBlogPosts();
    return NextResponse.json({ ok: true, released });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("cron publish-scheduled-blog-posts:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
