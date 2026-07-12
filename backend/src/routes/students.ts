import { Router } from "express";
import { asyncHandler, ApiError } from "../lib/http";
import { requireAuth } from "../middleware/auth";
import { getMySchool } from "../domain/schools";
import { commitBodySchema, commitRowSchema, type CommitRow } from "../domain/schemas";
import { env } from "../env";

export const studentsRouter = Router();

// Everything here requires a logged-in user; RLS enforces school ownership.
studentsRouter.use(requireAuth);

type Row = {
  id: string;
  full_name: string;
  class_level: number;
  section: string | null;
  enrollments:
    | { payment_status: string; exams: { subject: string } | null }[]
    | null;
};

export type RosterStudent = {
  id: string;
  full_name: string;
  class_level: number;
  section: string | null;
  subjects: string[];
  paid: boolean;
};

/**
 * GET /api/students/roster — the caller's school roster with subject enrolments.
 * Mirrors the old `listRoster` query; RLS scopes it to the user's own school.
 */
studentsRouter.get(
  "/students/roster",
  asyncHandler(async (req, res) => {
    const supabase = req.supabase!;
    const school = await getMySchool(supabase, req.user!.id);

    const { data } = await supabase
      .from("students")
      .select(
        "id, full_name, class_level, section, enrollments(payment_status, exams(subject))"
      )
      .eq("school_id", school.id)
      .order("class_level", { ascending: true })
      .order("full_name", { ascending: true });

    const roster: RosterStudent[] = ((data as unknown as Row[]) ?? []).map((s) => {
      const enr = s.enrollments ?? [];
      return {
        id: s.id,
        full_name: s.full_name,
        class_level: s.class_level,
        section: s.section,
        subjects: enr.map((e) => e.exams?.subject).filter(Boolean) as string[],
        paid: enr.length > 0 && enr.every((e) => e.payment_status === "paid"),
      };
    });

    res.json({ ok: true, school, roster });
  })
);

/**
 * POST /api/students/commit — insert reviewed students + per-subject enrolments
 * (draft, unpaid). Mirrors the old `commitEnrolments` action exactly; RLS
 * ensures the caller owns the school they're writing to.
 */
studentsRouter.post(
  "/students/commit",
  asyncHandler(async (req, res) => {
    const supabase = req.supabase!;
    const school = await getMySchool(supabase, req.user!.id);

    const body = commitBodySchema.safeParse(req.body);
    if (!body.success) {
      throw new ApiError(400, "Invalid payload.");
    }

    const valid: CommitRow[] = [];
    for (const r of body.data.rows) {
      const p = commitRowSchema.safeParse(r);
      if (p.success && (p.data.fia || p.data.cia || p.data.aia)) valid.push(p.data);
    }
    if (valid.length === 0) {
      throw new ApiError(400, "No valid rows to import.");
    }

    // Map subject -> exam id for the active cycle.
    const { data: exams } = await supabase
      .from("exams")
      .select("id, subject")
      .eq("academic_year", env.ACADEMIC_YEAR)
      .eq("is_active", true);
    const examBySubject = new Map<string, string>(
      (exams ?? []).map((e: { id: string; subject: string }) => [e.subject, e.id])
    );
    if (examBySubject.size === 0) {
      throw new ApiError(
        400,
        "No active exams found. Ask an admin to seed the exam catalog."
      );
    }

    // Insert students, get ids back (same order).
    const { data: inserted, error: insErr } = await supabase
      .from("students")
      .insert(
        valid.map((r) => ({
          school_id: school.id,
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
      throw new ApiError(500, insErr?.message ?? "Could not save students.");
    }

    // Build enrolments for each student's chosen subjects.
    const enrolments: {
      student_id: string;
      exam_id: string;
      payment_status: string;
    }[] = [];
    inserted.forEach((s: { id: string }, i) => {
      const r = valid[i]!;
      const subs = [r.fia && "fia", r.cia && "cia", r.aia && "aia"].filter(
        Boolean
      ) as string[];
      for (const sub of subs) {
        const examId = examBySubject.get(sub);
        if (examId)
          enrolments.push({
            student_id: s.id,
            exam_id: examId,
            payment_status: "pending",
          });
      }
    });

    if (enrolments.length > 0) {
      const { error: enrErr } = await supabase.from("enrollments").insert(enrolments);
      if (enrErr) throw new ApiError(500, enrErr.message);
    }

    res.json({
      ok: true,
      students: inserted.length,
      enrolments: enrolments.length,
    });
  })
);

/**
 * DELETE /api/students/:id — remove a student (cascades to enrolments).
 * Mirrors the old `removeStudent` action; RLS enforces ownership.
 */
studentsRouter.delete(
  "/students/:id",
  asyncHandler(async (req, res) => {
    const supabase = req.supabase!;
    const id = req.params.id;
    if (!id) throw new ApiError(400, "Missing student id.");
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) throw new ApiError(500, error.message);
    res.json({ ok: true });
  })
);
