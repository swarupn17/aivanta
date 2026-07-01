"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  APPLICANT_ROLES,
  type RegistrationInput,
} from "@/features/registration/schema";
import { submitRegistration } from "@/features/registration/actions";
import {
  fieldClasses,
  Label,
  LabelText,
  FieldError,
  FormAlert,
} from "@/components/ui/form";

/**
 * School code-request form (SOF-style). Captures the applicant + school details.
 * Subjects, student counts and fees are handled later in the school portal.
 */
export function RegistrationForm() {
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { applicantRole: "Principal", country: "India" },
  });

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
          Request a school code
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Schools interested in having their students appear in Aivanta
          assessments can submit the details below. Our representative will
          contact you and assist with registration. Fields marked * are required.
        </p>
      </div>

      <fieldset className="space-y-4">
        <legend className="font-display font-bold text-navy">Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label>
            <LabelText>Are you *</LabelText>
            <select className={fieldClasses} {...register("applicantRole")}>
              {APPLICANT_ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Label>
          <Label>
            <LabelText>Your name *</LabelText>
            <input type="text" className={fieldClasses} {...register("applicantName")} />
            <FieldError message={errors.applicantName?.message} />
          </Label>
          <Label>
            <LabelText>Your email id *</LabelText>
            <input
              type="email"
              placeholder="Enter your valid e-mail id"
              className={fieldClasses}
              {...register("applicantEmail")}
            />
            <FieldError message={errors.applicantEmail?.message} />
          </Label>
          <Label>
            <LabelText>Your mobile no *</LabelText>
            <input
              type="tel"
              placeholder="Please enter 10 digit mobile no."
              className={fieldClasses}
              {...register("applicantMobile")}
            />
            <FieldError message={errors.applicantMobile?.message} />
          </Label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display font-bold text-navy">School details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label className="sm:col-span-2">
            <LabelText>School name *</LabelText>
            <input
              type="text"
              placeholder="Enter complete school name"
              className={fieldClasses}
              {...register("schoolName")}
            />
            <FieldError message={errors.schoolName?.message} />
          </Label>
          <Label className="sm:col-span-2">
            <LabelText>School address *</LabelText>
            <input
              type="text"
              placeholder="Enter complete school address"
              className={fieldClasses}
              {...register("schoolAddress")}
            />
            <FieldError message={errors.schoolAddress?.message} />
          </Label>
          <Label>
            <LabelText>School city *</LabelText>
            <input type="text" className={fieldClasses} {...register("city")} />
            <FieldError message={errors.city?.message} />
          </Label>
          <Label>
            <LabelText>School district *</LabelText>
            <input type="text" className={fieldClasses} {...register("district")} />
            <FieldError message={errors.district?.message} />
          </Label>
          <Label>
            <LabelText>School state *</LabelText>
            <input type="text" className={fieldClasses} {...register("state")} />
            <FieldError message={errors.state?.message} />
          </Label>
          <Label>
            <LabelText>School country *</LabelText>
            <input type="text" className={fieldClasses} {...register("country")} />
            <FieldError message={errors.country?.message} />
          </Label>
          <Label>
            <LabelText>School pincode *</LabelText>
            <input type="text" className={fieldClasses} {...register("pincode")} />
            <FieldError message={errors.pincode?.message} />
          </Label>
          <Label>
            <LabelText>School email id *</LabelText>
            <input
              type="email"
              placeholder="Enter valid school email id"
              className={fieldClasses}
              {...register("schoolEmail")}
            />
            <FieldError message={errors.schoolEmail?.message} />
          </Label>
          <Label>
            <LabelText>School phone no *</LabelText>
            <input type="tel" className={fieldClasses} {...register("schoolPhone")} />
            <FieldError message={errors.schoolPhone?.message} />
          </Label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display font-bold text-navy">Principal details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label>
            <LabelText>Principal name *</LabelText>
            <input type="text" className={fieldClasses} {...register("principalName")} />
            <FieldError message={errors.principalName?.message} />
          </Label>
          <Label>
            <LabelText>Principal contact no *</LabelText>
            <input
              type="tel"
              placeholder="Please enter valid contact no."
              className={fieldClasses}
              {...register("principalContact")}
            />
            <FieldError message={errors.principalContact?.message} />
          </Label>
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
        {isSubmitting ? "Submitting…" : "Submit request"}
      </button>
      <p className="text-xs text-slate-400">
        This sends a request for review. Once approved, an Aivanta representative
        will contact you and issue your school code to claim your account.
      </p>
    </form>
  );
}
