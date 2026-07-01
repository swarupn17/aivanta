import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/PageHeader";
import { CTABand } from "@/components/marketing/CTABand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Publications & Courses",
  description:
    "Class-wise study books, parent and teacher handbooks, and digital courses from Aivanta Scholar Foundation — distributed free and at fair price.",
};

const HANDBOOKS = [
  { title: "Financial Literacy Guide", body: "A practical money-skills guide for families." },
  { title: "Cyber Safety Handbook", body: "For parents — protecting the whole family online." },
  { title: "AI for Everyone — India Edition", body: "AI explained simply, with Indian examples." },
  { title: "Teacher Handbook", body: "Lesson plans to deliver the three subjects in class." },
  { title: "Social Welfare Awareness Kit", body: "Materials for community awareness drives." },
  { title: "Previous Sample Papers", body: "Practice MCQs by class and subject." },
];

const COURSES = [
  { badge: "S", tone: "bg-mist text-dusty-600", title: "Student E-Course", body: "Self-paced lessons matched to each class." },
  { badge: "P", tone: "bg-mist text-dusty-600", title: "Parent Mini-Course", body: "Short modules to support your child safely." },
  { badge: "T", tone: "bg-navy/10 text-navy", title: "Teacher Certification", body: "Certified training to teach the three subjects." },
  { badge: "C", tone: "bg-mist text-dusty-600", title: "Community Facilitator", body: "Train to run awareness sessions locally." },
];

const CLASSES = Array.from({ length: 10 }, (_, i) => i + 1);

export default function PublicationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Publications & Courses"
        lead="Class-wise study books, handbooks and digital courses — age-appropriate, trilingual and print-ready."
      />

      {/* Study books */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            Study Material
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
            One book per class
          </h2>
          <p className="mt-3 text-slate-600">
            Each class book covers all three subjects, designed for that grade&apos;s
            grasping ability — included free with registration.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {CLASSES.map((c) => {
            const ready = c === 1;
            return (
              <div
                key={c}
                className="lift overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
              >
                <div className="flex aspect-[3/4] flex-col items-center justify-center bg-gradient-to-br from-navy to-navy-700 p-4 text-white">
                  <span className="text-xs font-semibold uppercase tracking-widest text-sky">
                    Class
                  </span>
                  <span className="font-display text-5xl font-extrabold">{c}</span>
                  <span className="mt-2 text-[10px] text-slate-200">FIA · CIA · AIA</span>
                </div>
                <div className="p-3 text-center">
                  {ready ? (
                    <span className="inline-block rounded bg-green-50 px-2 py-1 text-xs font-bold text-green-700 ring-1 ring-green-200">
                      Available
                    </span>
                  ) : (
                    <span className="inline-block rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Class 1 material is released. Remaining classes roll out through the cycle.
        </p>
      </section>

      {/* Handbooks */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
              Handbooks &amp; Guides
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
              For parents &amp; teachers too
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {HANDBOOKS.map((h) => (
              <Reveal key={h.title}>
                <div className="lift rounded-2xl bg-white p-7 ring-1 ring-slate-200">
                  <h3 className="font-display font-bold text-navy">{h.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{h.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Digital courses */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            Digital Courses
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
            Learn online too
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COURSES.map((c) => (
            <Reveal key={c.title}>
              <div className="lift rounded-2xl bg-white p-7 ring-1 ring-slate-200">
                <div
                  className={`mb-4 grid h-12 w-12 place-items-center rounded-xl font-display text-xl font-extrabold ${c.tone}`}
                >
                  {c.badge}
                </div>
                <h3 className="font-display font-bold text-navy">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABand title="Study material is free with every registration." />
    </>
  );
}
