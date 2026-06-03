"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadIntegrationSettings, upsertOsLeadsFromSheetRows } from "@/lib/integrations/webhook-handlers";
import { workbookBufferToSheetRowObjects } from "@/lib/leads/parseExcelLeads";
import { getOsSession } from "@/lib/os/get-os-settings";
import type { ActionResult } from "./actions";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_ROWS = 500;

export type SpreadsheetImportStats = {
  created: number;
  updated: number;
  skipped: number;
  warnings: string[];
  errors: string[];
};

export async function importSpreadsheetToOsLeadsAction(
  formData: FormData
): Promise<ActionResult<SpreadsheetImportStats>> {
  const session = await getOsSession();
  if (!session?.userId) return { ok: false, error: "Not signed in." };
  if (!session.isInternal) return { ok: false, error: "Only team members can import leads." };

  const file = formData.get("file");
  if (!file || !(file instanceof File)) return { ok: false, error: "Choose a spreadsheet file." };

  const name = file.name.toLowerCase();
  if (!name.endsWith(".xlsx") && !name.endsWith(".xls") && !name.endsWith(".csv")) {
    return { ok: false, error: "Upload .xlsx, .xls, or .csv." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: "File must be under 8 MB." };
  }

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return { ok: false, error: "Server configuration missing (service role)." };
  }

  const settings = await loadIntegrationSettings(admin);
  if (!settings) return { ok: false, error: "Could not load integration settings." };

  const buffer = await file.arrayBuffer();
  const { rows, skippedEmpty, parseWarnings } = workbookBufferToSheetRowObjects(buffer);

  if (parseWarnings.length > 0 && rows.length === 0) {
    return { ok: false, error: parseWarnings[0] ?? "Could not parse spreadsheet." };
  }
  if (rows.length === 0) {
    return {
      ok: true,
      data: {
        created: 0,
        updated: 0,
        skipped: skippedEmpty,
        warnings: parseWarnings,
        errors: [],
      },
    };
  }

  const slice = rows.slice(0, MAX_ROWS);
  const stats = await upsertOsLeadsFromSheetRows(admin, settings, slice);
  const warnings = [...parseWarnings];
  if (rows.length > MAX_ROWS) {
    warnings.push(`Only the first ${MAX_ROWS} rows were imported.`);
  }

  revalidatePath("/dashboard/leads");
  return {
    ok: true,
    data: {
      created: stats.created,
      updated: stats.updated,
      skipped: stats.skipped + skippedEmpty,
      warnings,
      errors: stats.errors.slice(0, 10),
    },
  };
}
