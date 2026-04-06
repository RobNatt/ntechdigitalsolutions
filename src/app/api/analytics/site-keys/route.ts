import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function randomWriteKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return (
    "nt_" +
    Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  );
}

/**
 * POST /api/analytics/site-keys
 * Body: { companyId: string, label?: string }
 * Creates a new write key for a company (tenant). Use for client sites after you have a companies row.
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

    let body: { companyId?: string; label?: string };
    try {
      body = (await request.json()) as { companyId?: string; label?: string };
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const companyId = typeof body.companyId === "string" ? body.companyId.trim() : "";
    if (!companyId) {
      return NextResponse.json({ error: "companyId required" }, { status: 400 });
    }

    const label =
      typeof body.label === "string" && body.label.trim().length > 0
        ? body.label.trim().slice(0, 200)
        : "Site";

    const admin = createAdminClient();
    const { data: company, error: companyError } = await admin
      .from("companies")
      .select("id")
      .eq("id", companyId)
      .maybeSingle();

    if (companyError || !company) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 });
    }

    const writeKey = randomWriteKey();
    const { data: row, error: insertError } = await admin
      .from("analytics_site_keys")
      .insert({
        company_id: companyId,
        label,
        write_key: writeKey,
      })
      .select("id, company_id, label, write_key, created_at")
      .single();

    if (insertError || !row) {
      console.error("site-keys insert:", insertError);
      return NextResponse.json({ error: "Failed to create key." }, { status: 500 });
    }

    return NextResponse.json({ siteKey: row });
  } catch (err) {
    console.error("site-keys POST:", err);
    return NextResponse.json({ error: "Failed to create key." }, { status: 500 });
  }
}
