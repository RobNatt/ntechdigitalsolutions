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
      const name = String(body.name ?? "").trim() || null;
      updates.name = name;
      updates.full_name = name;
    }
    if (body.email !== undefined) {
      const email = String(body.email ?? "").trim() || null;
      updates.email = email;
    }
    if (body.phone !== undefined) {
      const phone = String(body.phone ?? "").trim() || null;
      updates.phone = phone;
      updates.phone_number = phone;
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
      return NextResponse.json({ error: "Failed to update lead." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead PATCH error:", err);
    return NextResponse.json({ error: "Failed to update lead." }, { status: 500 });
  }
}
