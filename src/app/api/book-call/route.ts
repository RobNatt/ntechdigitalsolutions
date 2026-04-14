import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendGroqVerificationReminderEmail,
  sendInquiryAutoReply,
  sendInquiryNotification,
  sendInquirySmsFollowUp,
} from "@/lib/email";
import { scoreInquiryLead } from "@/lib/inquiries/lead-qualifier";

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isAllowedSlot(date: string, time: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return false;
  const d = new Date(`${date}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d < tomorrow) return false;

  const [h, m] = time.split(":").map(Number);
  if (m !== 0 && m !== 30) return false;
  const day = d.getDay();
  if (day >= 1 && day <= 5) return h >= 8 && (h < 18 || (h === 18 && m === 0));
  return h >= 14 && (h < 16 || (h === 16 && m === 0));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim() || null;
    const company = String(body.company ?? "").trim() || null;
    const plan = String(body.plan ?? "").trim() || null;
    const date = String(body.date ?? "").trim();
    const time = String(body.time ?? "").trim();
    const notes = String(body.notes ?? "").trim() || null;

    if (!name || !isValidEmail(email) || !isAllowedSlot(date, time)) {
      return NextResponse.json({ error: "Invalid booking details." }, { status: 400 });
    }

    const score = scoreInquiryLead({
      phone,
      company,
      planInterest: plan,
      budget: null,
      message: notes || "Booked phone call with Robert Nattrass",
      sourcePage: "/book-call",
    });

    const admin = createAdminClient();
    const { data: owner } = await admin
      .from("profiles")
      .select("id, role")
      .in("role", ["ceo", "admin"])
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!owner?.id) {
      return NextResponse.json({ error: "No dashboard owner user found." }, { status: 500 });
    }
    const nowIso = new Date().toISOString();
    const fullName = name || email || phone || "Unknown Lead";
    const details: Record<string, unknown> = {
      source_page: "/book-call",
      booking_date: date,
      booking_time: time,
      plan_interest: plan,
      notes,
      lead_score: score.score,
      lead_temperature: score.temperature,
    };

    const { data: leadRow, error: leadErr } = await admin
      .from("leads")
      .insert({
        company_id: process.env.DEFAULT_COMPANY_ID ?? null,
        source: "website_booking",
        lead_type: "book_call",
        name,
        full_name: fullName,
        email,
        phone,
        phone_number: phone || "",
        details,
        stage: "submitted",
        stage_updated_at: nowIso,
        updated_at: nowIso,
      })
      .select("id")
      .single();

    if (leadErr || !leadRow?.id) {
      console.error("book-call lead insert:", leadErr);
      return NextResponse.json({ error: "Could not save booking lead." }, { status: 500 });
    }

    const [h, m] = time.split(":").map(Number);
    const startTotal = h * 60 + m;
    const endTotal = startTotal + 30;

    const { error: calErr } = await admin.from("calendar_events").insert({
      user_id: owner.id,
      title: `Phone call: ${name} with Robert Nattrass`,
      date,
      hour: h,
      duration: 1,
      start_minutes: m,
      end_minutes: endTotal,
      notes: notes ? `${notes}\n\nVerify this booking in dashboard assistant.` : "Verify this booking in dashboard assistant.",
      color: "#0ea5e9",
      event_type: "lead_call",
      lead_id: leadRow.id,
      client_id: null,
      recurrence: "none",
      recurrence_until: null,
      reminder_minutes_before: 15,
      remind_at: null,
      notification_sent_at: null,
      updated_at: nowIso,
    });
    if (calErr) console.error("book-call calendar insert:", calErr);

    await sendInquiryNotification({
      id: leadRow.id,
      name,
      email,
      company,
      phone,
      message:
        `Booked phone call with Robert Nattrass for ${date} ${time} (no video).\n${notes ?? ""}`.trim(),
      planInterest: plan,
      sourcePage: "/book-call",
    });
    await sendInquiryAutoReply({
      name,
      email,
      sourcePage: "/book-call",
      planInterest: plan,
    });
    if (phone) await sendInquirySmsFollowUp({ name, phone });

    // Best-effort delayed "Groq verification" reminder email
    setTimeout(async () => {
      try {
        await sendGroqVerificationReminderEmail({
          leadId: leadRow.id,
          bookingDate: date,
          bookingTime: time,
        });
      } catch (e) {
        console.error("book-call delayed groq reminder:", e);
      }
    }, 5 * 60 * 1000);

    return NextResponse.json({ success: true, leadId: leadRow.id });
  } catch (e) {
    console.error("book-call POST:", e);
    return NextResponse.json({ error: "Failed to book call." }, { status: 500 });
  }
}
