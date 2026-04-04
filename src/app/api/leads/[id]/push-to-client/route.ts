import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { startClientOnboarding } from "@/lib/onboarding/startClientOnboarding";

function asDetails(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }
  return {};
}

/**
 * POST /api/leads/[id]/push-to-client
 * Creates a client from the lead, links the lead, sets stage to closed_won,
 * and queues the onboarding stub (extend in lib/onboarding).
 *
 * Body: { retriggerOnboarding?: boolean } — if lead already has client_id, only re-run onboarding when true.
 */
export async function POST(
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

    const { id: leadId } = await params;
    let body: { retriggerOnboarding?: boolean } = {};
    try {
      const text = (await request.text()).trim();
      if (text) body = JSON.parse(text) as { retriggerOnboarding?: boolean };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    let admin;
    try {
      admin = createAdminClient();
    } catch (e) {
      console.error("Admin client:", e);
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const { data: lead, error: fetchError } = await admin
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .maybeSingle();

    if (fetchError || !lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const name =
      (typeof lead.name === "string" && lead.name.trim()) ||
      (typeof lead.email === "string" && lead.email.trim()) ||
      (typeof lead.phone === "string" && lead.phone.trim()) ||
      null;

    if (!name) {
      return NextResponse.json(
        { error: "Add a name, email, or phone before pushing to clients." },
        { status: 400 }
      );
    }

    const existingClientId =
      lead.client_id != null && String(lead.client_id).trim() !== ""
        ? String(lead.client_id)
        : null;

    if (existingClientId) {
      if (!body.retriggerOnboarding) {
        return NextResponse.json(
          {
            error: "This lead is already linked to a client.",
            clientId: existingClientId,
            code: "ALREADY_LINKED",
          },
          { status: 409 }
        );
      }

      try {
        const onboarding = await startClientOnboarding(existingClientId, { leadId });
        return NextResponse.json({
          clientId: existingClientId,
          alreadyLinked: true,
          onboardingRetriggered: true,
          onboarding,
        });
      } catch (e) {
        console.error("Onboarding retrigger:", e);
        return NextResponse.json({ error: "Failed to re-run onboarding." }, { status: 500 });
      }
    }

    const companyId = process.env.DEFAULT_COMPANY_ID;
    const nowIso = new Date().toISOString();
    const leadDetails = asDetails(lead.details);

    const clientInsert: Record<string, unknown> = {
      user_id: user.id,
      ...(companyId ? { company_id: companyId } : {}),
      name: typeof lead.name === "string" && lead.name.trim() ? lead.name.trim() : name,
      email: typeof lead.email === "string" ? lead.email.trim() || null : null,
      phone: typeof lead.phone === "string" ? lead.phone.trim() || null : null,
      address: typeof lead.address === "string" ? lead.address.trim() || null : null,
      source_lead_id: leadId,
      details: {
        ...leadDetails,
        promotedFromLead: true,
        promotedAt: nowIso,
      },
      updated_at: nowIso,
    };

    const { data: created, error: insertError } = await admin
      .from("clients")
      .insert(clientInsert)
      .select("id")
      .maybeSingle();

    if (insertError || !created?.id) {
      console.error("Client insert from lead:", insertError);
      return NextResponse.json(
        {
          error: "Failed to create client. Run migration 014_clients_crm_legacy_align.sql in Supabase if this is an older database.",
          hint: insertError?.message ?? null,
          code: insertError?.code ?? null,
        },
        { status: 500 }
      );
    }

    const clientId = created.id as string;

    const { error: leadUpdateError } = await admin
      .from("leads")
      .update({
        client_id: clientId,
        stage: "closed_won",
        stage_updated_at: nowIso,
        updated_at: nowIso,
      })
      .eq("id", leadId);

    if (leadUpdateError) {
      console.error("Lead link after client create:", leadUpdateError);
      return NextResponse.json(
        {
          error:
            "Client created but failed to link lead. Run migration 012_leads_client_link.sql (adds leads.client_id).",
          clientId,
          hint: leadUpdateError.message,
          code: leadUpdateError.code,
        },
        { status: 500 }
      );
    }

    let onboarding;
    try {
      onboarding = await startClientOnboarding(clientId, { leadId });
    } catch (e) {
      console.error("Onboarding after push:", e);
      return NextResponse.json(
        {
          clientId,
          warning: "Client created and linked, but onboarding hook failed.",
        },
        { status: 207 }
      );
    }

    return NextResponse.json({
      clientId,
      alreadyLinked: false,
      onboarding,
    });
  } catch (err) {
    console.error("push-to-client error:", err);
    return NextResponse.json({ error: "Push to client failed." }, { status: 500 });
  }
}
