"use client";

import { useState } from "react";
import { signInWithPassword, signUpWithPassword } from "@/features/auth/actions";
import { fieldClasses, Label, LabelText, FormAlert } from "@/components/ui/form";

type Mode = "signin" | "signup";

/**
 * Email + password auth (OTP coming later). Toggles between sign in and create
 * account. On success the Server Action redirects into /portal.
 */
export function LoginForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res =
      mode === "signin"
        ? await signInWithPassword(email, password)
        : await signUpWithPassword(email, password, fullName);
    // On success the action redirects; we only reach here on error / info.
    setBusy(false);
    if (!res.ok) setMsg({ ok: false, text: res.error });
    else if (res.message) setMsg({ ok: true, text: res.message });
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      {/* Tabs */}
      <div className="mb-6 grid grid-cols-2 rounded-lg bg-mist p-1 text-sm font-semibold">
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setMsg(null);
            }}
            className={`rounded-md py-2 transition-colors ${
              mode === m ? "bg-white text-navy shadow-sm" : "text-slate-500"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <h1 className="font-display text-2xl font-extrabold text-navy">
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {mode === "signin"
          ? "Sign in with your email and password."
          : "Schools, coordinators and members — start here."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        {mode === "signup" && (
          <Label>
            <LabelText>Full name</LabelText>
            <input
              type="text"
              autoComplete="name"
              className={fieldClasses}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Label>
        )}
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
        <Label>
          <LabelText>Password</LabelText>
          <input
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className={fieldClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          {mode === "signup" && (
            <span className="mt-1 block text-xs text-slate-400">
              At least 8 characters.
            </span>
          )}
        </Label>

        {msg && <FormAlert tone={msg.ok ? "success" : "error"}>{msg.text}</FormAlert>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-orange px-6 py-3 font-bold text-navy transition-colors hover:bg-orange-600 disabled:opacity-60"
        >
          {busy
            ? "Please wait…"
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
