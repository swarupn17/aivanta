"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  SYLLABUS,
  SUBJECT_META,
  SUBJECT_ORDER,
  CLASS_ORDER,
  tierForClass,
  type SubjectKey,
} from "@/features/syllabus/data";

/** Distinct-but-cohesive accent per subject (navy -> dusty ladder). */
const SUBJECT_ACCENT: Record<SubjectKey, string> = {
  FIA: "#0d3b66",
  CIA: "#5c7a93",
  AIA: "#7f9db1",
};

/**
 * Interactive class-wise syllabus explorer. Pick a subject + class to see the
 * age-appropriate theme, focus rationale and detailed units. Driven by the
 * verified syllabus dataset (features/syllabus/data.ts).
 */
export function SyllabusExplorer() {
  const [subject, setSubject] = useState<SubjectKey>("FIA");
  const [cls, setCls] = useState(1);

  const meta = SUBJECT_META[subject];
  const accent = SUBJECT_ACCENT[subject];
  const entry = SYLLABUS[subject].find((c) => c.cls === cls) ?? SYLLABUS[subject][0];
  if (!entry) return null;

  return (
    <div>
      {/* Subject toggle */}
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Choose subject">
        {SUBJECT_ORDER.map((key) => {
          const on = key === subject;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSubject(key)}
              aria-pressed={on}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                on
                  ? "bg-navy text-white"
                  : "bg-white text-navy ring-1 ring-slate-200 hover:bg-mist"
              )}
            >
              {SUBJECT_META[key].name}
            </button>
          );
        })}
      </div>

      {/* Class tabs */}
      <div className="mt-4 flex flex-wrap justify-center gap-1.5" role="group" aria-label="Choose class">
        {CLASS_ORDER.map((c) => {
          const on = c === cls;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCls(c)}
              aria-pressed={on}
              className={cn(
                "h-11 w-11 rounded-full text-sm font-semibold transition-colors",
                on
                  ? "bg-navy text-white"
                  : "bg-mist text-navy hover:ring-1 hover:ring-dusty/50"
              )}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Class header card */}
      <div className="mt-10 overflow-hidden rounded-2xl ring-1 ring-slate-200">
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 text-white"
          style={{ background: accent }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Class {entry.cls} · {meta.name}
            </p>
            <h2 className="mt-0.5 font-display text-2xl font-bold">{entry.theme}</h2>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              {entry.age}
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              {tierForClass(entry.cls)}
            </span>
          </div>
        </div>

        {/* Focus rationale */}
        <div className="border-b border-slate-100 bg-mist px-6 py-4">
          <p className="text-sm italic leading-relaxed text-slate-600">{entry.focus}</p>
        </div>

        <div className="px-6 py-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-dusty-600">
            {entry.units.length} units · 50 MCQs · 100 marks · trilingual
          </p>

          {/* Units */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {entry.units.map((u, i) => (
              <div
                key={u.n}
                className="rounded-xl border border-slate-100 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold text-white"
                    style={{ background: accent }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-display text-sm font-semibold text-navy">{u.t}</h3>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {u.topics.map((t) => (
                    <li key={t} className="flex gap-2 text-xs leading-relaxed text-slate-600">
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                        style={{ background: accent }}
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Why this age */}
          <div className="mt-6 rounded-xl bg-mist p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-dusty-600">
              Why this, this age
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{entry.why}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
