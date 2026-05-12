import { OsPageFrame } from "@/components/os/OsPageFrame";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";

export default async function LeadsPage() {
  const session = await loadDashboardPage();
  return (
    <OsPageFrame
      title="Leads"
      description="Pipeline for new opportunities. Table and forms arrive in a later prompt."
      brandColor={session.settings.brand_color}
    />
  );
}
