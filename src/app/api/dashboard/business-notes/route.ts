import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dashboard_business_notes")
    .select("*")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("dashboard business notes fetch:", error);
    return NextResponse.json({ error: "Failed to load notes." }, { status: 500 });
  }
  return NextResponse.json({ notes: data ?? [] });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
    note?: string;
  };
  const title = String(body.title ?? "").trim();
  const note = String(body.note ?? "").trim();
  if (title.length < 2 || note.length < 3) {
    return NextResponse.json({ error: "Title and note are required." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dashboard_business_notes")
    .insert({
      title,
      note,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("*")
    .single();

  if (error) {
    console.error("dashboard business notes create:", error);
    return NextResponse.json({ error: "Failed to create note." }, { status: 500 });
  }
  return NextResponse.json({ note: data });
}
