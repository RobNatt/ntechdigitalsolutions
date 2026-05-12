import { OsPageFrame } from "@/components/os/OsPageFrame";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";

export default async function ClientsPage() {
  const session = await loadDashboardPage();
  return (
    <OsPageFrame
      title="Clients"
      description="Accounts you serve. Directory UI hooks up after data wiring."
      brandColor={session.settings.brand_color}
    />
  );
}
