import { LeadsCrmClient } from "@/components/os/leads/LeadsCrmClient";
import { DEFAULT_OS_SETTINGS } from "@/lib/os/default-settings";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { mapOsLeadRow } from "@/lib/os/map-os-lead";
import type { AssigneeOption } from "@/lib/os/leads-types";
import { createClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
  const session = await loadDashboardPage();
  const supabase = await createClient();

  const stages =
    session.settings.enum_defaults?.lead_stages ?? DEFAULT_OS_SETTINGS.enum_defaults!.lead_stages;
  const temps =
    session.settings.enum_defaults?.lead_temperatures ??
    DEFAULT_OS_SETTINGS.enum_defaults!.lead_temperatures;
  const uncontacted = session.settings.uncontacted_stage ?? "New";

  const commonTags = session.settings.enum_defaults?.common_tags ?? [];

  const { data: leadRows, error: leadsErr } = await supabase
    .from("os_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (leadsErr) {
    console.warn("os_leads fetch:", leadsErr.message);
  }

  const leads = (leadRows ?? []).map((r) => mapOsLeadRow(r as Record<string, unknown>));

  const since = new Date();
  since.setDate(since.getDate() - 7);
  const sinceIso = since.toISOString();

  const { count: c7 } = await supabase
    .from("os_leads")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sinceIso);

  const { count: cu } = await supabase
    .from("os_leads")
    .select("*", { count: "exact", head: true })
    .eq("status", uncontacted);

  let assignees: AssigneeOption[] = [];
  if (session.isInternal) {
    const { data: profs, error: pErr } = await supabase
      .from("profiles")
      .select("id, full_name, email, os_role")
      .limit(400);
    if (!pErr && profs) {
      assignees = profs
        .filter((p) => (p as { os_role?: string | null }).os_role !== "client")
        .map((p) => {
          const row = p as { id: string; full_name?: string | null; email?: string | null };
          const label = [row.full_name, row.email].filter(Boolean).join(" · ") || row.id;
          return { id: row.id, label };
        });
    }
  }

  return (
    <LeadsCrmClient
      initialLeads={leads}
      leadStages={stages}
      leadTemperatures={temps}
      uncontactedStage={uncontacted}
      brandColor={session.settings.brand_color}
      isInternal={session.isInternal}
      assignees={assignees}
      kpiNew7d={c7 ?? 0}
      kpiUncontacted={cu ?? 0}
      commonTags={commonTags}
    />
  );
}
