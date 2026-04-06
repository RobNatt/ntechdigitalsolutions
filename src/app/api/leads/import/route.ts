import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { workbookBufferToLeadRows } from "@/lib/leads/parseExcelLeads";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_ROWS = 500;

/**
 * POST /api/leads/import — multipart file field `file` (.xlsx / .xls)
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

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json(
        {
          error: "Could not read upload.",
          hint: "Send a POST with multipart body and a field named file (.xlsx or .xls).",
        },
        { status: 400 }
      );
    }
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      return NextResponse.json(
        { error: "Upload an Excel file (.xlsx or .xls)." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_FILE_BYTES / (1024 * 1024)} MB).` },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const { rows, skippedEmpty, parseWarnings } = workbookBufferToLeadRows(buffer);

    if (parseWarnings.length > 0 && rows.length === 0) {
      return NextResponse.json({ error: parseWarnings[0], imported: 0 }, { status: 400 });
    }

    if (rows.length > MAX_ROWS) {
      return NextResponse.json(
        {
          error: `Too many data rows (${rows.length}). Maximum per import is ${MAX_ROWS}.`,
        },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json({
        imported: 0,
        skippedEmpty,
        message: "No rows with name, email, or phone were found.",
      });
    }

    const companyId = process.env.DEFAULT_COMPANY_ID;
    const nowIso = new Date().toISOString();

    const payloads = rows.map((r) => {
      const displayName = r.name || r.email || r.phone || "Unknown";
      return {
        ...(companyId ? { company_id: companyId } : {}),
        source: r.source,
        lead_type: r.lead_type,
        name: r.name,
        full_name: displayName,
        phone: r.phone,
        phone_number: r.phone,
        address: r.address,
        email: r.email,
        stage: r.stage,
        stage_updated_at: nowIso,
        updated_at: nowIso,
        lead_temperature: "warm",
        details: r.details,
      };
    });

    let admin;
    try {
      admin = createAdminClient();
    } catch (e) {
      console.error("Supabase admin client:", e);
      return NextResponse.json(
        { error: "Server configuration error (service role)." },
        { status: 500 }
      );
    }

    const { error: insertError } = await admin.from("leads").insert(payloads);

    if (insertError) {
      console.error("Leads import insert error:", insertError);
      return NextResponse.json(
        {
          error: "Failed to save imported leads.",
          hint: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imported: rows.length,
      skippedEmpty,
      warnings: parseWarnings,
    });
  } catch (err) {
    console.error("Leads import error:", err);
    return NextResponse.json({ error: "Import failed." }, { status: 500 });
  }
}
