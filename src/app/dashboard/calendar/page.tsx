import { CalendarPageClient } from "@/components/os/calendar/CalendarPageClient";
import { DEFAULT_OS_SETTINGS } from "@/lib/os/default-settings";
import { loadDashboardPage } from "@/lib/os/load-dashboard-page";
import type { LeadPickRow } from "@/lib/os/os-entity-types";
import { mapOsClientRow, mapOsEventRow } from "@/lib/os/os-entity-types";
import { createClient } from "@/lib/supabase/server";

export default async function CalendarPage() {
  const session = await loadDashboardPage();
  const supabase = await createClient();

  const { data: eventRows, error: eErr } = await supabase
    .from("os_events")
    .select("*")
    .order("date_start", { ascending: true })
    .limit(3000);
  if (eErr) {
    console.warn("os_events fetch:", eErr.message);
  }
  const events = (eventRows ?? []).map((r) => mapOsEventRow(r as Record<string, unknown>));

  const { data: clientRows, error: cErr } = await supabase
    .from("os_clients")
    .select("*")
    .order("business_name", { ascending: true })
    .limit(2000);
  if (cErr) {
    console.warn("os_clients fetch (calendar):", cErr.message);
  }
  const clients = (clientRows ?? []).map((r) => mapOsClientRow(r as Record<string, unknown>));

  let leadsPick: LeadPickRow[] = [];
  if (session.isInternal) {
    const { data: leadRows, error: lErr } = await supabase
      .from("os_leads")
      .select("id, lead_name, business_name")
      .order("created_at", { ascending: false })
      .limit(500);
    if (!lErr && leadRows) {
      leadsPick = leadRows.map((row) => {
        const r = row as { id: string; lead_name?: string | null; business_name?: string | null };
        const name = (r.lead_name ?? "").trim() || (r.business_name ?? "").trim() || r.id;
        const sub = (r.lead_name ?? "").trim() && (r.business_name ?? "").trim() ? ` · ${r.business_name}` : "";
        return { id: r.id, label: `${name}${sub}` };
      });
    }
  }

  const eventTypes =
    session.settings.enum_defaults?.event_types ?? DEFAULT_OS_SETTINGS.enum_defaults!.event_types;
  const eventStatuses =
    session.settings.enum_defaults?.event_status ?? DEFAULT_OS_SETTINGS.enum_defaults!.event_status;

  return (
    <CalendarPageClient
      initialEvents={events}
      brandColor={session.settings.brand_color}
      isInternal={session.isInternal}
      timeZone={session.settings.timezone}
      eventTypes={eventTypes}
      eventStatuses={eventStatuses}
      leadsPick={leadsPick}
      clients={clients}
      linkedClientId={session.profile?.os_client_id ?? null}
    />
  );
}
