import { OsPageFrame } from "@/components/os/OsPageFrame";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";

export default async function ProjectsPage() {
  const session = await loadDashboardPage();
  return (
    <OsPageFrame
      title="Projects"
      description="Delivery work tied to clients. Kanban and milestones come later."
      brandColor={session.settings.brand_color}
    />
  );
}
