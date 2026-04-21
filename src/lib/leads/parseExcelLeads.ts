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

/** Cells that usually appear in row 1 of a lead export header */
const HEADER_HINTS = new Set([
  "name",
  "full_name",
  "fullname",
  "firstname",
  "lastname",
  "first_name",
  "last_name",
  "email",
  "e_mail",
  "phone",
  "mobile",
  "phone_number",
  "cell",
  "telephone",
  "address",
  "street",
  "stage",
  "status",
  "source",
  "lead_type",
  "type",
  "notes",
  "company",
  "company_name",
]);

function headerRowScore(row: unknown[]): number {
  let s = 0;
  for (const c of row) {
    const n = normalizeHeader(String(c ?? ""));
    if (n && HEADER_HINTS.has(n)) s += 1;
  }
  return s;
}

function rowsFromAoA(aoa: unknown[][], headerRowIdx: number): Record<string, unknown>[] {
  const headerCells = (aoa[headerRowIdx] ?? []).map((c) => String(c ?? "").trim());
  const keys = headerCells.map((h, i) => (h ? h : `__EMPTY_${i}`));
  const out: Record<string, unknown>[] = [];
  for (let r = headerRowIdx + 1; r < aoa.length; r++) {
    const row = aoa[r] ?? [];
    const obj: Record<string, unknown> = {};
    for (let c = 0; c < keys.length; c++) {
      obj[keys[c]] = row[c] ?? "";
    }
    out.push(obj);
  }
  return out;
}

export type ParsedLeadRow = {
  source: string;
  lead_type: string;
  name: string | null;
  phone: string | null;
  address: string;
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
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
  }) as unknown[][];

  if (!aoa.length) {
    parseWarnings.push("The first sheet has no rows.");
    return { rows: [], skippedEmpty: 0, parseWarnings };
  }

  let headerIdx = 0;
  let bestScore = headerRowScore(aoa[0] ?? []);
  const scanLimit = Math.min(25, aoa.length);
  for (let i = 1; i < scanLimit; i++) {
    const sc = headerRowScore(aoa[i] ?? []);
    if (sc > bestScore) {
      bestScore = sc;
      headerIdx = i;
    }
  }

  if (bestScore === 0) {
    parseWarnings.push(
      "No recognizable header row (expected columns like Name, Email, or Phone in the first rows)."
    );
  }

  const rawRows = rowsFromAoA(aoa, headerIdx);

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
    let name =
      pick(m, [
        "name",
        "full_name",
        "fullname",
        "contact_name",
        "lead_name",
        "customer_name",
      ]) || null;
    if (!name) {
      const fn = pick(m, ["first_name", "firstname", "first", "given_name"]);
      const ln = pick(m, ["last_name", "lastname", "last", "surname", "family_name"]);
      const combined = [fn, ln].filter(Boolean).join(" ").trim();
      if (combined) name = combined;
    }
    const email = pick(m, ["email", "e_mail", "e-mail"]) || null;
    const phone = pick(m, ["phone", "mobile", "phone_number", "cell", "telephone"]) || null;
    const address = pick(m, ["address", "street", "location"]) || "N/A";
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
