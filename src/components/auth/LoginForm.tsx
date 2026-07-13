"use client";

import { useState } from "react";
import {
  signInWithPassword,
  requestSchoolOtp,
  verifySchoolOtp,
} from "@/features/auth/actions";
import { fieldClasses, Label, LabelText, FormAlert } from "@/components/ui/form";

type Tab = "school" | "staff";
type Msg = { ok: boolean; text: string } | null;

/**
 * Login entry point. Two audiences, two mechanisms:
 *  - School: school code + school email + email OTP (no password).
 *  - Staff (admin/coordinator): email + password.
 */
export function LoginForm() {
  const [tab, setTab] = useState<Tab>("school");

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6 grid grid-cols-2 rounded-lg bg-mist p-1 text-sm font-semibold">
        {(["school", "staff"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md py-2 transition-colors ${
              tab === t ? "bg-white text-navy shadow-sm" : "text-slate-500"
            }`}
          >
            {t === "school" ? "School login" : "Staff login"}
          </button>
        ))}
      </div>

      {tab === "school" ? <SchoolLogin /> : <StaffLogin />}
    </div>
  );
}

/** School: code + email → OTP → verify. Two steps. */
function SchoolLogin() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  async function onRequest(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await requestSchoolOtp(code, email);
      if (res.ok) {
        setStep("verify");
        setMsg({ ok: true, text: res.message ?? "Check your email." });
      } else {
        setMsg({ ok: false, text: res.error });
      }
    } catch {
      setMsg({ ok: false, text: "Couldn't reach the server. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      // On success the action redirects into /portal; we only return on error.
      const res = await verifySchoolOtp(code, email, token);
      if (!res.ok) setMsg({ ok: false, text: res.error });
    } catch {
      setMsg({ ok: false, text: "Couldn't reach the server. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-navy">
        School sign in
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {step === "request"
          ? "Enter your school code and registered email — we'll send you a one-time code."
          : `Enter the 6-digit code we emailed to ${email}.`}
      </p>

      {step === "request" ? (
        <form onSubmit={onRequest} className="mt-6 space-y-4" noValidate>
          <Label htmlFor="school-code">
            <LabelText>School code</LabelText>
            <input
              id="school-code"
              inputMode="numeric"
              autoComplete="off"
              placeholder="e.g. 10001"
              className={`${fieldClasses} tracking-widest`}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              required
            />
          </Label>
          <Label htmlFor="school-email">
            <LabelText>School email</LabelText>
            <input
              id="school-email"
              type="email"
              autoComplete="email"
              className={fieldClasses}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Label>

          {msg && <FormAlert tone={msg.ok ? "success" : "error"}>{msg.text}</FormAlert>}

          <SubmitButton busy={busy}>Email me a code</SubmitButton>
        </form>
      ) : (
        <form onSubmit={onVerify} className="mt-6 space-y-4" noValidate>
          <Label htmlFor="school-otp">
            <LabelText>6-digit code</LabelText>
            <input
              id="school-otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              className={`${fieldClasses} tracking-[0.5em]`}
              value={token}
              onChange={(e) =>
                setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
            />
          </Label>

          {msg && <FormAlert tone={msg.ok ? "success" : "error"}>{msg.text}</FormAlert>}

          <SubmitButton busy={busy}>Verify &amp; sign in</SubmitButton>

          <button
            type="button"
            onClick={() => {
              setStep("request");
              setToken("");
              setMsg(null);
            }}
            className="w-full text-center text-sm font-semibold text-dusty-600 hover:underline"
          >
            Use a different code or email
          </button>
        </form>
      )}
    </>
  );
}

/** Staff (admin / coordinator): classic email + password. */
function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      // On success the action redirects; we only return on error.
      const res = await signInWithPassword(email, password);
      if (!res.ok) setMsg({ ok: false, text: res.error });
    } catch {
      setMsg({ ok: false, text: "Couldn't reach the server. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-navy">
        Staff sign in
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Administrators and coordinators — sign in with your email and password.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <Label htmlFor="staff-email">
          <LabelText>Email address</LabelText>
          <input
            id="staff-email"
            type="email"
            autoComplete="email"
            className={fieldClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Label>
        <Label htmlFor="staff-password">
          <LabelText>Password</LabelText>
          <input
            id="staff-password"
            type="password"
            autoComplete="current-password"
            className={fieldClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Label>

        {msg && <FormAlert tone={msg.ok ? "success" : "error"}>{msg.text}</FormAlert>}

        <SubmitButton busy={busy}>Sign in</SubmitButton>
      </form>
    </>
  );
}

/** Shared submit button so both forms look/behave identically (DRY). */
function SubmitButton({
  busy,
  children,
}: {
  busy: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full rounded-lg bg-orange px-6 py-3 font-bold text-navy transition-colors hover:bg-orange-600 disabled:opacity-60"
    >
      {busy ? "Please wait…" : children}
    </button>
  );
}
