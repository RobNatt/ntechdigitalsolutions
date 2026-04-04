import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/clients — list clients (authenticated dashboard)
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
    const limit = Math.min(parseInt(searchParams.get("limit") || "200", 10), 500);

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Clients fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch clients." }, { status: 500 });
    }

    return NextResponse.json({ clients: data });
  } catch (err) {
    console.error("Clients API error:", err);
    return NextResponse.json({ error: "Failed to fetch clients." }, { status: 500 });
  }
}
