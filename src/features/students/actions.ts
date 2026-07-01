"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/queries";
import { getMySchool } from "@/features/schools/queries";
import { parseCsv, type ParsedStudent } from "./parse";

const ACADEMIC_YEAR = "2025-26";

/** Parse uploaded CSV text into a validated preview. Saves nothing. */
export async function parseStudentsCsv(
  text: string
): Promise<{ ok: true; rows: ParsedStudent[] } | { ok: false; error: string }> {
  if (typeof text !== "string" || !text.trim()) {
    return { ok: false, error: "The file looks empty." };
  }
  const rows = parseCsv(text);
  if (rows.length === 0) {
    return { ok: false, error: "No rows found. Use the template and include a header row." };
  }
  return { ok: true, rows };
}

const commitSchema = z.object({
  fullName: z.string().min(1),
  classLevel: z.number().int().min(1).max(10),
  section: z.string().optional().default(""),
  dob: z.string().optional().default(""),
  parentName: z.string().optional().default(""),
  parentContact: z.string().optional().default(""),
  fia: z.boolean(),
  cia: z.boolean(),
  aia: z.boolean(),
});

export type CommitRow = z.infer<typeof commitSchema>;

export type CommitResult =
  | { ok: true; students: number; enrolments: number }
  | { ok: false; error: string };

/**
 * Commit reviewed rows: insert students + their per-subject enrolments (draft,
 * unpaid). Uses the SESSION client so RLS enforces that the caller owns the school.
 */
export async function commitEnrolments(rows: CommitRow[]): Promise<CommitResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in." };

  const school = await getMySchool(user.id);
  if (!school) return { ok: false, error: "Claim your school with a code first." };

  const valid: CommitRow[] = [];
  for (const r of rows) {
    const p = commitSchema.safeParse(r);
    if (p.success && (p.data.fia || p.data.cia || p.data.aia)) valid.push(p.data);
  }
  if (valid.length === 0) return { ok: false, error: "No valid rows to import." };

  const supabase = await createClient();

  // Map subject -> exam id for the active cycle.
  const { data: exams } = await supabase
    .from("exams")
    .select("id, subject")
    .eq("academic_year", ACADEMIC_YEAR)
    .eq("is_active", true);
  const examBySubject = new Map<string, string>(
    (exams ?? []).map((e: { id: string; subject: string }) => [e.subject, e.id])
  );
  if (examBySubject.size === 0) {
    return { ok: false, error: "No active exams found. Ask an admin to seed the exam catalog." };
  }

  // Insert students, get ids back (same order).
  const { data: inserted, error: insErr } = await supabase
    .from("students")
    .insert(
      valid.map((r) => ({
        school_id: (school as { id: string }).id,
        full_name: r.fullName,
        class_level: r.classLevel,
        section: r.section || null,
        dob: r.dob || null,
        parent_name: r.parentName || null,
        parent_contact: r.parentContact || null,
      }))
    )
    .select("id");
  if (insErr || !inserted) {
    return { ok: false, error: insErr?.message ?? "Could not save students." };
  }

  // Build enrolments for each student's chosen subjects.
  const enrolments: { student_id: string; exam_id: string; payment_status: string }[] = [];
  inserted.forEach((s: { id: string }, i) => {
    const r = valid[i]!;
    const subs = [r.fia && "fia", r.cia && "cia", r.aia && "aia"].filter(Boolean) as string[];
    for (const sub of subs) {
      const examId = examBySubject.get(sub);
      if (examId) enrolments.push({ student_id: s.id, exam_id: examId, payment_status: "pending" });
    }
  });

  if (enrolments.length > 0) {
    const { error: enrErr } = await supabase.from("enrollments").insert(enrolments);
    if (enrErr) return { ok: false, error: enrErr.message };
  }

  revalidatePath("/portal/students");
  return { ok: true, students: inserted.length, enrolments: enrolments.length };
}

/** Remove a student (cascades to their enrolments). RLS enforces ownership. */
export async function removeStudent(studentId: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in." };
  const supabase = await createClient();
  const { error } = await supabase.from("students").delete().eq("id", studentId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/portal/students");
  return { ok: true };
}
