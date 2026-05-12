import { ClientsPageClient } from "@/components/os/clients/ClientsPageClient";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { mapOsClientRow } from "@/lib/os/os-entity-types";
import { createClient } from "@/lib/supabase/server";

export default async function ClientsPage() {
  const session = await loadDashboardPage();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("os_clients")
    .select("*")
    .order("business_name", { ascending: true })
    .limit(2000);
  if (error) {
    console.warn("os_clients fetch:", error.message);
  }
  const clients = (data ?? []).map((r) => mapOsClientRow(r as Record<string, unknown>));

  return (
    <ClientsPageClient
      initialClients={clients}
      brandColor={session.settings.brand_color}
      isInternal={session.isInternal}
    />
  );
}
