import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * GET /api/analytics/summary?companyId=&from=YYYY-MM-DD&to=YYYY-MM-DD
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
    if (!companyId) {
      return NextResponse.json({ error: "companyId required" }, { status: 400 });
    }

    const today = new Date();
    const defaultTo = today.toISOString().slice(0, 10);
    const defaultFrom = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const fromRaw = searchParams.get("from")?.trim() || defaultFrom;
    const toRaw = searchParams.get("to")?.trim() || defaultTo;

    const fromDate = new Date(`${fromRaw}T00:00:00.000Z`);
    const toDate = new Date(`${toRaw}T23:59:59.999Z`);
    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()) || fromDate > toDate) {
      return NextResponse.json({ error: "Invalid date range." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin.rpc("analytics_get_summary", {
      p_company_id: companyId,
      p_since: fromDate.toISOString(),
      p_until: toDate.toISOString(),
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
      since: fromDate.toISOString(),
      until: toDate.toISOString(),
      summary: data ?? {},
      siteKeys: keys ?? [],
    });
  } catch (err) {
    console.error("analytics summary:", err);
    return NextResponse.json({ error: "Failed to load analytics." }, { status: 500 });
  }
}
