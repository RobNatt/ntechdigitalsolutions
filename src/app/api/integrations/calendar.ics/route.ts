import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOsSession } from "@/lib/os/get-os-settings";
import { buildDashboardEventsIcs } from "@/lib/integrations/build-calendar-ics";

export const runtime = "nodejs";

function parseYmd(s: string | null): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export async function GET(req: Request) {
  const session = await getOsSession();
  if (!session?.userId || !session.isInternal) {
    return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fromStr = searchParams.get("from");
  const toStr = searchParams.get("to");
  const from = parseYmd(fromStr);
  const to = parseYmd(toStr);
  if (!from || !to || from > to) {
    return NextResponse.json(
      { ok: false, error: "Provide valid from and to query params as YYYY-MM-DD (from ≤ to)." },
      { status: 400 }
    );
  }

  const startIso = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0).toISOString();
  const endExclusive = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1, 0, 0, 0).toISOString();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("os_events")
    .select("id, title, date_start, date_end, meeting_link")
    .gte("date_start", startIso)
    .lt("date_start", endExclusive)
    .order("date_start", { ascending: true })
    .limit(500);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const ics = buildDashboardEventsIcs(
    (data ?? []).map((r) => ({
      id: String((r as { id: string }).id),
      title: String((r as { title?: string }).title ?? ""),
      date_start: String((r as { date_start: string }).date_start),
      date_end: String((r as { date_end: string }).date_end),
      meeting_link: (r as { meeting_link?: string | null }).meeting_link ?? null,
    }))
  );

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="dashboard-events-${fromStr}-to-${toStr}.ics"`,
    },
  });
}
