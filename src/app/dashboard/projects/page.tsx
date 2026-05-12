import { ProjectsPageClient } from "@/components/os/projects/ProjectsPageClient";
import { DEFAULT_OS_SETTINGS } from "@/lib/os/default-settings";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { mapOsClientRow, mapOsProjectRow } from "@/lib/os/os-entity-types";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const session = await loadDashboardPage();
  const supabase = await createClient();
  const projectStages =
    session.settings.enum_defaults?.project_stages ?? DEFAULT_OS_SETTINGS.enum_defaults!.project_stages;

  const projectsQuery = supabase
    .from("os_projects")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(2000);

  const clientsQuery = supabase
    .from("os_clients")
    .select("*")
    .order("business_name", { ascending: true })
    .limit(2000);

  const [{ data: projectRows, error: pErr }, { data: clientRows, error: cErr }] = await Promise.all([
    projectsQuery,
    clientsQuery,
  ]);

  if (pErr) {
    console.warn("os_projects fetch:", pErr.message);
  }
  const projects = (projectRows ?? []).map((r) => mapOsProjectRow(r as Record<string, unknown>));

  if (cErr) {
    console.warn("os_clients fetch (projects):", cErr.message);
  }
  const clients = (clientRows ?? []).map((r) => mapOsClientRow(r as Record<string, unknown>));

  return (
    <ProjectsPageClient
      initialProjects={projects}
      projectStages={projectStages}
      clients={clients}
      brandColor={session.settings.brand_color}
      isInternal={session.isInternal}
      linkedClientId={session.profile?.os_client_id ?? null}
    />
  );
}
