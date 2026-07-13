"use client";

import { useMemo, useState } from "react";
import type { RosterStudent } from "@/features/students/queries";
import { RemoveStudentButton } from "./RemoveStudentButton";
import { fieldClasses } from "@/components/ui/form";
import { IconDownload } from "@/components/ui/icons";

const SUBJECT_LABEL: Record<string, string> = { fia: "FIA", cia: "CIA", aia: "AIA" };

/**
 * Roster view for a school: search by name, filter by class + subject, and
 * export the (full) roster to Excel. Filtering is in-memory (the whole roster is
 * already loaded), so it's instant.
 */
export function RosterTable({ roster }: { roster: RosterStudent[] }) {
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("");
  const [subject, setSubject] = useState("");

  const classes = useMemo(
    () => [...new Set(roster.map((r) => r.class_level))].sort((a, b) => a - b),
    [roster]
  );

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    return roster.filter((r) => {
      if (query && !r.full_name.toLowerCase().includes(query)) return false;
      if (cls && String(r.class_level) !== cls) return false;
      if (subject && !r.subjects.includes(subject)) return false;
      return true;
    });
  }, [roster, q, cls, subject]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-dusty-600">
          Enrolled students ({roster.length})
        </h2>
        {roster.length > 0 && (
          <a
            href="/portal/students/export"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-navy ring-1 ring-slate-300 transition-colors hover:bg-mist"
          >
            <IconDownload className="h-4 w-4" />
            Export Excel
          </a>
        )}
      </div>

      {roster.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
          No students yet. Import a file or add them manually above.
        </p>
      ) : (
        <>
          <div className="mb-3 grid gap-3 sm:grid-cols-3">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name…"
              className={fieldClasses}
              aria-label="Search students"
            />
            <select
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              className={fieldClasses}
              aria-label="Filter by class"
            >
              <option value="">All classes</option>
              {classes.map((c) => (
                <option key={c} value={String(c)}>
                  Class {c}
                </option>
              ))}
            </select>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={fieldClasses}
              aria-label="Filter by subject"
            >
              <option value="">All subjects</option>
              {(["fia", "cia", "aia"] as const).map((s) => (
                <option key={s} value={s}>
                  {SUBJECT_LABEL[s]}
                </option>
              ))}
            </select>
          </div>

          <p className="mb-2 text-sm text-slate-500">{visible.length} shown</p>

          <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-mist text-left text-xs uppercase tracking-wider text-dusty-600">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Subjects</th>
                  <th className="p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No students match your filters.
                    </td>
                  </tr>
                ) : (
                  visible.map((st) => (
                    <tr key={st.id} className="border-t border-slate-100 bg-white">
                      <td className="p-3 font-medium text-navy">{st.full_name}</td>
                      <td className="p-3">
                        {st.class_level}
                        {st.section ? `-${st.section}` : ""}
                      </td>
                      <td className="p-3">
                        {st.subjects.map((x) => SUBJECT_LABEL[x] ?? x).join(", ") || "—"}
                      </td>
                      <td className="p-3">
                        <span
                          className={
                            st.paid
                              ? "rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700"
                              : "rounded bg-mist px-2 py-0.5 text-xs font-semibold text-navy"
                          }
                        >
                          {st.paid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <RemoveStudentButton id={st.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
