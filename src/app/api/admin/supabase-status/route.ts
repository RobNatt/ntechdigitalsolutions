import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/supabase-status — dashboard-only snapshot of Supabase wiring and DB reachability.
 * Never returns secrets; only booleans, public host, and aggregate counts.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
    const hasPublicUrl = Boolean(publicUrl);
    const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
    const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());

    let projectRef = "";
    let projectHost = "";
    try {
      if (publicUrl) {
        const host = new URL(publicUrl).hostname;
        projectHost = host;
        if (host.endsWith(".supabase.co")) {
          projectRef = host.replace(".supabase.co", "");
        }
      }
    } catch {
      projectHost = "";
    }

    const dashboardHref =
      projectRef && !projectHost.includes("localhost")
        ? `https://supabase.com/dashboard/project/${projectRef}`
        : null;

    let databaseReachable = false;
    let leadsCount: number | null = null;
    let clientsCount: number | null = null;
    let calendarEventsCount: number | null = null;
    const probeErrors: string[] = [];

    if (hasServiceRole && hasPublicUrl) {
      try {
        const admin = createAdminClient();
        const [leadsR, clientsR, eventsR] = await Promise.all([
          admin.from("leads").select("id", { count: "exact", head: true }),
          admin.from("clients").select("id", { count: "exact", head: true }),
          admin.from("calendar_events").select("id", { count: "exact", head: true }),
        ]);

        if (!leadsR.error) {
          leadsCount = leadsR.count ?? 0;
          databaseReachable = true;
        } else {
          probeErrors.push(`leads: ${leadsR.error.message}`);
        }
        if (!clientsR.error) {
          clientsCount = clientsR.count ?? 0;
        } else {
          probeErrors.push(`clients: ${clientsR.error.message}`);
        }
        if (!eventsR.error) {
          calendarEventsCount = eventsR.count ?? 0;
        } else {
          probeErrors.push(`calendar (optional): ${eventsR.error.message}`);
        }
      } catch (e) {
        probeErrors.push(e instanceof Error ? e.message : String(e));
      }
    }

    return NextResponse.json({
      ok: hasPublicUrl && hasServiceRole && hasAnonKey && databaseReachable,
      env: {
        hasPublicUrl,
        hasServiceRole,
        hasAnonKey,
      },
      projectHost: projectHost || null,
      projectRef: projectRef || null,
      dashboardHref,
      databaseReachable,
      counts: {
        leads: leadsCount,
        clients: clientsCount,
        calendar_events: calendarEventsCount,
      },
      probeErrors: probeErrors.length ? probeErrors : undefined,
    });
  } catch (err) {
    console.error("supabase-status:", err);
    return NextResponse.json({ error: "Status check failed." }, { status: 500 });
  }
}
