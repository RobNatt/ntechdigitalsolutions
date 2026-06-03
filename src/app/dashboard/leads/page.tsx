import { LeadsCrmClient } from "@/components/os/leads/LeadsCrmClient";
import { DEFAULT_OS_SETTINGS } from "@/lib/os/default-settings";
import { fetchOsLeadsList, mergeLeadPipelineStages } from "@/lib/os/fetch-os-leads-list";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import type { AssigneeOption } from "@/lib/os/leads-types";
import { createClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
  const session = await loadDashboardPage();
  const supabase = await createClient();

  const settingsStages =
    session.settings.enum_defaults?.lead_stages ?? DEFAULT_OS_SETTINGS.enum_defaults!.lead_stages;
  const temps =
    session.settings.enum_defaults?.lead_temperatures ??
    DEFAULT_OS_SETTINGS.enum_defaults!.lead_temperatures;
  const uncontacted = session.settings.uncontacted_stage ?? "New";

  const commonTags = session.settings.enum_defaults?.common_tags ?? [];

  const since = new Date();
  since.setDate(since.getDate() - 7);
  const sinceIso = since.toISOString();

  const count7dQuery = supabase
    .from("os_leads")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sinceIso);

  const countUncontactedQuery = supabase
    .from("os_leads")
    .select("id", { count: "exact", head: true })
    .eq("status", uncontacted);

  const assigneesQuery = session.isInternal
    ? supabase.from("profiles").select("id, full_name, email, os_role").limit(400)
    : Promise.resolve({ data: null, error: null });

  const [leadsFetch, c7Res, cuRes, assigneesRes] = await Promise.all([
    fetchOsLeadsList(supabase),
    count7dQuery,
    countUncontactedQuery,
    assigneesQuery,
  ]);

  const leads = leadsFetch.leads;
  const stages = mergeLeadPipelineStages(settingsStages, leads);
  const leadsFetchError = leadsFetch.error;
  const migrationPending = leadsFetch.usedLegacyColumns;

  if (leadsFetchError) {
    console.warn("os_leads fetch:", leadsFetchError);
  }

  let assignees: AssigneeOption[] = [];
  if (session.isInternal && assigneesRes.data && !assigneesRes.error) {
    const profs = assigneesRes.data as unknown[];
    if (profs.length) {
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
      kpiNew7d={c7Res.count ?? 0}
      kpiUncontacted={cuRes.count ?? 0}
      commonTags={commonTags}
      leadsFetchError={leadsFetchError}
      migrationPending={migrationPending}
    />
  );
}
