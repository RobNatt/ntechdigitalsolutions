import { OsPageFrame } from "@/components/os/OsPageFrame";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { requireOsFeaturePage } from "@/lib/os/require-os-page";

export default async function ContentEnginePage() {
  const session = await loadDashboardPage();
  requireOsFeaturePage("content-engine", session.settings);
  return (
    <OsPageFrame
      title="Content Engine"
      description="Planned posts and publishing rhythm. Builder UI comes later."
      brandColor={session.settings.brand_color}
    />
  );
}
