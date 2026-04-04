import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPipelineStage } from "@/lib/leads/stages";

type LeadDetails = Record<string, unknown>;

function asDetails(value: unknown): LeadDetails {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as LeadDetails) };
  }
  return {};
}

/**
 * PATCH /api/leads/[id] — update CRM fields (authenticated)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: lead, error: fetchError } = await admin
      .from("leads")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = { updated_at: now };

    if (body.name !== undefined) {
      updates.name = String(body.name ?? "").trim() || null;
    }
    if (body.email !== undefined) {
      const email = String(body.email ?? "").trim() || null;
      updates.email = email;
    }
    if (body.phone !== undefined) {
      updates.phone = String(body.phone ?? "").trim() || null;
    }
    if (body.address !== undefined) {
      updates.address = String(body.address ?? "").trim() || null;
    }
    if (body.source !== undefined) {
      const source = String(body.source ?? "").trim();
      updates.source = source || "unknown";
    }
    if (body.lead_type !== undefined) {
      updates.lead_type = String(body.lead_type ?? "").trim() || "homeowner";
    }
    if (body.stage !== undefined) {
      const stage = String(body.stage ?? "").trim();
      if (!isPipelineStage(stage)) {
        return NextResponse.json({ error: "Invalid stage." }, { status: 400 });
      }
      updates.stage = stage;
      updates.stage_updated_at = now;
    }
    if (body.notes !== undefined) {
      const details = asDetails(lead.details);
      const notesVal = body.notes;
      if (notesVal === null || notesVal === "") {
        delete details.notes;
      } else {
        details.notes = String(notesVal);
      }
      updates.details = details;
    }

    if (Object.keys(updates).length <= 1) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    const { error } = await admin.from("leads").update(updates).eq("id", id);

    if (error) {
      console.error("Lead update error:", error);
      return NextResponse.json(
        { error: "Failed to update lead.", hint: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead PATCH error:", err);
    return NextResponse.json({ error: "Failed to update lead." }, { status: 500 });
  }
}

/**
 * DELETE /api/leads/[id] — remove lead (authenticated, admin client)
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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
      .eq("source_lead_id", id);
    if (unlinkErr) {
      console.warn("Unlink clients from deleted lead (column may be missing):", unlinkErr.message);
    }

    const { data: deleted, error } = await admin
      .from("leads")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("Lead delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete lead.", hint: error.message },
        { status: 500 }
      );
    }

    if (!deleted?.length) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete lead." }, { status: 500 });
  }
}
