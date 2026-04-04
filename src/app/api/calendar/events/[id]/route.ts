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

/**
 * PATCH /api/calendar/events/[id]
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) {
      const title = String(body.title ?? "").trim();
      if (!title) {
        return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
      }
      updates.title = title;
    }

    if (body.date !== undefined) {
      const date = String(body.date ?? "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json({ error: "Invalid date." }, { status: 400 });
      }
      updates.date = date;
    }

    if (body.start_time !== undefined || body.end_time !== undefined) {
      const { data: existing, error: fetchErr } = await supabase
        .from("calendar_events")
        .select("hour, start_minutes, date")
        .eq("id", id)
        .maybeSingle();

      if (fetchErr || !existing) {
        return NextResponse.json({ error: "Event not found." }, { status: 404 });
      }

      const startStr =
        body.start_time !== undefined
          ? String(body.start_time).trim()
          : `${String(existing.hour).padStart(2, "0")}:${String(existing.start_minutes ?? 0).padStart(2, "0")}`;

      const st = parseHm(startStr);
      if (!st) {
        return NextResponse.json({ error: "Invalid start_time." }, { status: 400 });
      }

      let et: { hour: number; minutes: number };
      if (body.end_time !== undefined && String(body.end_time).trim()) {
        const parsed = parseHm(String(body.end_time));
        if (!parsed) {
          return NextResponse.json({ error: "Invalid end_time." }, { status: 400 });
        }
        et = parsed;
      } else {
        const endMin = st.hour * 60 + st.minutes + 30;
        et = { hour: Math.floor(endMin / 60) % 24, minutes: endMin % 60 };
      }

      const startTotal = st.hour * 60 + st.minutes;
      let endTotal = et.hour * 60 + et.minutes;
      if (endTotal <= startTotal) {
        endTotal = startTotal + 30;
      }
      updates.hour = st.hour;
      updates.start_minutes = st.minutes;
      updates.end_minutes = endTotal;
      updates.duration = Math.max(1, Math.ceil((endTotal - startTotal) / 60));
    }

    if (body.event_type !== undefined) {
      const eventType = String(body.event_type ?? "").trim();
      if (!isCalendarEventType(eventType)) {
        return NextResponse.json({ error: "Invalid event_type." }, { status: 400 });
      }
      updates.event_type = eventType;
      updates.color = eventTypeColor(eventType);
    }

    if (body.notes !== undefined) {
      updates.notes =
        body.notes === null ? null : String(body.notes).trim() || null;
    }

    if (body.lead_id !== undefined) {
      updates.lead_id =
        typeof body.lead_id === "string" && body.lead_id.trim() ? body.lead_id.trim() : null;
    }
    if (body.client_id !== undefined) {
      updates.client_id =
        typeof body.client_id === "string" && body.client_id.trim() ? body.client_id.trim() : null;
    }

    if (body.remind_at !== undefined) {
      if (body.remind_at === null) {
        updates.remind_at = null;
        updates.notification_sent_at = null;
      } else if (typeof body.remind_at === "string" && body.remind_at.trim()) {
        const d = new Date(body.remind_at);
        if (Number.isNaN(d.getTime())) {
          return NextResponse.json({ error: "Invalid remind_at." }, { status: 400 });
        }
        updates.remind_at = d.toISOString();
        updates.notification_sent_at = null;
      }
    }

    if (body.notification_sent_at !== undefined) {
      if (body.notification_sent_at === null) {
        updates.notification_sent_at = null;
      } else {
        updates.notification_sent_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from("calendar_events")
      .update(updates)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Calendar PATCH error:", error);
      return NextResponse.json({ error: "Failed to update event." }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({ event: data });
  } catch (err) {
    console.error("Calendar PATCH error:", err);
    return NextResponse.json({ error: "Failed to update event." }, { status: 500 });
  }
}

/**
 * DELETE /api/calendar/events/[id]
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data: deleted, error } = await supabase
      .from("calendar_events")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("Calendar DELETE error:", error);
      return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
    }

    if (!deleted?.length) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Calendar DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
  }
}
