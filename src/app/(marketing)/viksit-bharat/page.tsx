import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/PageHeader";
import { CTABand } from "@/components/marketing/CTABand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Viksit Bharat 2047",
  description:
    "Aivanta Scholar Foundation is a national awareness movement aligned with Viksit Bharat 2047 — preparing every Indian child in Financial, Cyber and Artificial Intelligence. We measure readiness, not rank.",
};

const SKILLS = [
  { code: "FIA", bar: "bg-navy", tone: "text-navy", title: "Financial Intelligence", body: "Money, savings, banking, budgeting and economic understanding at each child's level." },
  { code: "CIA", bar: "bg-dusty-600", tone: "text-dusty-600", title: "Cyber Intelligence", body: "Internet safety, digital ethics, cybersecurity awareness and responsible online behaviour." },
  { code: "AIA", bar: "bg-dusty", tone: "text-dusty-600", title: "Artificial Intelligence", body: "AI concepts, machine-learning basics, robotics and future-ready thinking for school students." },
];

const KEY_POINTS = [
  ["Viksit Bharat 2047 alignment", "framed as a national nation-building initiative, not an individual contest."],
  ["Voluntary participation", "flexible subject choice of 1, 2 or all 3 streams. No compulsion."],
  ["Full exam pattern", "50 MCQs, 2 marks each, 100 marks total per subject, conducted at school level."],
  ["Trilingual question paper", "English, Hindi and Marathi together in a single combined paper."],
  ["Transparent fees", "₹150 per subject with no hidden charges; study material, certificate and evaluation included."],
  ["Recognition for all", "every student gets a certificate; Class 9–10 toppers are eligible for scholarships & mentorship."],
];

const COMPARISON: [string, string, string][] = [
  ["Purpose", "Awareness, skills & values for life", "Rank-based academic competition"],
  ["What is tested", "Real-life understanding & ethical decision-making", "Syllabus memorisation & speed"],
  ["Participation", "Fully voluntary — 1, 2, or all 3 subjects freely chosen", "Often packaged; pressure to register for multiple exams"],
  ["Subjects", "Future-ready — Finance, Cyber Safety, AI", "Typically Maths, Science, English"],
  ["Who can participate", "Govt, private, urban & rural schools equally", "Primarily urban private school reach"],
  ["Class-wise design", "Questions crafted for each class's cognitive level", "Often one standard paper per broad age group"],
  ["Language access", "Single paper in English + Hindi + Marathi", "Usually English only or limited vernacular"],
  ["Fee philosophy", "₹150/subject — flat, transparent, no hidden charges", "Often involves books, kits & preparation packages"],
  ["What fee includes", "Study material + certificate + evaluation — all included", "Exam only; materials sold separately"],
  ["Recognition", "Every student gets a certificate; toppers get medals & scholarships", "Only top rankers rewarded; majority go unrecognised"],
  ["Bigger vision", "Aligned with Viksit Bharat 2047 — nation-building mission", "Individual academic achievement"],
  ["Ethics", "No compulsory purchases, no pressure, student-first always", "Commercial model; purchase pressure common"],
];

export default function ViksitBharatPage() {
  return (
    <>
      <PageHeader
        eyebrow="National Mission Alignment"
        title="Aligned with Viksit Bharat 2047"
        lead="Aivanta Scholar Foundation is not a competition — it is a national awareness movement that celebrates every participating student and prepares them to build a developed India."
      />

      {/* Philosophy */}
      <section className="bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
              Our Philosophy
            </p>
            <blockquote className="mt-5 font-display text-2xl font-extrabold leading-snug text-navy md:text-3xl">
              A traditional olympiad asks — &ldquo;Who is the best?&rdquo;
              <br className="hidden sm:block" /> Aivanta Scholar Foundation asks —{" "}
              <span className="text-dusty-600">
                &ldquo;Is every child prepared for the future?&rdquo;
              </span>
            </blockquote>
            <p className="mx-auto mt-6 max-w-2xl text-slate-600">
              That is why we are an awareness initiative, not a competition. We
              measure readiness, not rank. We reward participation, not just
              performance. And we serve every school in India — not just the ones
              with coaching infrastructure.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Three skills */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            India&apos;s First Future-Ready Assessment
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
            The three skills a developed India needs
          </h2>
          <p className="mt-4 text-slate-600">
            Class-wise annual examinations for every student from Class 1 to 10 —
            age-appropriate, never one-size-fits-all.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SKILLS.map((s) => (
            <Reveal key={s.code}>
              <article className="lift overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                <div className={`h-2 ${s.bar}`} />
                <div className="p-7">
                  <p className={`text-xs font-bold uppercase tracking-wider ${s.tone}`}>
                    {s.code}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-navy">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600">{s.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Key points */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
              The National Initiative
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
              Key points of our mission
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {KEY_POINTS.map(([strong, rest], i) => (
              <Reveal key={strong}>
                <div className="flex gap-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist font-display font-extrabold text-dusty-600">
                    {i + 1}
                  </span>
                  <p className="text-slate-700">
                    <strong className="text-navy">{strong}</strong> — {rest}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            The Difference
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
            Why we are different
          </h2>
          <p className="mt-4 text-slate-600">
            A national awareness movement built for every child — compared with a
            traditional olympiad.
          </p>
        </Reveal>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <caption className="sr-only">
              Comparison between Aivanta Scholar Foundation and a traditional olympiad
            </caption>
            <thead>
              <tr className="text-left">
                <th scope="col" className="p-4 font-display font-bold text-navy">
                  Dimension
                </th>
                <th
                  scope="col"
                  className="rounded-tl-xl bg-navy p-4 font-display font-bold text-white"
                >
                  Aivanta Scholar Foundation
                </th>
                <th
                  scope="col"
                  className="rounded-tr-xl bg-slate-100 p-4 font-display font-bold text-slate-700"
                >
                  Traditional Olympiad
                </th>
              </tr>
            </thead>
            <tbody className="align-top">
              {COMPARISON.map(([dim, asf, oly], i) => (
                <tr key={dim} className="border-b border-slate-200">
                  <th scope="row" className="p-4 text-left font-semibold text-navy">
                    {dim}
                  </th>
                  <td
                    className={`bg-navy/[0.03] p-4 ${i === COMPARISON.length - 1 ? "rounded-bl-xl" : ""}`}
                  >
                    {asf}
                  </td>
                  <td className="p-4 text-slate-600">{oly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CTABand
        title="Join the movement to build a Viksit Bharat."
        subtitle="Register your school for Assessment Cycle 2025–26 and prepare every child for the future."
      />
    </>
  );
}
