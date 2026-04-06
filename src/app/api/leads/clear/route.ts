import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CONFIRM_PHRASE = "DELETE ALL LEADS";

/**
 * POST /api/leads/clear — remove every lead row (authenticated dashboard only).
 * Body: { "confirm": "DELETE ALL LEADS" }
 * Unlinks source_lead_id on clients first so FKs do not block deletes.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
    }

    if (String(body.confirm ?? "").trim() !== CONFIRM_PHRASE) {
      return NextResponse.json(
        {
          error: "Confirmation required.",
          hint: `Send JSON: { "confirm": "${CONFIRM_PHRASE}" }`,
        },
        { status: 400 }
      );
    }

    let admin;
    try {
      admin = createAdminClient();
    } catch (e) {
      console.error("Admin client:", e);
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const { error: unlinkErr } = await admin
      .from("clients")
      .update({ source_lead_id: null })
      .not("source_lead_id", "is", null);
    if (unlinkErr) {
      console.warn("Unlink clients from leads:", unlinkErr.message);
    }

    const { error: delErr, count } = await admin
      .from("leads")
      .delete({ count: "exact" })
      .gte("created_at", "1970-01-01T00:00:00Z");

    if (delErr) {
      console.error("Leads clear error:", delErr);
      return NextResponse.json(
        { error: "Failed to delete leads.", hint: delErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deleted: count ?? null });
  } catch (err) {
    console.error("Leads clear route:", err);
    return NextResponse.json({ error: "Failed to clear leads." }, { status: 500 });
  }
}
