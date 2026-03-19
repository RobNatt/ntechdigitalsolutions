import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/leads - List leads (dashboard only, requires auth)
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
    const source = searchParams.get("source");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 500);

    const admin = createAdminClient();
    let query = admin.from("leads").select("*").order("created_at", { ascending: false }).limit(limit);

    if (source) {
      query = query.eq("source", source);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Leads fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch leads." }, { status: 500 });
    }

    return NextResponse.json({ leads: data });
  } catch (err) {
    console.error("Leads API error:", err);
    return NextResponse.json({ error: "Failed to fetch leads." }, { status: 500 });
  }
}
