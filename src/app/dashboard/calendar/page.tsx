import { OsPageFrame } from "@/components/os/OsPageFrame";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";

export default async function CalendarPage() {
  const session = await loadDashboardPage();
  const tz = session.settings.timezone;
  return (
    <OsPageFrame
      title="Calendar"
      description={`Events use the workspace timezone: ${tz}. Sync and views ship in a later prompt.`}
      brandColor={session.settings.brand_color}
    />
  );
}
