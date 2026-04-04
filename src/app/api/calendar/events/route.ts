import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isCalendarEventType } from "@/lib/calendar/eventTypes";

function parseHm(s: string): { hour: number; minutes: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const hour = parseInt(m[1], 10);
  const minutes = parseInt(m[2], 10);
  if (hour < 0 || hour > 23 || minutes < 0 || minutes > 59) return null;
  return { hour, minutes };
}

/**
 * GET /api/calendar/events?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let query = supabase.from("calendar_events").select("*").order("date", { ascending: true });

    if (from) query = query.gte("date", from);
    if (to) query = query.lte("date", to);

    const { data, error } = await query;

    if (error) {
      console.error("Calendar list error:", error);
      return NextResponse.json({ error: "Failed to load events." }, { status: 500 });
    }

    const events = [...(data || [])].sort((a, b) => {
      if (a.date !== b.date) return String(a.date).localeCompare(String(b.date));
      const ah = (a.hour ?? 0) * 60 + (a.start_minutes ?? 0);
      const bh = (b.hour ?? 0) * 60 + (b.start_minutes ?? 0);
      return ah - bh;
    });

    return NextResponse.json({ events });
  } catch (err) {
    console.error("Calendar GET error:", err);
    return NextResponse.json({ error: "Failed to load events." }, { status: 500 });
  }
}

/**
 * POST /api/calendar/events
 * Body: title, date (YYYY-MM-DD), start_time, end_time (HH:mm), event_type,
 *       notes?, lead_id?, client_id?, remind_at? (ISO) | null
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const title = String(body.title ?? "").trim();
    const date = String(body.date ?? "").trim();
    const startTime = String(body.start_time ?? "").trim();
    const endTime = String(body.end_time ?? "").trim();

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date (use YYYY-MM-DD)." }, { status: 400 });
    }

    const st = parseHm(startTime);
    if (!st) {
      return NextResponse.json({ error: "Invalid start_time (use HH:mm)." }, { status: 400 });
    }

    let et = endTime ? parseHm(endTime) : null;
    if (endTime && !et) {
      return NextResponse.json({ error: "Invalid end_time (use HH:mm)." }, { status: 400 });
    }
    if (!et) {
      const endMin = st.hour * 60 + st.minutes + 30;
      et = { hour: Math.floor(endMin / 60) % 24, minutes: endMin % 60 };
    }

    const startTotal = st.hour * 60 + st.minutes;
    let endTotal = et.hour * 60 + et.minutes;
    if (endTotal <= startTotal) {
      endTotal = startTotal + 30;
    }
    const durationHours = Math.max(1, Math.ceil((endTotal - startTotal) / 60));

    const eventType = String(body.event_type ?? "other").trim();
    if (!isCalendarEventType(eventType)) {
      return NextResponse.json({ error: "Invalid event_type." }, { status: 400 });
    }

    const notes =
      body.notes === undefined || body.notes === null
        ? null
        : String(body.notes).trim() || null;

    const leadId =
      typeof body.lead_id === "string" && body.lead_id.trim() ? body.lead_id.trim() : null;
    const clientId =
      typeof body.client_id === "string" && body.client_id.trim() ? body.client_id.trim() : null;

    let remindAt: string | null = null;
    if (body.remind_at === null) {
      remindAt = null;
    } else if (typeof body.remind_at === "string" && body.remind_at.trim()) {
      const d = new Date(body.remind_at);
      if (!Number.isNaN(d.getTime())) {
        remindAt = d.toISOString();
      }
    }

    const nowIso = new Date().toISOString();

    const row = {
      user_id: user.id,
      title,
      date,
      hour: st.hour,
      duration: durationHours,
      start_minutes: st.minutes,
      end_minutes: endTotal,
      notes,
      color: eventTypeColor(eventType),
      event_type: eventType,
      lead_id: leadId,
      client_id: clientId,
      remind_at: remindAt,
      notification_sent_at: null,
      updated_at: nowIso,
    };

    const { data, error } = await supabase.from("calendar_events").insert(row).select("*").single();

    if (error) {
      console.error("Calendar insert error:", error);
      return NextResponse.json({ error: "Failed to create event." }, { status: 500 });
    }

    return NextResponse.json({ event: data });
  } catch (err) {
    console.error("Calendar POST error:", err);
    return NextResponse.json({ error: "Failed to create event." }, { status: 500 });
  }
}

function eventTypeColor(eventType: string): string {
  switch (eventType) {
    case "lead_call":
      return "#0ea5e9";
    case "client_onboarding":
      return "#22c55e";
    case "client_follow_up":
      return "#a855f7";
    default:
      return "#64748b";
  }
}
