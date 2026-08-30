import { CommandCenterClient } from "@/components/os/command-center/CommandCenterClient";
import { fetchCommandCenterSnapshot } from "@/lib/os/fetch-command-center";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardHomePage() {
  const session = await loadDashboardPage();
  const supabase = await createClient();
  const snapshot = await fetchCommandCenterSnapshot(supabase, session);

  return <CommandCenterClient snapshot={snapshot} />;
}
