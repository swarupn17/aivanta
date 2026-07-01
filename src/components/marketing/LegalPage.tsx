import { PageHeader } from "@/components/marketing/PageHeader";

export type LegalSection = { heading: string; body: React.ReactNode };

/**
 * Reusable legal document layout (Privacy, Terms). Both pages share the exact
 * same structure, so it lives here once and is driven by data.
 */
export function LegalPage({
  eyebrow,
  title,
  lead,
  sections,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} lead={lead} />
      <section className="mx-auto max-w-3xl space-y-8 px-4 py-16">
        <div className="rounded-xl bg-mist p-5 text-sm text-navy-700 ring-1 ring-dusty/40">
          <strong>Placeholder:</strong> Replace this text with your final,
          legally-reviewed document before going live.
        </div>
        {sections.map((s, i) => (
          <div key={s.heading}>
            <h2 className="font-display text-2xl font-bold text-navy">
              {i + 1}. {s.heading}
            </h2>
            <p className="mt-2 text-slate-600">{s.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
