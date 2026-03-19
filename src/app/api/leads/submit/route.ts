import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

    const body = await request.json();

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

    const details: Record<string, unknown> = { ...body };
    delete details.name;
    delete details.phone;
    delete details.address;
    delete details.leadType;
    delete details.source;

    const supabase = createAdminClient();
    const { error } = await supabase.from("leads").insert({
      source: validSource,
      lead_type: leadType,
      name,
      phone,
      address,
      email: body.email?.trim() || null,
      details,
    });

    if (error) {
      console.error("Leads insert error:", error);
      return NextResponse.json({ error: "Failed to save lead." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Leads submit error:", err);
    return NextResponse.json({ error: "Failed to process submission." }, { status: 500 });
  }
}
