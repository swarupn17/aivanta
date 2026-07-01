"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { claimSchool } from "@/features/schools/actions";
import { fieldClasses, FormAlert } from "@/components/ui/form";

/**
 * School claim: enter the admin-issued code to bind this account to a school.
 * On success we refresh so the portal re-reads the new 'school' role.
 */
export function ClaimSchoolForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await claimSchool(code);
    setBusy(false);
    if (res.ok) {
      setMsg({ ok: true, text: res.message });
      router.refresh();
    } else {
      setMsg({ ok: false, text: res.error });
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
      <h2 className="font-display text-lg font-bold text-navy">Have a school code?</h2>
      <p className="mt-1 text-sm text-slate-600">
        Once an administrator approves your registration, they&apos;ll send you a
        school code. Enter it here to unlock your school dashboard.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ASF-XXXXXX"
          className={`${fieldClasses} tracking-widest sm:max-w-xs`}
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-orange px-6 py-2.5 font-bold text-navy transition-colors hover:bg-orange-600 disabled:opacity-60"
        >
          {busy ? "Checking…" : "Claim school"}
        </button>
      </div>
      {msg && (
        <div className="mt-3">
          <FormAlert tone={msg.ok ? "success" : "error"}>{msg.text}</FormAlert>
        </div>
      )}
    </form>
  );
}
