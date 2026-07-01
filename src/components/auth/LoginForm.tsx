"use client";

import { useState } from "react";
import { requestOtp, verifyOtp } from "@/features/auth/actions";
import { fieldClasses, Label, LabelText, FormAlert } from "@/components/ui/form";

/**
 * Two-step email OTP login. Step 1 emails a 6-digit code; step 2 verifies it.
 * On success the Server Action redirects into /portal.
 */
export function LoginForm() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onRequest(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await requestOtp(email);
    setBusy(false);
    if (res.ok) {
      setStep("code");
      setMsg({ ok: true, text: res.message ?? "Code sent." });
    } else {
      setMsg({ ok: false, text: res.error });
    }
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await verifyOtp(email, code);
    // On success verifyOtp redirects; we only get here on error.
    setBusy(false);
    if (!res.ok) setMsg({ ok: false, text: res.error });
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="font-display text-2xl font-extrabold text-navy">
        {step === "email" ? "School & member login" : "Enter your code"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {step === "email"
          ? "We'll email you a secure 6-digit code — no password needed."
          : `Sent to ${email}. Check your inbox.`}
      </p>

      {step === "email" ? (
        <form onSubmit={onRequest} className="mt-6 space-y-4" noValidate>
          <Label>
            <LabelText>Email address</LabelText>
            <input
              type="email"
              autoComplete="email"
              className={fieldClasses}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Label>
          {msg && <FormAlert tone={msg.ok ? "success" : "error"}>{msg.text}</FormAlert>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-orange px-6 py-3 font-bold text-navy transition-colors hover:bg-orange-600 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send me a code"}
          </button>
        </form>
      ) : (
        <form onSubmit={onVerify} className="mt-6 space-y-4" noValidate>
          <Label>
            <LabelText>6-digit code</LabelText>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className={`${fieldClasses} tracking-[0.4em]`}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
            />
          </Label>
          {msg && <FormAlert tone={msg.ok ? "success" : "error"}>{msg.text}</FormAlert>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-orange px-6 py-3 font-bold text-navy transition-colors hover:bg-orange-600 disabled:opacity-60"
          >
            {busy ? "Verifying…" : "Verify & sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setMsg(null);
            }}
            className="w-full text-sm font-semibold text-dusty-600 hover:underline"
          >
            ← Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
