import { OsPageFrame } from "@/components/os/OsPageFrame";
import { formatOsCurrency } from "@/lib/os/format-os-currency";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";

export default async function RevenuePage() {
  const session = await loadDashboardPage();
  const { currency, brand_color: brandColor } = session.settings;
  const sample = formatOsCurrency(12500, currency);
  return (
    <div className="space-y-6">
      <OsPageFrame
        title="Revenue"
        description={`Payments roll up here using workspace currency (${currency}). Example format: ${sample}.`}
        brandColor={brandColor}
      />
    </div>
  );
}
