"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateSchool, type SchoolPatch } from "@/features/schools/admin-actions";
import { fieldClasses, Label, LabelText, FormAlert } from "@/components/ui/form";

type SchoolRecord = Record<string, string | null>;

const STATUSES = ["pending", "approved", "rejected", "suspended"] as const;

export function SchoolEditForm({ school }: { school: SchoolRecord }) {
  const router = useRouter();
  const [form, setForm] = useState<SchoolPatch>({
    name: school.name ?? "",
    city: school.city ?? "",
    district: school.district ?? "",
    state: school.state ?? "",
    country: school.country ?? "",
    pincode: school.pincode ?? "",
    contact_person: school.contact_person ?? "",
    contact_phone: school.contact_phone ?? "",
    contact_email: school.contact_email ?? "",
    academic_year: school.academic_year ?? "2025-26",
    status: (school.status as SchoolPatch["status"]) ?? "approved",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = (k: keyof SchoolPatch, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await adminUpdateSchool(school.id as string, form);
    setBusy(false);
    if (res.ok) {
      setMsg({ ok: true, text: "Saved." });
      router.refresh();
    } else setMsg({ ok: false, text: res.error });
  }

  const text = (k: keyof SchoolPatch, label: string) => (
    <Label>
      <LabelText>{label}</LabelText>
      <input
        className={fieldClasses}
        value={(form[k] as string) ?? ""}
        onChange={(e) => set(k, e.target.value)}
      />
    </Label>
  );

  return (
    <form onSubmit={onSave} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
      <h2 className="font-display text-lg font-bold text-navy">School details</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {text("name", "School name")}
        {text("city", "City")}
        {text("district", "District")}
        {text("state", "State")}
        {text("country", "Country")}
        {text("pincode", "Pincode")}
        {text("contact_person", "Contact person")}
        {text("contact_phone", "Contact phone")}
        {text("contact_email", "Contact email")}
        {text("academic_year", "Academic year")}
        <Label>
          <LabelText>Status</LabelText>
          <select
            className={fieldClasses}
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Label>
      </div>
      {msg && (
        <div className="mt-4">
          <FormAlert tone={msg.ok ? "success" : "error"}>{msg.text}</FormAlert>
        </div>
      )}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 rounded-lg bg-orange px-6 py-2.5 font-bold text-navy hover:bg-orange-600 disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
