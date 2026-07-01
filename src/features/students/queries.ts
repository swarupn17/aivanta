import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export type RosterStudent = {
  id: string;
  full_name: string;
  class_level: number;
  section: string | null;
  subjects: string[]; // ["fia","cia"]
  paid: boolean;
};

export type FeeSummary = {
  perSubjectRupees: number;
  totalEnrolments: number;
  totalRupees: number;
  byClass: { classLevel: number; students: number; enrolments: number }[];
  bySubject: { subject: string; count: number }[];
};

type Row = {
  id: string;
  full_name: string;
  class_level: number;
  section: string | null;
  enrollments: { payment_status: string; exams: { subject: string } | null }[] | null;
};

/** All students for a school with their subject enrolments. */
export async function listRoster(schoolId: string): Promise<RosterStudent[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("id, full_name, class_level, section, enrollments(payment_status, exams(subject))")
    .eq("school_id", schoolId)
    .order("class_level", { ascending: true })
    .order("full_name", { ascending: true });

  return ((data as unknown as Row[]) ?? []).map((s) => {
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
}

/** Classwise + examwise counts and the total fee, from the roster. */
export function summarise(roster: RosterStudent[], perSubjectRupees: number): FeeSummary {
  const byClassMap = new Map<number, { students: number; enrolments: number }>();
  const bySubjectMap = new Map<string, number>();
  let totalEnrolments = 0;

  for (const s of roster) {
    const c = byClassMap.get(s.class_level) ?? { students: 0, enrolments: 0 };
    c.students += 1;
    c.enrolments += s.subjects.length;
    byClassMap.set(s.class_level, c);
    totalEnrolments += s.subjects.length;
    for (const sub of s.subjects) {
      bySubjectMap.set(sub, (bySubjectMap.get(sub) ?? 0) + 1);
    }
  }

  return {
    perSubjectRupees,
    totalEnrolments,
    totalRupees: totalEnrolments * perSubjectRupees,
    byClass: [...byClassMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([classLevel, v]) => ({ classLevel, ...v })),
    bySubject: ["fia", "cia", "aia"].map((subject) => ({
      subject,
      count: bySubjectMap.get(subject) ?? 0,
    })),
  };
}
