import { RevenuePageClient } from "@/components/os/revenue/RevenuePageClient";
import { DEFAULT_OS_SETTINGS } from "@/lib/os/default-settings";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import { currentWallYmdParts, getMonthRangeYmd } from "@/lib/os/os-revenue-range";
import { mapOsClientRow, mapOsPaymentRow } from "@/lib/os/os-entity-types";
import { createClient } from "@/lib/supabase/server";

export default async function RevenuePage() {
  const session = await loadDashboardPage();
  const supabase = await createClient();
  const tz = session.settings.timezone;
  const { y, m } = currentWallYmdParts(tz);
  const { from, to } = getMonthRangeYmd(y, m);

  const paymentsQuery = supabase
    .from("os_payments")
    .select("*")
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false })
    .limit(2000);

  const clientsQuery = supabase
    .from("os_clients")
    .select("*")
    .order("business_name", { ascending: true })
    .limit(2000);

  const [{ data: payRows, error: payErr }, { data: clientRows, error: cErr }] = await Promise.all([
    paymentsQuery,
    clientsQuery,
  ]);

  if (payErr) {
    console.warn("os_payments fetch:", payErr.message);
  }
  const payments = (payRows ?? []).map((r) => mapOsPaymentRow(r as Record<string, unknown>));
  const total = payments.reduce((s, p) => s + p.amount, 0);

  if (cErr) {
    console.warn("os_clients fetch (revenue):", cErr.message);
  }
  const clients = (clientRows ?? []).map((r) => mapOsClientRow(r as Record<string, unknown>));

  const paymentMethods =
    session.settings.enum_defaults?.payment_methods ?? DEFAULT_OS_SETTINGS.enum_defaults!.payment_methods;

  return (
    <RevenuePageClient
      initialPayments={payments}
      initialFrom={from}
      initialTo={to}
      initialTotal={total}
      clients={clients}
      currency={session.settings.currency}
      timeZone={tz}
      paymentMethods={paymentMethods}
      isInternal={session.isInternal}
      brandColor={session.settings.brand_color}
    />
  );
}
