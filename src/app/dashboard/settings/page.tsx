import { OsPageFrame } from "@/components/os/OsPageFrame";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { requireOsInternal } from "@/lib/os/require-os-page";
import { OsSettingsForm } from "@/app/dashboard/settings/OsSettingsForm";

export default async function SettingsPage() {
  const session = await loadDashboardPage();
  requireOsInternal(session);
  return (
    <div className="space-y-8">
      <OsPageFrame
        title="Settings"
        description="Workspace name, brand color, currency, timezone, and which sidebar areas are visible."
        brandColor={session.settings.brand_color}
        showAddButton={false}
      />
      <OsSettingsForm settings={session.settings} />
    </div>
  );
}
