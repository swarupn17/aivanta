/**
 * Student roster parsing + validation.
 *
 * CSV-first (zero-dependency, works everywhere). Excel users export as CSV.
 * Adding native .xlsx later means only adding one branch that produces the same
 * `RawRow[]` shape — everything downstream is format-agnostic.
 */

export type SubjectFlags = { fia: boolean; cia: boolean; aia: boolean };

export type ParsedStudent = SubjectFlags & {
  rowNum: number;
  fullName: string;
  classLevel: number | null;
  section: string;
  dob: string;
  parentName: string;
  parentContact: string;
  errors: string[];
  warnings: string[];
};

export const TEMPLATE_HEADERS = [
  "Name",
  "Class",
  "Section",
  "DOB",
  "Parent",
  "Contact",
  "FIA",
  "CIA",
  "AIA",
] as const;

const truthy = (v: string) =>
  ["yes", "y", "true", "1", "x"].includes(v.trim().toLowerCase());

/** Minimal, robust CSV line splitter (handles quoted fields + commas within). */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/** Parse CSV text into validated rows. Never touches the DB. */
export function parseCsv(text: string): ParsedStudent[] {
  const lines = text
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const header = splitCsvLine(lines[0]!).map((h) => h.toLowerCase());
  const col = (name: string) => header.indexOf(name.toLowerCase());
  const idx = {
    name: col("Name"),
    cls: col("Class"),
    section: col("Section"),
    dob: col("DOB"),
    parent: col("Parent"),
    contact: col("Contact"),
    fia: col("FIA"),
    cia: col("CIA"),
    aia: col("AIA"),
  };

  const seen = new Set<string>();
  const rows: ParsedStudent[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]!);
    const get = (n: number) => (n >= 0 && n < cells.length ? cells[n]!.trim() : "");

    const fullName = get(idx.name);
    const clsRaw = get(idx.cls);
    const classLevel = /^\d+$/.test(clsRaw) ? parseInt(clsRaw, 10) : null;
    const fia = idx.fia >= 0 && truthy(get(idx.fia));
    const cia = idx.cia >= 0 && truthy(get(idx.cia));
    const aia = idx.aia >= 0 && truthy(get(idx.aia));

    const errors: string[] = [];
    const warnings: string[] = [];
    if (!fullName) errors.push("Name is required");
    if (classLevel === null || classLevel < 1 || classLevel > 10)
      errors.push("Class must be 1–10");
    if (!fia && !cia && !aia) errors.push("Pick at least one subject");

    const key = `${fullName.toLowerCase()}|${clsRaw}`;
    if (fullName && seen.has(key)) warnings.push("Possible duplicate in file");
    if (fullName) seen.add(key);

    rows.push({
      rowNum: i + 1,
      fullName,
      classLevel,
      section: get(idx.section),
      dob: get(idx.dob),
      parentName: get(idx.parent),
      parentContact: get(idx.contact),
      fia,
      cia,
      aia,
      errors,
      warnings,
    });
  }
  return rows;
}

/** Build the CSV template string (header + one example row). */
export function templateCsv(): string {
  const example = ["Asha Verma", "5", "A", "2015-04-12", "R. Verma", "9999900000", "Yes", "Yes", "No"];
  return `${TEMPLATE_HEADERS.join(",")}\n${example.join(",")}\n`;
}
