import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isCalendarEventType, isRecurrenceType } from "@/lib/calendar/eventTypes";
import {
  computeRemindAtIso,
  expandCalendarEventsForRange,
  type CalendarEventRow,
} from "@/lib/calendar/recurrence";

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

    if (!from || !to || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
      return NextResponse.json(
        { error: "Query params from and to are required (YYYY-MM-DD)." },
        { status: 400 }
      );
    }

    const { data: nonRecurring, error: errNon } = await supabase
      .from("calendar_events")
      .select("*")
      .gte("date", from)
      .lte("date", to)
      .or("recurrence.is.null,recurrence.eq.none");

    const { data: recurring, error: errRec } = await supabase
      .from("calendar_events")
      .select("*")
      .in("recurrence", ["daily", "weekly", "monthly", "yearly"])
      .lte("date", to)
      .or(`recurrence_until.is.null,recurrence_until.gte.${from}`);

    if (errNon || errRec) {
      console.error("Calendar list error:", errNon || errRec);
      return NextResponse.json({ error: "Failed to load events." }, { status: 500 });
    }

    const byId = new Map<string, CalendarEventRow>();
    for (const r of [...(nonRecurring || []), ...(recurring || [])]) {
      byId.set(String((r as { id: string }).id), r as CalendarEventRow);
    }

    const events = expandCalendarEventsForRange([...byId.values()], from, to);

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

    const recurrenceRaw = String(body.recurrence ?? "none").trim();
    const recurrence = isRecurrenceType(recurrenceRaw) ? recurrenceRaw : "none";

    let recurrenceUntil: string | null = null;
    if (recurrence !== "none") {
      const u =
        body.recurrence_until === undefined || body.recurrence_until === null
          ? ""
          : String(body.recurrence_until).trim();
      if (u) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(u)) {
          return NextResponse.json({ error: "Invalid recurrence_until (YYYY-MM-DD)." }, { status: 400 });
        }
        recurrenceUntil = u;
      }
    }

    const alertMinutes =
      typeof body.reminder_minutes_before === "number" && Number.isFinite(body.reminder_minutes_before)
        ? body.reminder_minutes_before
        : typeof body.alert_minutes === "number" && Number.isFinite(body.alert_minutes)
          ? body.alert_minutes
          : null;

    let reminderMinutesBefore: number | null = null;
    if (alertMinutes !== null && alertMinutes >= 0) {
      reminderMinutesBefore = Math.floor(alertMinutes);
    }

    let remindAt: string | null = null;
    if (recurrence === "none") {
      if (body.remind_at === null) {
        remindAt = null;
      } else if (typeof body.remind_at === "string" && body.remind_at.trim()) {
        const d = new Date(body.remind_at);
        if (!Number.isNaN(d.getTime())) {
          remindAt = d.toISOString();
        }
      }
      if (
        !remindAt &&
        reminderMinutesBefore !== null &&
        reminderMinutesBefore >= 0
      ) {
        remindAt = computeRemindAtIso(date, st.hour, st.minutes, reminderMinutesBefore);
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
      recurrence,
      recurrence_until: recurrence === "none" ? null : recurrenceUntil,
      reminder_minutes_before: reminderMinutesBefore,
      remind_at: recurrence === "none" ? remindAt : null,
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
