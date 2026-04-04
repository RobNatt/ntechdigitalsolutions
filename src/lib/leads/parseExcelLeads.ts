import * as XLSX from "xlsx";

export const LEAD_STAGES = [
  "submitted",
  "contacted",
  "appointment_set",
  "qualified",
  "closed_won",
  "closed_lost",
] as const;

const STAGE_SET = new Set<string>(LEAD_STAGES);

function normalizeHeader(h: string): string {
  return String(h ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function rowToNormalizedMap(row: Record<string, unknown>): Record<string, string> {
  const m: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    const key = normalizeHeader(k);
    if (!key) continue;
    const s = v === null || v === undefined ? "" : String(v).trim();
    m[key] = s;
  }
  return m;
}

function pick(m: Record<string, string>, aliases: string[]): string | null {
  for (const a of aliases) {
    const v = m[normalizeHeader(a)];
    if (v) return v;
  }
  return null;
}

export type ParsedLeadRow = {
  source: string;
  lead_type: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  email: string | null;
  stage: string;
  details: Record<string, unknown>;
};

function normalizeStage(raw: string | null): string {
  if (!raw) return "submitted";
  const s = raw.trim().toLowerCase().replace(/\s+/g, "_");
  if (STAGE_SET.has(s)) return s;
  return "submitted";
}

/**
 * Maps common spreadsheet headers to lead fields. Extra columns are stored in `details`.
 */
export function workbookBufferToLeadRows(buffer: ArrayBuffer): {
  rows: ParsedLeadRow[];
  skippedEmpty: number;
  parseWarnings: string[];
} {
  const parseWarnings: string[] = [];
  const wb = XLSX.read(buffer, { type: "array" });
  const firstName = wb.SheetNames[0];
  if (!firstName) {
    parseWarnings.push("No worksheets found in the file.");
    return { rows: [], skippedEmpty: 0, parseWarnings };
  }
  const sheet = wb.Sheets[firstName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  const reservedAliases = new Set([
    "name",
    "full_name",
    "contact_name",
    "lead_name",
    "customer_name",
    "email",
    "e_mail",
    "phone",
    "mobile",
    "phone_number",
    "cell",
    "address",
    "street",
    "company",
    "business",
    "company_name",
    "stage",
    "status",
    "lead_type",
    "type",
    "source",
    "notes",
    "message",
    "comments",
  ]);

  let skippedEmpty = 0;
  const rows: ParsedLeadRow[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const m = rowToNormalizedMap(rawRows[i]);
    const name =
      pick(m, [
        "name",
        "full_name",
        "fullname",
        "contact_name",
        "lead_name",
        "customer_name",
      ]) || null;
    const email = pick(m, ["email", "e_mail", "e-mail"]) || null;
    const phone = pick(m, ["phone", "mobile", "phone_number", "cell", "telephone"]) || null;
    const address = pick(m, ["address", "street", "location"]) || null;
    const company =
      pick(m, ["company", "business", "company_name", "organization"]) || null;
    const stageRaw = pick(m, ["stage", "status", "pipeline_stage"]);
    const leadType = pick(m, ["lead_type", "type", "leadtype"]) || "homeowner";
    const source = pick(m, ["source", "channel", "utm_source"]) || "excel_import";
    const notes = pick(m, ["notes", "message", "comments", "description"]) || null;

    const hasCore = Boolean(name || email || phone);
    if (!hasCore) {
      const allEmpty = Object.values(m).every((v) => !v);
      if (allEmpty) {
        skippedEmpty++;
        continue;
      }
      skippedEmpty++;
      continue;
    }

    const details: Record<string, unknown> = {};
    if (company) details.company_name = company;
    if (notes) details.notes = notes;

    for (const [k, v] of Object.entries(m)) {
      if (!v) continue;
      const isReserved = [...reservedAliases].some((a) => normalizeHeader(a) === k);
      if (isReserved) continue;
      details[k] = v;
    }

    rows.push({
      source: source || "excel_import",
      lead_type: leadType,
      name,
      phone,
      address,
      email,
      stage: normalizeStage(stageRaw),
      details,
    });
  }

  return { rows, skippedEmpty, parseWarnings };
}
