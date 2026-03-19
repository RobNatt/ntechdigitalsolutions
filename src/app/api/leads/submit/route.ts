import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendLeadNotification } from "@/lib/email";

// Simple rate limit: max 5 submissions per IP per minute (in-memory, resets on cold start)
const submittedIps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = submittedIps.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  submittedIps.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();
    const leadType = String(body.leadType || "").trim();

    if (!name || !phone || !address || !leadType) {
      return NextResponse.json(
        { error: "Name, phone, address, and lead type are required." },
        { status: 400 }
      );
    }

    if (phone.length < 10) {
      return NextResponse.json({ error: "Valid phone number required." }, { status: 400 });
    }

    const source = String(body.source || "unknown").trim();
    const validSource = ["lead_roofing", "client_roofing"].includes(source) ? source : "unknown";

    const details: Record<string, unknown> = {};
    const skipKeys = ["name", "phone", "address", "leadType", "source", "verificationCode", "email"];
    for (const [k, v] of Object.entries(body)) {
      if (skipKeys.includes(k) || v === undefined) continue;
      try {
        details[k] = typeof v === "object" && v !== null ? JSON.parse(JSON.stringify(v)) : v;
      } catch {
        details[k] = String(v);
      }
    }

    let supabase;
    try {
      supabase = createAdminClient();
    } catch (e) {
      console.error("Supabase client error (check SUPABASE_SERVICE_ROLE_KEY):", e);
      return NextResponse.json(
        { error: "Service configuration error. Please try again later." },
        { status: 500 }
      );
    }

    const emailVal = body.email;
    const email = typeof emailVal === "string" ? emailVal.trim() || null : null;

    const defaultCompanyId = process.env.DEFAULT_COMPANY_ID || "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    const insertPayload: Record<string, unknown> = {
      company_id: defaultCompanyId,
      source: validSource,
      lead_type: leadType,
      name,
      phone,
      address,
      email,
      details,
    };

    const { data: inserted, error } = await supabase
      .from("leads")
      .insert(insertPayload)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Leads insert error:", error.message, error.details, error.hint);
      return NextResponse.json(
        {
          error: "Failed to save lead. Please try again.",
          hint: error.message,
        },
        { status: 500 }
      );
    }

    sendLeadNotification({ id: inserted?.id, name, phone, address, leadType, source: validSource, details }).catch((e) =>
      console.error("Email notification failed:", e)
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Leads submit error:", message, err);
    return NextResponse.json(
      { error: "Failed to process submission. Please try again." },
      { status: 500 }
    );
  }
}
