import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * GET /api/support/messages?clientId=&companyId=&limit=
 * Authenticated — list support messages for CEO inbox.
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
    const clientId = searchParams.get("clientId")?.trim();
    const companyId = searchParams.get("companyId")?.trim();
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 300);

    const admin = createAdminClient();
    let query = admin
      .from("support_inbound_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (clientId) query = query.eq("client_id", clientId);
    if (companyId) query = query.eq("company_id", companyId);

    const { data, error } = await query;

    if (error) {
      console.error("support messages fetch:", error);
      return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (e) {
    console.error("support messages:", e);
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }
}
