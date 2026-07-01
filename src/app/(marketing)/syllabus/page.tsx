import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/marketing/PageHeader";
import { SyllabusExplorer } from "@/components/marketing/SyllabusExplorer";

export const metadata: Metadata = {
  title: "Class-wise Syllabus",
  description:
    "Explore the class-wise syllabus for all three assessments across Classes 1–10 — age-appropriate progression in Financial, Cyber and Artificial Intelligence.",
};

const TIERS = [
  { range: "Classes 1–2", title: "Foundational", body: "Storytelling, real objects, surroundings." },
  { range: "Classes 3–5", title: "Elementary", body: "Habits, awareness, basic skills." },
  { range: "Classes 6–8", title: "Intermediate", body: "Systems thinking, tools, analysis." },
  { range: "Classes 9–10", title: "Advanced", body: "Real-world complexity, ethics, case studies." },
];

export default function SyllabusPage() {
  return (
    <>
      <PageHeader
        eyebrow="Syllabus"
        title="Class-wise Syllabus"
        lead="Same subject, ten depths. Pick a subject and a class to see the age-appropriate units."
      />

      {/* Progression tiers */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <div key={t.range} className="rounded-xl bg-paper p-5 ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase text-dusty-600">{t.range}</p>
              <p className="mt-1 font-display font-bold text-navy">{t.title}</p>
              <p className="mt-1 text-sm text-slate-600">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explorer */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SyllabusExplorer />
        <div className="mt-10 text-center">
          <Link
            href="/publications"
            className="inline-block rounded-lg bg-navy px-6 py-3.5 font-bold text-white transition-colors hover:bg-navy-700"
          >
            Get the study material
          </Link>
        </div>
      </section>
    </>
  );
}
