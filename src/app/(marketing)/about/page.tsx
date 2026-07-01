import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/PageHeader";
import { CTABand } from "@/components/marketing/CTABand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Aivanta Scholar Foundation is a national student awareness initiative working across assessments, social welfare and publications — aligned with Viksit Bharat 2047.",
};

const GLANCE = [
  ["Headquarters", "Pune, MH"],
  ["Classes served", "1 – 10"],
  ["Subjects", "FIA · CIA · AIA"],
  ["Languages", "EN · HI · MR"],
  ["Cycle", "Annual"],
];

const VALUES = [
  { title: "No compulsion", body: "Participation is always voluntary. No forced purchases, no pressure." },
  { title: "Equal access", body: "Every child, every school — rural or urban — gets the same opportunity." },
  { title: "Transparency", body: "One clear fee, no hidden charges, study material included." },
  { title: "Real-world focus", body: "We test awareness and decision-making, not rote memorisation." },
  { title: "Giving back", body: "Scholarships and free community programs for the students who need them most." },
  { title: "Long-term growth", body: "We invest in student development, not short-term results." },
];

const OLYMPIAD = [
  "Ranks and competition first",
  "Rewards top performers only",
  "Often needs coaching",
  "Upsells books and guides",
];

const AIVANTA = [
  "Readiness and awareness first",
  "Rewards participation for all",
  "Study material included free",
  "No upsell, ever",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="About the Foundation"
        lead="An awareness movement preparing every Indian child to be financially aware, digitally safe and AI-ready."
      />

      {/* Story */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            Our Story
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy">
            Why we exist
          </h2>
          <div className="mt-4 space-y-4 text-slate-600">
            <p>
              India ranks 73rd globally in financial literacy, loses over ₹11,000
              crore to cyber fraud each year, and is racing to prepare its youth for
              an AI-driven world. Yet the three skills that matter most for the next
              generation — money sense, digital safety and AI awareness — are rarely
              taught in school.
            </p>
            <p>
              Aivanta Scholar Foundation was created to close that gap. We are not an
              olympiad body chasing rankings; we are a national awareness initiative
              measuring readiness. Our assessments reward participation and
              understanding, and we serve every school in India — government and
              private, urban and rural — on equal terms.
            </p>
            <p>
              Our work is aligned with the national vision of{" "}
              <strong className="text-navy">Viksit Bharat 2047</strong> and the
              spirit of NEP 2020, which explicitly calls for life skills and digital
              literacy.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="rounded-2xl bg-paper p-6 ring-1 ring-slate-200">
            <h3 className="font-display font-bold text-navy">At a glance</h3>
            <dl className="mt-3 space-y-2 text-sm text-slate-600">
              {GLANCE.map(([dt, dd]) => (
                <div key={dt} className="flex justify-between gap-4">
                  <dt>{dt}</dt>
                  <dd className="text-right font-semibold text-navy">{dd}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      {/* Mission / Vision */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl bg-white p-8 ring-1 ring-slate-200">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-mist font-display text-xl font-extrabold text-dusty-600">
                M
              </div>
              <h2 className="font-display text-2xl font-bold text-navy">Our Mission</h2>
              <p className="mt-3 text-slate-600">
                To make every school student in India financially aware, digitally
                safe and AI-ready — through inclusive, voluntary, values-driven
                assessments and awareness programs.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="rounded-2xl bg-white p-8 ring-1 ring-slate-200">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-mist font-display text-xl font-extrabold text-dusty-600">
                V
              </div>
              <h2 className="font-display text-2xl font-bold text-navy">Our Vision</h2>
              <p className="mt-3 text-slate-600">
                A generation of young Indians ready to build a Viksit Bharat by 2047 —
                confident with money, safe online and fluent in the technologies
                shaping their future.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            What We Stand For
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
            Our core values
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v) => (
            <Reveal key={v.title}>
              <div className="lift rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                <h3 className="font-display font-bold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* vs Olympiad */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">
              Aivanta vs a traditional olympiad
            </h2>
            <p className="mt-3 text-slate-300">
              One core philosophy shift makes all the difference.
            </p>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl bg-white/5 p-7 ring-1 ring-white/15">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Traditional Olympiad
                </p>
                <p className="mt-3 font-display text-xl font-bold">
                  &ldquo;Who is the best?&rdquo;
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {OLYMPIAD.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-2xl bg-white/5 p-7 ring-1 ring-white/15">
                <p className="text-sm font-semibold uppercase tracking-wider text-sky">
                  Aivanta Scholar Foundation
                </p>
                <p className="mt-3 font-display text-xl font-bold">
                  &ldquo;Is every child prepared?&rdquo;
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {AIVANTA.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand title="Partner with a movement, not just an exam." />
    </>
  );
}
