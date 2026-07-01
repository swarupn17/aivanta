"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminToggleEnrolment,
  adminRemoveStudent,
  adminAddStudent,
} from "@/features/schools/admin-actions";
import type { RosterStudent } from "@/features/students/queries";
import { fieldClasses } from "@/components/ui/form";

const SUBJECTS = ["fia", "cia", "aia"] as const;
type Subject = (typeof SUBJECTS)[number];
const LABEL: Record<Subject, string> = { fia: "FIA", cia: "CIA", aia: "AIA" };

export function AdminStudentTable({
  schoolId,
  roster,
}: {
  schoolId: string;
  roster: RosterStudent[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [add, setAdd] = useState({ fullName: "", classLevel: "", section: "", fia: false, cia: false, aia: false });
  const [msg, setMsg] = useState<string | null>(null);

  async function toggle(studentId: string, subject: Subject, enabled: boolean) {
    setBusyId(studentId);
    await adminToggleEnrolment(studentId, subject, enabled, schoolId);
    setBusyId(null);
    router.refresh();
  }

  async function remove(studentId: string) {
    if (!confirm("Remove this student?")) return;
    setBusyId(studentId);
    await adminRemoveStudent(studentId, schoolId);
    setBusyId(null);
    router.refresh();
  }

  async function addStudent() {
    if (!add.fullName.trim() || !/^\d+$/.test(add.classLevel) || !(add.fia || add.cia || add.aia)) {
      setMsg("Name, class (1–10) and at least one subject required.");
      return;
    }
    setMsg(null);
    const res = await adminAddStudent(schoolId, {
      fullName: add.fullName.trim(),
      classLevel: parseInt(add.classLevel, 10),
      section: add.section,
      fia: add.fia,
      cia: add.cia,
      aia: add.aia,
    });
    if (res.ok) {
      setAdd({ fullName: "", classLevel: "", section: "", fia: false, cia: false, aia: false });
      router.refresh();
    } else setMsg(res.error);
  }

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
      <h2 className="font-display text-lg font-bold text-navy">
        Students ({roster.length})
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-dusty-600">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Class</th>
              {SUBJECTS.map((s) => (
                <th key={s} className="p-2 text-center">{LABEL[s]}</th>
              ))}
              <th className="p-2">Paid</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {roster.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-500">
                  No students yet.
                </td>
              </tr>
            ) : (
              roster.map((st) => (
                <tr key={st.id} className="border-t border-slate-100">
                  <td className="p-2 font-medium text-navy">{st.full_name}</td>
                  <td className="p-2">
                    {st.class_level}
                    {st.section ? `-${st.section}` : ""}
                  </td>
                  {SUBJECTS.map((s) => (
                    <td key={s} className="p-2 text-center">
                      <input
                        type="checkbox"
                        disabled={busyId === st.id}
                        checked={st.subjects.includes(s)}
                        onChange={(e) => toggle(st.id, s, e.target.checked)}
                      />
                    </td>
                  ))}
                  <td className="p-2">
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
                  <td className="p-2 text-right">
                    <button
                      type="button"
                      disabled={busyId === st.id}
                      onClick={() => remove(st.id)}
                      className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add student */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="mb-3 text-sm font-semibold text-navy">Add a student</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            placeholder="Full name"
            className={fieldClasses}
            value={add.fullName}
            onChange={(e) => setAdd({ ...add, fullName: e.target.value })}
          />
          <input
            placeholder="Class (1–10)"
            inputMode="numeric"
            className={fieldClasses}
            value={add.classLevel}
            onChange={(e) => setAdd({ ...add, classLevel: e.target.value })}
          />
          <input
            placeholder="Section"
            className={fieldClasses}
            value={add.section}
            onChange={(e) => setAdd({ ...add, section: e.target.value })}
          />
          <div className="flex items-center gap-3 text-sm">
            {SUBJECTS.map((s) => (
              <label key={s} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={add[s]}
                  onChange={() => setAdd({ ...add, [s]: !add[s] })}
                />
                {LABEL[s]}
              </label>
            ))}
          </div>
        </div>
        {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
        <button
          type="button"
          onClick={addStudent}
          className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-navy ring-1 ring-slate-300 hover:bg-mist"
        >
          Add student
        </button>
      </div>
    </div>
  );
}
