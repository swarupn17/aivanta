import { Reveal } from "@/components/ui/Reveal";

/**
 * Reusable inner-page hero band. Keeps every sub-page visually consistent
 * (navy gradient, eyebrow, title, optional lead) instead of repeating markup.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="bg-gradient-to-br from-navy via-navy-700 to-navy-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <Reveal className="max-w-3xl">
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-wider text-sky">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight md:text-5xl">
            {title}
          </h1>
          {lead && <p className="mt-4 text-lg text-slate-200">{lead}</p>}
        </Reveal>
      </div>
    </section>
  );
}
