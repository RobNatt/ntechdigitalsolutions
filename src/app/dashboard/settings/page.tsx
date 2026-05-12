import { OsSettingsPanel, type WorkspaceProfileRow } from "@/app/dashboard/settings/OsSettingsPanel";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { mapOsClientRow } from "@/lib/os/os-entity-types";
import { requireOsInternal } from "@/lib/os/require-os-page";
import { isOsWorkspaceAdmin } from "@/lib/os/workspace-admin";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const session = await loadDashboardPage();
  requireOsInternal(session);
  const supabase = await createClient();

  const { data: profRows, error: pErr } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, os_role, os_client_id")
    .order("full_name", { ascending: true })
    .limit(500);
  if (pErr) {
    console.warn("settings profiles fetch:", pErr.message);
  }
  const profiles: WorkspaceProfileRow[] = (profRows ?? []).map((row) => {
    const r = row as {
      id: string;
      email?: string | null;
      full_name?: string | null;
      role?: string | null;
      os_role?: string | null;
      os_client_id?: string | null;
    };
    return {
      id: String(r.id),
      email: r.email != null ? String(r.email) : null,
      full_name: r.full_name != null ? String(r.full_name) : null,
      role: r.role != null ? String(r.role) : null,
      os_role: r.os_role != null ? String(r.os_role) : null,
      os_client_id: r.os_client_id != null ? String(r.os_client_id) : null,
    };
  });

  const { data: clientRows, error: cErr } = await supabase
    .from("os_clients")
    .select("*")
    .order("business_name", { ascending: true })
    .limit(1000);
  if (cErr) {
    console.warn("settings clients fetch:", cErr.message);
  }
  const clients = (clientRows ?? []).map((r) => {
    const c = mapOsClientRow(r as Record<string, unknown>);
    return {
      id: c.id,
      label: c.business_name?.trim() || c.contact_name?.trim() || c.id.slice(0, 8),
    };
  });

  return (
    <OsSettingsPanel
      settings={session.settings}
      isWorkspaceAdmin={isOsWorkspaceAdmin(session)}
      profiles={profiles}
      clients={clients}
      currentUserId={session.userId}
    />
  );
}
