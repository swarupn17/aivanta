"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  parseStudentsUpload,
  commitEnrolments,
  type CommitRow,
} from "@/features/students/actions";
import { type ParsedStudent } from "@/features/students/parse";
import { fieldClasses, FormAlert } from "@/components/ui/form";
import { IconDownload } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Row = ParsedStudent;

const blankManual = (): Row => ({
  rowNum: -Date.now(),
  fullName: "",
  classLevel: null,
  section: "",
  dob: "",
  parentName: "",
  parentContact: "",
  fia: false,
  cia: false,
  aia: false,
  errors: [],
  warnings: [],
});

function rowErrors(r: Row): string[] {
  const e: string[] = [];
  if (!r.fullName.trim()) e.push("Name");
  if (r.classLevel === null || r.classLevel < 1 || r.classLevel > 10) e.push("Class 1–10");
  if (!r.fia && !r.cia && !r.aia) e.push("Pick a subject");
  return e;
}

export function StudentUploader() {
  const router = useRouter();
  const fee = siteConfig.fees.perSubject;
  const [rows, setRows] = useState<Row[]>([]);
  const [manual, setManual] = useState<Row>(blankManual());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [dragging, setDragging] = useState(false);

  const validRows = useMemo(() => rows.filter((r) => rowErrors(r).length === 0), [rows]);
  const enrolments = useMemo(
    () => validRows.reduce((n, r) => n + [r.fia, r.cia, r.aia].filter(Boolean).length, 0),
    [validRows]
  );
  const total = enrolments * fee;

  async function handleFile(file: File) {
    setMsg(null);
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await parseStudentsUpload(fd);
    setBusy(false);
    if (res.ok) {
      setRows(res.rows);
      setMsg({
        ok: true,
        text: `Loaded ${res.rows.length} rows. Review, edit, then confirm.`,
      });
    } else {
      setMsg({ ok: false, text: res.error });
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  function removeRow(rowNum: number) {
    setRows((rs) => rs.filter((r) => r.rowNum !== rowNum));
  }

  function addManual() {
    if (rowErrors(manual).length > 0) {
      setMsg({ ok: false, text: "Fill name, class (1–10) and at least one subject." });
      return;
    }
    setRows((rs) => [...rs, manual]);
    setManual(blankManual());
    setMsg(null);
  }

  function toggleSubject(rowNum: number, key: "fia" | "cia" | "aia") {
    setRows((rs) => rs.map((r) => (r.rowNum === rowNum ? { ...r, [key]: !r[key] } : r)));
  }

  async function confirm() {
    if (validRows.length === 0) {
      setMsg({ ok: false, text: "No valid rows to import." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const payload: CommitRow[] = validRows.map((r) => ({
      fullName: r.fullName.trim(),
      classLevel: r.classLevel as number,
      section: r.section,
      dob: r.dob,
      parentName: r.parentName,
      parentContact: r.parentContact,
      fia: r.fia,
      cia: r.cia,
      aia: r.aia,
    }));
    const res = await commitEnrolments(payload);
    setBusy(false);
    if (res.ok) {
      setRows([]);
      setMsg({ ok: true, text: `Imported ${res.students} students, ${res.enrolments} enrolments.` });
      router.refresh();
    } else {
      setMsg({ ok: false, text: res.error });
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
      <div>
        <h2 className="font-display text-lg font-bold text-navy">Import students</h2>
        <p className="text-sm text-slate-600">
          Two easy steps: download the Excel template, fill it in, then upload it
          back. We&apos;ll show a preview before anything is saved.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Step 1: download */}
        <a
          href="/portal/students/template"
          className="lift flex items-center gap-3 rounded-xl bg-mist p-4 ring-1 ring-slate-200"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-navy ring-1 ring-slate-200">
            <IconDownload className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-navy">
              1. Download template
            </span>
            <span className="block text-xs text-slate-500">
              Excel .xlsx with dropdowns
            </span>
          </span>
        </a>

        {/* Step 2: upload (drag & drop) */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4 transition-colors",
            dragging
              ? "border-navy bg-mist"
              : "border-slate-300 hover:border-navy hover:bg-mist"
          )}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy text-white">
            <UploadIcon />
          </span>
          <span>
            <span className="block text-sm font-bold text-navy">
              2. {busy ? "Reading file\u2026" : "Upload filled file"}
            </span>
            <span className="block text-xs text-slate-500">
              Drag &amp; drop or click · .xlsx or .csv
            </span>
          </span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={onFile}
          />
        </label>
      </div>

      {msg && (
        <div className="mt-4">
          <FormAlert tone={msg.ok ? "success" : "error"}>{msg.text}</FormAlert>
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-dusty-600">
                  <th className="p-2">Name</th>
                  <th className="p-2">Class</th>
                  <th className="p-2">Section</th>
                  <th className="p-2 text-center">FIA</th>
                  <th className="p-2 text-center">CIA</th>
                  <th className="p-2 text-center">AIA</th>
                  <th className="p-2">Status</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const errs = rowErrors(r);
                  return (
                    <tr key={r.rowNum} className="border-t border-slate-100">
                      <td className="p-2 font-medium text-navy">{r.fullName || "—"}</td>
                      <td className="p-2">{r.classLevel ?? "—"}</td>
                      <td className="p-2">{r.section || "—"}</td>
                      {(["fia", "cia", "aia"] as const).map((k) => (
                        <td key={k} className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={r[k]}
                            onChange={() => toggleSubject(r.rowNum, k)}
                          />
                        </td>
                      ))}
                      <td className="p-2">
                        {errs.length === 0 ? (
                          <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                            OK
                          </span>
                        ) : (
                          <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                            {errs.join(", ")}
                          </span>
                        )}
                        {r.warnings.length > 0 && (
                          <span className="ml-1 text-xs text-amber-600">{r.warnings[0]}</span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeRow(r.rowNum)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-mist px-5 py-4">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-navy">{validRows.length}</span> valid ·{" "}
              <span className="font-semibold text-navy">{enrolments}</span> enrolments ×
              ₹{fee} ={" "}
              <span className="font-display text-lg font-extrabold text-navy">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </p>
            <button
              type="button"
              onClick={confirm}
              disabled={busy || validRows.length === 0}
              className={cn(
                "rounded-lg bg-orange px-6 py-2.5 font-bold text-navy transition-colors hover:bg-orange-600",
                (busy || validRows.length === 0) && "opacity-60"
              )}
            >
              {busy ? "Importing…" : "Confirm import"}
            </button>
          </div>
        </>
      )}

      {/* Manual add */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="mb-3 text-sm font-semibold text-navy">Add a student manually</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            placeholder="Full name"
            className={fieldClasses}
            value={manual.fullName}
            onChange={(e) => setManual({ ...manual, fullName: e.target.value })}
          />
          <input
            placeholder="Class (1–10)"
            inputMode="numeric"
            className={fieldClasses}
            value={manual.classLevel ?? ""}
            onChange={(e) =>
              setManual({
                ...manual,
                classLevel: /^\d+$/.test(e.target.value) ? parseInt(e.target.value, 10) : null,
              })
            }
          />
          <input
            placeholder="Section"
            className={fieldClasses}
            value={manual.section}
            onChange={(e) => setManual({ ...manual, section: e.target.value })}
          />
          <div className="flex items-center gap-4 text-sm">
            {(["fia", "cia", "aia"] as const).map((k) => (
              <label key={k} className="flex items-center gap-1 capitalize">
                <input
                  type="checkbox"
                  checked={manual[k]}
                  onChange={() => setManual({ ...manual, [k]: !manual[k] })}
                />
                {k}
              </label>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={addManual}
          className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-navy ring-1 ring-slate-300 hover:bg-mist"
        >
          Add to list
        </button>
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4"
      />
    </svg>
  );
}
