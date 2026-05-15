import type { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;

type MirrorFunnelLeadInput = {
  name: string;
  businessName?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  assignedUserId?: string | null;
  temperature?: "Cold" | "Warm" | "Hot";
  tags?: string[];
};

/**
 * Mirror public funnel submissions into os_leads so dashboard CRM can see them.
 * Best-effort by design: should never block the primary intake path.
 */
export async function mirrorFunnelLeadToOsLeads(
  admin: AdminClient,
  input: MirrorFunnelLeadInput
): Promise<{ osLeadId: string | null }> {
  const leadName = input.name.trim() || input.businessName?.trim() || "Website Lead";
  const businessName = input.businessName?.trim() || "";
  const email = input.email?.trim().toLowerCase() || null;
  const phone = input.phone?.trim() || null;
  const source = input.source?.trim() || "website_funnel";

  const { data, error } = await admin
    .from("os_leads")
    .insert({
      lead_name: leadName,
      business_name: businessName,
      email,
      phone,
      source,
      status: "New",
      temperature: input.temperature ?? "Warm",
      tags: input.tags ?? ["Funnel"],
      assigned_user_id: input.assignedUserId ?? null,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    console.warn("mirrorFunnelLeadToOsLeads:", error.message);
    return { osLeadId: null };
  }

  return { osLeadId: data?.id ? String(data.id) : null };
}
