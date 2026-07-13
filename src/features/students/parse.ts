/**
 * Student roster parsing + validation.
 *
 * Format-agnostic core: both CSV (client-safe, zero-dep) and .xlsx (server, via
 * exceljs in ./excel.ts) normalise their input into `RawStudentRecord[]` and run
 * it through `parseRecords`, so the validation rules live in exactly one place.
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

/** One raw row, already mapped from columns to fields (all strings). */
export type RawStudentRecord = {
  name: string;
  cls: string;
  section: string;
  dob: string;
  parent: string;
  contact: string;
  fia: string;
  cia: string;
  aia: string;
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

/**
 * Validate normalised records into rows. `rowNum` is 1-based on the DATA (so the
 * first data row is 2, matching a spreadsheet where row 1 is the header).
 */
export function parseRecords(records: RawStudentRecord[]): ParsedStudent[] {
  const seen = new Set<string>();
  return records.map((rec, i) => {
    const fullName = rec.name.trim();
    const clsRaw = rec.cls.trim();
    const classLevel = /^\d+$/.test(clsRaw) ? parseInt(clsRaw, 10) : null;
    const fia = truthy(rec.fia);
    const cia = truthy(rec.cia);
    const aia = truthy(rec.aia);

    const errors: string[] = [];
    const warnings: string[] = [];
    if (!fullName) errors.push("Name is required");
    if (classLevel === null || classLevel < 1 || classLevel > 10)
      errors.push("Class must be 1–10");
    if (!fia && !cia && !aia) errors.push("Pick at least one subject");

    const key = `${fullName.toLowerCase()}|${clsRaw}`;
    if (fullName && seen.has(key)) warnings.push("Possible duplicate in file");
    if (fullName) seen.add(key);

    return {
      rowNum: i + 2,
      fullName,
      classLevel,
      section: rec.section.trim(),
      dob: rec.dob.trim(),
      parentName: rec.parent.trim(),
      parentContact: rec.contact.trim(),
      fia,
      cia,
      aia,
      errors,
      warnings,
    };
  });
}

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

/** Parse CSV text into validated rows. Never touches the DB. Client-safe. */
export function parseCsv(text: string): ParsedStudent[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
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

  const records: RawStudentRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]!);
    const get = (n: number) => (n >= 0 && n < cells.length ? cells[n]!.trim() : "");
    records.push({
      name: get(idx.name),
      cls: get(idx.cls),
      section: get(idx.section),
      dob: get(idx.dob),
      parent: get(idx.parent),
      contact: get(idx.contact),
      fia: get(idx.fia),
      cia: get(idx.cia),
      aia: get(idx.aia),
    });
  }
  return parseRecords(records);
}

