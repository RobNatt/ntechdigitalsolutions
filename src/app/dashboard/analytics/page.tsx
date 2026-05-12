import { OsPageFrame } from "@/components/os/OsPageFrame";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { requireOsFeaturePage } from "@/lib/os/require-os-page";

export default async function AnalyticsPage() {
  const session = await loadDashboardPage();
  requireOsFeaturePage("analytics", session.settings);
  return (
    <OsPageFrame
      title="Analytics"
      description="Performance metrics will live here when enabled. No charts in Prompt 1."
      brandColor={session.settings.brand_color}
    />
  );
}
