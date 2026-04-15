import { NextResponse } from "next/server";
import { releaseDueScheduledBlogPosts } from "@/lib/dashboard/release-scheduled-blog-posts";

export const runtime = "nodejs";

/**
 * Optional scheduled trigger for blog auto-publish (same logic as /blog + dashboard load).
 * Call with Authorization: Bearer <CRON_SECRET> (set CRON_SECRET in Vercel).
 * Hobby plan: do not add frequent crons to vercel.json (deploy can fail); use an external
 * scheduler hitting this URL, or Vercel Pro with a ≤1/day cron per their limits.
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
