import "server-only";
import ExcelJS from "exceljs";
import {
  parseRecords,
  TEMPLATE_HEADERS,
  type ParsedStudent,
  type RawStudentRecord,
} from "./parse";

/**
 * Excel (.xlsx) template, export, and import via exceljs. Server-only (exceljs
 * is a heavy Node lib — must never reach the client bundle). All parsing funnels
 * through parseRecords() so CSV and Excel share one set of validation rules.
 */

const NAVY = "FF0D3B66";
const MIST = "FFEEF4F8";

function styleHeader(ws: ExcelJS.Worksheet) {
  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  header.alignment = { vertical: "middle", horizontal: "center" };
  header.height = 24;
  ws.views = [{ state: "frozen", ySplit: 1 }];
}

/** The fill-in template: styled header, examples, and dropdown validation. */
export async function buildTemplateWorkbook(): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Aivanta Scholar Foundation";

  const ws = wb.addWorksheet("Students");
  ws.columns = [
    { header: "Name", key: "name", width: 26 },
    { header: "Class", key: "cls", width: 8 },
    { header: "Section", key: "section", width: 10 },
    { header: "DOB", key: "dob", width: 14 },
    { header: "Parent", key: "parent", width: 22 },
    { header: "Contact", key: "contact", width: 16 },
    { header: "FIA", key: "fia", width: 7 },
    { header: "CIA", key: "cia", width: 7 },
    { header: "AIA", key: "aia", width: 7 },
  ];
  styleHeader(ws);

  ws.addRow({ name: "Asha Verma", cls: 5, section: "A", dob: "2015-04-12", parent: "R. Verma", contact: "9999900000", fia: "Yes", cia: "Yes", aia: "No" });
  ws.addRow({ name: "Rahul Singh", cls: 8, section: "B", dob: "2012-09-03", parent: "M. Singh", contact: "9888800000", fia: "No", cia: "Yes", aia: "Yes" });

  // Grey the two example rows so it's obvious they're samples.
  for (const r of [2, 3]) {
    ws.getRow(r).font = { italic: true, color: { argb: "FF94A3B8" } };
  }

  // Data validation on rows 2..600: Class 1-10, and Yes/No dropdowns.
  for (let r = 2; r <= 600; r++) {
    ws.getCell(`B${r}`).dataValidation = {
      type: "whole",
      operator: "between",
      allowBlank: true,
      formulae: [1, 10],
      showErrorMessage: true,
      errorTitle: "Class 1-10",
      error: "Enter a class between 1 and 10.",
    };
    for (const c of ["G", "H", "I"]) {
      ws.getCell(`${c}${r}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: ['"Yes,No"'],
        showErrorMessage: true,
        errorTitle: "Yes or No",
        error: "Choose Yes or No.",
      };
    }
  }

  // A friendly instructions sheet.
  const help = wb.addWorksheet("How to use");
  help.columns = [{ width: 90 }];
  const lines = [
    "How to register your students",
    "",
    "1. Fill one row per student on the 'Students' sheet.",
    "2. Name and Class (1-10) are required. Pick at least one subject (FIA/CIA/AIA = Yes).",
    "3. Section, DOB, Parent and Contact are optional but recommended.",
    "4. Delete the two grey example rows before you upload.",
    "5. Save the file, then upload it back on the portal (Excel or CSV both work).",
    "6. You'll see a preview to review and confirm before anything is saved.",
    "",
    "Fee: charged per subject enrolment. You'll see the total on the review screen.",
  ];
  lines.forEach((t, i) => {
    const cell = help.getCell(`A${i + 1}`);
    cell.value = t;
    if (i === 0) cell.font = { bold: true, size: 14, color: { argb: NAVY } };
  });

  return Buffer.from(await wb.xlsx.writeBuffer());
}

export type RosterExportRow = {
  full_name: string;
  class_level: number;
  section: string | null;
  subjects: string[];
  paid: boolean;
};

/** Export the current roster as a styled .xlsx. */
export async function buildRosterWorkbook(
  schoolName: string,
  rows: RosterExportRow[]
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Aivanta Scholar Foundation";

  const ws = wb.addWorksheet("Roster");
  ws.mergeCells("A1:E1");
  const title = ws.getCell("A1");
  title.value = `${schoolName} — Students (${rows.length})`;
  title.font = { bold: true, size: 14, color: { argb: NAVY } };
  ws.getRow(1).height = 26;

  const headerRowIdx = 2;
  ws.getRow(headerRowIdx).values = ["Name", "Class", "Section", "Subjects", "Payment"];
  ws.columns = [
    { key: "name", width: 28 },
    { key: "cls", width: 8 },
    { key: "section", width: 10 },
    { key: "subjects", width: 20 },
    { key: "paid", width: 12 },
  ];
  const hr = ws.getRow(headerRowIdx);
  hr.font = { bold: true, color: { argb: "FFFFFFFF" } };
  hr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  hr.alignment = { horizontal: "center" };

  rows.forEach((r, i) => {
    const row = ws.addRow([
      r.full_name,
      r.class_level,
      r.section ?? "",
      r.subjects.map((s) => s.toUpperCase()).join(", "),
      r.paid ? "Paid" : "Unpaid",
    ]);
    if (i % 2 === 1) {
      row.eachCell((c) => {
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: MIST } };
      });
    }
  });
  ws.views = [{ state: "frozen", ySplit: headerRowIdx }];

  return Buffer.from(await wb.xlsx.writeBuffer());
}

/** Convert any exceljs cell value to a trimmed string. */
function cellToString(v: ExcelJS.CellValue): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "object") {
    if ("text" in v && typeof v.text === "string") return v.text.trim();
    if ("result" in v) return cellToString((v.result as ExcelJS.CellValue) ?? "");
    if ("richText" in v && Array.isArray(v.richText)) {
      return v.richText.map((rt) => rt.text).join("").trim();
    }
  }
  return String(v).trim();
}

/** Parse an uploaded .xlsx buffer into validated rows (same rules as CSV). */
export async function parseXlsx(buffer: Buffer): Promise<ParsedStudent[]> {
  const wb = new ExcelJS.Workbook();
  // @types/node v22 makes Buffer generic; exceljs's load() wants the legacy
  // Buffer type. Cast to exactly its expected arg (no `any`).
  await wb.xlsx.load(buffer as unknown as Parameters<typeof wb.xlsx.load>[0]);
  const ws =
    wb.worksheets.find((w) => w.name.toLowerCase().includes("student")) ??
    wb.worksheets[0];
  if (!ws) return [];

  // Map header labels -> column numbers (case-insensitive).
  const colIndex: Record<string, number> = {};
  ws.getRow(1).eachCell((cell, colNumber) => {
    const key = cellToString(cell.value).toLowerCase();
    if (key) colIndex[key] = colNumber;
  });
  const known = TEMPLATE_HEADERS.map((h) => h.toLowerCase());
  if (!known.some((h) => h in colIndex)) return []; // not our template

  const at = (row: ExcelJS.Row, label: string): string => {
    const c = colIndex[label.toLowerCase()];
    return c ? cellToString(row.getCell(c).value) : "";
  };

  const records: RawStudentRecord[] = [];
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const rec: RawStudentRecord = {
      name: at(row, "Name"),
      cls: at(row, "Class"),
      section: at(row, "Section"),
      dob: at(row, "DOB"),
      parent: at(row, "Parent"),
      contact: at(row, "Contact"),
      fia: at(row, "FIA"),
      cia: at(row, "CIA"),
      aia: at(row, "AIA"),
    };
    if (Object.values(rec).every((v) => v === "")) return; // skip blank rows
    records.push(rec);
  });

  return parseRecords(records);
}
