import { LeadsCrmClient } from "@/components/os/leads/LeadsCrmClient";
import { DEFAULT_OS_SETTINGS } from "@/lib/os/default-settings";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { mapOsLeadRow } from "@/lib/os/map-os-lead";
import type { AssigneeOption } from "@/lib/os/leads-types";
import { createClient } from "@/lib/supabase/server";

const LEAD_LIST_COLUMNS =
  "id, lead_name, business_name, email, phone, source, status, temperature, tags, assigned_user_id, linked_client_id, created_at, updated_at";

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

  const since = new Date();
  since.setDate(since.getDate() - 7);
  const sinceIso = since.toISOString();

  const leadsQuery = supabase
    .from("os_leads")
    .select(LEAD_LIST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(500);

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

  const [leadsRes, c7Res, cuRes, assigneesRes] = await Promise.all([
    leadsQuery,
    count7dQuery,
    countUncontactedQuery,
    assigneesQuery,
  ]);

  if (leadsRes.error) {
    console.warn("os_leads fetch:", leadsRes.error.message);
  }
  const leads = (leadsRes.data ?? []).map((r) => mapOsLeadRow(r as Record<string, unknown>));

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
    />
  );
}
