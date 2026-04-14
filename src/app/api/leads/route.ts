import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPipelineStage } from "@/lib/leads/stages";
import { isLeadTemperature } from "@/lib/leads/temperature";

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
    const stage = searchParams.get("stage");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 500);

    const admin = createAdminClient();
    let query = admin.from("leads").select("*").order("created_at", { ascending: false }).limit(limit);

    if (source) query = query.eq("source", source);
    if (stage) query = query.eq("stage", stage);

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

/**
 * POST /api/leads - Create a lead manually (dashboard only, requires auth)
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
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const emailRaw = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const source = String(body.source ?? "").trim() || "manual_entry";
    const leadType = String(body.lead_type ?? "").trim() || "business_owner";
    const stage = String(body.stage ?? "").trim() || "submitted";
    const temperature = String(body.temperature ?? "").trim().toLowerCase() || "warm";
    const notes = String(body.notes ?? "").trim();
    const detailsRaw = body.details;

    if (!name && !emailRaw && !phone) {
      return NextResponse.json(
        { error: "Add at least one of name, email, or phone." },
        { status: 400 }
      );
    }
    if (emailRaw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (!isPipelineStage(stage)) {
      return NextResponse.json({ error: "Invalid stage." }, { status: 400 });
    }
    if (!isLeadTemperature(temperature)) {
      return NextResponse.json({ error: "Invalid temperature." }, { status: 400 });
    }

    const details: Record<string, unknown> =
      detailsRaw && typeof detailsRaw === "object" && !Array.isArray(detailsRaw)
        ? { ...(detailsRaw as Record<string, unknown>) }
        : {};
    if (notes) details.notes = notes;
    details.lead_temperature = temperature;

    const nowIso = new Date().toISOString();
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("leads")
      .insert({
        company_id: process.env.DEFAULT_COMPANY_ID ?? null,
        source,
        lead_type: leadType,
        name: name || null,
        email: emailRaw || null,
        phone: phone || null,
        address: address || null,
        details,
        stage,
        stage_updated_at: nowIso,
        updated_at: nowIso,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Lead create error:", error);
      return NextResponse.json(
        { error: "Failed to create lead.", hint: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead: data });
  } catch (err) {
    console.error("Leads POST error:", err);
    return NextResponse.json({ error: "Failed to create lead." }, { status: 500 });
  }
}
