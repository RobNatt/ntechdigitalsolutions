import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const STAGES = ["submitted", "contacted", "appointment_set", "qualified", "closed_won", "closed_lost"] as const;

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
    const body = await request.json();
    const stage = String(body.stage || "");

    if (!STAGES.includes(stage as (typeof STAGES)[number])) {
      return NextResponse.json({ error: "Invalid stage." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("leads")
      .update({
        stage,
        stage_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to update lead." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead update error:", err);
    return NextResponse.json({ error: "Failed to update lead." }, { status: 500 });
  }
}
