"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  BOARDS,
  SCHOOL_TYPES,
  type RegistrationInput,
} from "@/features/registration/schema";
import { submitRegistration } from "@/features/registration/actions";
import { siteConfig } from "@/config/site";
import {
  fieldClasses,
  Label,
  LabelText,
  FieldError,
  FormAlert,
} from "@/components/ui/form";

const SUBJECTS = [
  { name: "fiaCount" as const, label: "Financial (FIA)", tone: "text-dusty-600" },
  { name: "ciaCount" as const, label: "Cyber (CIA)", tone: "text-navy" },
  { name: "aiaCount" as const, label: "AI (AIA)", tone: "text-dusty-600" },
];

/**
 * School registration form (Client Component) with a LIVE fee total.
 * The displayed total is convenience only — the Server Action recomputes the
 * authoritative amount before any payment.
 */
export function RegistrationForm() {
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const fee = siteConfig.fees.perSubject;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { fiaCount: 0, ciaCount: 0, aiaCount: 0 },
  });

  const counts = watch(["fiaCount", "ciaCount", "aiaCount"]);
  const totalStudents = counts.reduce((sum, n) => sum + (Number(n) || 0), 0);
  const totalRupees = totalStudents * fee;

  const onSubmit = async (data: RegistrationInput) => {
    const res = await submitRegistration(data);
    if (res.ok) {
      setResult({ ok: true, text: res.message });
      reset();
    } else {
      setResult({ ok: false, text: res.error });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:p-8 lg:col-span-2"
      noValidate
    >
      <div>
        <h2 className="font-display text-2xl font-extrabold text-navy">
          School registration form
        </h2>
        <p className="mt-1 text-sm text-slate-500">Fields marked * are required.</p>
      </div>

      <fieldset className="space-y-4">
        <legend className="font-display font-bold text-navy">School details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label>
            <LabelText>School name *</LabelText>
            <input type="text" className={fieldClasses} {...register("school")} />
            <FieldError message={errors.school?.message} />
          </Label>
          <Label>
            <LabelText>UDISE code</LabelText>
            <input type="text" className={fieldClasses} {...register("udise")} />
          </Label>
          <Label>
            <LabelText>Board</LabelText>
            <select className={fieldClasses} {...register("board")}>
              {BOARDS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </Label>
          <Label>
            <LabelText>School type</LabelText>
            <select className={fieldClasses} {...register("type")}>
              {SCHOOL_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Label>
          <Label className="sm:col-span-2">
            <LabelText>Address (city, district, state)</LabelText>
            <input type="text" className={fieldClasses} {...register("address")} />
          </Label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display font-bold text-navy">
          Coordinator details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label>
            <LabelText>Contact name *</LabelText>
            <input type="text" className={fieldClasses} {...register("contact")} />
            <FieldError message={errors.contact?.message} />
          </Label>
          <Label>
            <LabelText>Phone *</LabelText>
            <input type="tel" className={fieldClasses} {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </Label>
          <Label className="sm:col-span-2">
            <LabelText>Email *</LabelText>
            <input type="email" className={fieldClasses} {...register("email")} />
            <FieldError message={errors.email?.message} />
          </Label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display font-bold text-navy">
          Subjects &amp; estimated students
        </legend>
        <p className="text-sm text-slate-500">
          How many students will appear for each subject? ₹{fee} per student per
          subject.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {SUBJECTS.map((s) => (
            <label key={s.name} className="block rounded-xl p-4 ring-1 ring-slate-200">
              <span className={`text-sm font-bold ${s.tone}`}>{s.label}</span>
              <input
                type="number"
                min={0}
                className={`${fieldClasses} mt-2`}
                {...register(s.name)}
              />
            </label>
          ))}
        </div>

        {/* Live fee total */}
        <div className="flex items-center justify-between rounded-xl bg-paper px-5 py-4 ring-1 ring-slate-200">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-navy">{totalStudents}</span> student
            registration{totalStudents === 1 ? "" : "s"} × ₹{fee}
          </div>
          <div className="font-display text-2xl font-extrabold text-navy">
            ₹{totalRupees.toLocaleString("en-IN")}
          </div>
        </div>
      </fieldset>

      {result && (
        <FormAlert tone={result.ok ? "success" : "error"}>{result.text}</FormAlert>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-orange px-8 py-3.5 font-bold text-navy transition-colors hover:bg-orange-600 disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Submitting…" : "Submit registration"}
      </button>
      <p className="text-xs text-slate-400">
        Online payment goes live soon. For now our team will reach out to confirm
        your registration.
      </p>
    </form>
  );
}
