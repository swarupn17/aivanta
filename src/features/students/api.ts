import { api } from "@/lib/api";

/**
 * Students feature — client API. Replaces the old `features/students/actions.ts`
 * server actions with calls to the Node backend. CSV parsing stays client-side
 * (see `./parse`) — it's pure and needs no server round-trip.
 */

export type CommitRow = {
  fullName: string;
  classLevel: number;
  section: string;
  dob: string;
  parentName: string;
  parentContact: string;
  fia: boolean;
  cia: boolean;
  aia: boolean;
};

export type CommitResult =
  { ok: true; students: number; enrolments: number } | { ok: false; error: string };

/** Insert reviewed students + per-subject enrolments. RLS enforces ownership. */
export async function commitEnrolments(rows: CommitRow[]): Promise<CommitResult> {
  return api.post<{ students: number; enrolments: number }>(
    "/api/students/commit",
    { rows },
    true
  );
}

/** Remove a student (cascades to their enrolments). RLS enforces ownership. */
export async function removeStudent(
  studentId: string
): Promise<{ ok: boolean; error?: string }> {
  return api.del(`/api/students/${studentId}`, true);
}
