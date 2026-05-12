import { OsPageFrame } from "@/components/os/OsPageFrame";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { requireOsFeaturePage } from "@/lib/os/require-os-page";

export default async function SopsPage() {
  const session = await loadDashboardPage();
  requireOsFeaturePage("sops", session.settings);
  return (
    <OsPageFrame
      title="SOPs"
      description="Standard operating procedures and links. Library UI follows."
      brandColor={session.settings.brand_color}
    />
  );
}
