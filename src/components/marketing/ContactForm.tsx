"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, CONTACT_ROLES, type ContactInput } from "@/features/contact/schema";
import { submitContactMessage } from "@/features/contact/api";
import {
  fieldClasses,
  Label,
  LabelText,
  FieldError,
  FormAlert,
} from "@/components/ui/form";

/**
 * Contact form (Client Component). Validates with the shared Zod schema for
 * instant UX, then calls the `submitContactMessage` Server Action which
 * re-validates on the server. Best of both worlds.
 */
export function ContactForm() {
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    const res = await submitContactMessage(data);
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
      className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:p-8 lg:col-span-2"
      noValidate
    >
      <h2 className="font-display text-2xl font-extrabold text-navy">
        Send us a message
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Label>
          <LabelText>Your name *</LabelText>
          <input type="text" className={fieldClasses} {...register("name")} />
          <FieldError message={errors.name?.message} />
        </Label>
        <Label>
          <LabelText>Email *</LabelText>
          <input type="email" className={fieldClasses} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </Label>
        <Label>
          <LabelText>Phone</LabelText>
          <input type="tel" className={fieldClasses} {...register("phone")} />
        </Label>
        <Label>
          <LabelText>I am a *</LabelText>
          <select className={fieldClasses} defaultValue="" {...register("role")}>
            <option value="" disabled>
              Select...
            </option>
            {CONTACT_ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <FieldError message={errors.role?.message} />
        </Label>
      </div>

      <Label>
        <LabelText>Message *</LabelText>
        <textarea rows={5} className={fieldClasses} {...register("message")} />
        <FieldError message={errors.message?.message} />
      </Label>

      {result && (
        <FormAlert tone={result.ok ? "success" : "error"}>{result.text}</FormAlert>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-orange px-8 py-3.5 font-bold text-navy transition-colors hover:bg-orange-600 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
      <p className="text-xs text-slate-400">
        Prefer email? Reach us directly at info@aivantascholar.org.
      </p>
    </form>
  );
}
