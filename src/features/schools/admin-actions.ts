"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/queries";
import { canApprove } from "./queries";

const ACADEMIC_YEAR = "2025-26";

export type AdminActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!canApprove(user?.profile?.role)) return null;
  return user;
}

const schoolPatch = z.object({
  name: z.string().min(2),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  contact_person: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  contact_email: z.string().optional().nullable(),
  academic_year: z.string().min(1),
  status: z.enum(["pending", "approved", "rejected", "suspended"]),
});

export type SchoolPatch = z.infer<typeof schoolPatch>;

/** Admin: update a school's details. */
export async function adminUpdateSchool(
  id: string,
  patch: SchoolPatch
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorised." };
  const p = schoolPatch.safeParse(patch);
  if (!p.success) return { ok: false, error: "Please check the fields." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("schools")
    .update({ ...p.data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/portal/admin/schools/${id}`);
  revalidatePath("/portal/admin/schools");
  return { ok: true };
}

const studentInput = z.object({
  fullName: z.string().min(1),
  classLevel: z.coerce.number().int().min(1).max(10),
  section: z.string().optional().default(""),
  fia: z.boolean(),
  cia: z.boolean(),
  aia: z.boolean(),
});

/** Admin: add a single student (+ chosen subject enrolments) to a school. */
export async function adminAddStudent(
  schoolId: string,
  input: z.infer<typeof studentInput>
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorised." };
  const p = studentInput.safeParse(input);
  if (!p.success || !(p.data.fia || p.data.cia || p.data.aia)) {
    return { ok: false, error: "Name, class (1–10) and at least one subject required." };
  }
  const supabase = await createClient();

  const { data: student, error: insErr } = await supabase
    .from("students")
    .insert({
      school_id: schoolId,
      full_name: p.data.fullName,
      class_level: p.data.classLevel,
      section: p.data.section || null,
    })
    .select("id")
    .single();
  if (insErr || !student) return { ok: false, error: insErr?.message ?? "Insert failed." };

  const subs = [p.data.fia && "fia", p.data.cia && "cia", p.data.aia && "aia"].filter(
    Boolean
  ) as string[];
  await syncEnrolments(supabase, (student as { id: string }).id, subs);

  revalidatePath(`/portal/admin/schools/${schoolId}`);
  return { ok: true };
}

/** Admin: remove a student (cascades to enrolments). */
export async function adminRemoveStudent(
  studentId: string,
  schoolId: string
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorised." };
  const supabase = await createClient();
  const { error } = await supabase.from("students").delete().eq("id", studentId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/portal/admin/schools/${schoolId}`);
  return { ok: true };
}

/** Admin: turn a single subject enrolment on/off for a student. */
export async function adminToggleEnrolment(
  studentId: string,
  subject: "fia" | "cia" | "aia",
  enabled: boolean,
  schoolId: string
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorised." };
  const supabase = await createClient();

  const { data: exam } = await supabase
    .from("exams")
    .select("id")
    .eq("subject", subject)
    .eq("academic_year", ACADEMIC_YEAR)
    .eq("is_active", true)
    .maybeSingle();
  if (!exam) return { ok: false, error: "Exam not found for that subject." };
  const examId = (exam as { id: string }).id;

  if (enabled) {
    const { error } = await supabase
      .from("enrollments")
      .upsert({ student_id: studentId, exam_id: examId, payment_status: "pending" });
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("student_id", studentId)
      .eq("exam_id", examId);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath(`/portal/admin/schools/${schoolId}`);
  return { ok: true };
}

/** Helper: insert enrolments for the given subjects (active cycle). */
async function syncEnrolments(
  supabase: Awaited<ReturnType<typeof createClient>>,
  studentId: string,
  subjects: string[]
) {
  if (subjects.length === 0) return;
  const { data: exams } = await supabase
    .from("exams")
    .select("id, subject")
    .eq("academic_year", ACADEMIC_YEAR)
    .eq("is_active", true);
  const bySubject = new Map<string, string>(
    (exams ?? []).map((e: { id: string; subject: string }) => [e.subject, e.id])
  );
  const rows = subjects
    .map((s) => bySubject.get(s))
    .filter(Boolean)
    .map((examId) => ({ student_id: studentId, exam_id: examId as string, payment_status: "pending" }));
  if (rows.length > 0) await supabase.from("enrollments").insert(rows);
}
