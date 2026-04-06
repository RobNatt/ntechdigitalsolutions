import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * GET /api/analytics/summary?companyId=&days=30
 * Authenticated dashboard — aggregates for one company (N-Tech or a client tenant).
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId")?.trim();
    const days = Math.min(Math.max(parseInt(searchParams.get("days") || "30", 10), 1), 365);
    if (!companyId) {
      return NextResponse.json({ error: "companyId required" }, { status: 400 });
    }

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
    since.setUTCHours(0, 0, 0, 0);

    const admin = createAdminClient();
    const { data, error } = await admin.rpc("analytics_get_summary", {
      p_company_id: companyId,
      p_since: since.toISOString(),
    });

    if (error) {
      console.error("analytics_get_summary:", error);
      return NextResponse.json({ error: "Failed to load analytics." }, { status: 500 });
    }

    const { data: keys, error: keysError } = await admin
      .from("analytics_site_keys")
      .select("id, label, write_key, created_at")
      .eq("company_id", companyId)
      .order("created_at", { ascending: true });

    if (keysError) {
      console.error("analytics site keys:", keysError);
    }

    return NextResponse.json({
      companyId,
      days,
      since: since.toISOString(),
      summary: data ?? {},
      siteKeys: keys ?? [],
    });
  } catch (err) {
    console.error("analytics summary:", err);
    return NextResponse.json({ error: "Failed to load analytics." }, { status: 500 });
  }
}
