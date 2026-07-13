"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeStudent } from "@/features/students/actions";

export function RemoveStudentButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (!confirm("Remove this student and their enrolments?")) return;
    setBusy(true);
    await removeStudent(id);
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
    >
      {busy ? "…" : "Remove"}
    </button>
  );
}
