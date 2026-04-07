import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  expandCalendarEventsForRange,
  type CalendarEventRow,
} from "@/lib/calendar/recurrence";

function allowedSlotsForDate(date: string): string[] {
  const d = new Date(`${date}T00:00:00`);
  const day = d.getDay();
  const slots: string[] = [];
  const pushRange = (startH: number, endH: number) => {
    for (let h = startH; h <= endH; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
  };
  if (day >= 1 && day <= 5) pushRange(8, 18);
  else pushRange(14, 16);
  return slots;
}

function slotOverlapsEvent(slot: string, event: Record<string, unknown>): boolean {
  const [h, m] = slot.split(":").map(Number);
  const slotStart = h * 60 + m;
  const slotEnd = slotStart + 30;
  const evStart = Number(event.hour ?? 0) * 60 + Number(event.start_minutes ?? 0);
  const evEnd = Number(event.end_minutes ?? evStart + 30);
  return slotStart < evEnd && slotEnd > evStart;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date")?.trim() || "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "date query param required (YYYY-MM-DD)." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: owner } = await admin
      .from("profiles")
      .select("id, role")
      .in("role", ["ceo", "admin"])
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!owner?.id) {
      return NextResponse.json({ error: "No dashboard owner found." }, { status: 500 });
    }

    const [{ data: nonRecurring }, { data: recurring }] = await Promise.all([
      admin
        .from("calendar_events")
        .select("*")
        .eq("user_id", owner.id)
        .eq("date", date)
        .or("recurrence.is.null,recurrence.eq.none"),
      admin
        .from("calendar_events")
        .select("*")
        .eq("user_id", owner.id)
        .in("recurrence", ["daily", "weekly", "monthly", "yearly"])
        .lte("date", date)
        .or(`recurrence_until.is.null,recurrence_until.gte.${date}`),
    ]);

    const rows = [...((nonRecurring ?? []) as CalendarEventRow[]), ...((recurring ?? []) as CalendarEventRow[])];
    const expanded = expandCalendarEventsForRange(rows, date, date);
    const available = allowedSlotsForDate(date).filter(
      (slot) => !expanded.some((ev) => slotOverlapsEvent(slot, ev))
    );
    return NextResponse.json({
      date,
      available,
      unavailableCount: allowedSlotsForDate(date).length - available.length,
    });
  } catch (e) {
    console.error("book-call availability:", e);
    return NextResponse.json({ error: "Failed to load availability." }, { status: 500 });
  }
}
