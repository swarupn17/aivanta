import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/marketing/PageHeader";
import { CTABand } from "@/components/marketing/CTABand";
import { Reveal } from "@/components/ui/Reveal";
import { SUBJECT_ICONS } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Assessments",
  description:
    "Three annual assessments for Classes 1–10: Financial Intelligence (FIA), Cyber Intelligence (CIA) and Artificial Intelligence (AIA). 50 MCQs, 100 marks, trilingual, ₹150 per subject.",
};

const PATTERN = [
  { big: "50", label: "MCQs per subject" },
  { big: "2", label: "marks per question" },
  { big: "100", label: "total marks" },
  { big: "3", label: "languages in one paper" },
];

type Sample = { classLabel: string; question: string; options: string[]; correct: number };

const SUBJECTS = [
  {
    id: "fia",
    accent: "subj-fia",
    img: "/img/subject-fia.png",
    alt: "FIA — Financial Intelligence Assessment",
    intro:
      'From "what is a coin" in Class 1 to banking, taxes, investing, fintech and India\'s economic vision in Class 10 — each grade adds a new financial layer, building money-smart, scam-proof citizens.',
    topics: [
      "Money, needs vs wants, saving",
      "Banking & digital payments",
      "Budgeting & smart spending",
      "Fraud prevention & ethics",
      "Investing & financial planning",
      "Fintech & economic vision",
    ],
    sample: {
      classLabel: "Class 5",
      question: "You get ₹100 pocket money. What is the wisest first step?",
      options: [
        "Spend it all on snacks",
        "Save a part before spending",
        "Lend it to a stranger",
        "Hide it and forget it",
      ],
      correct: 1,
    } satisfies Sample,
  },
  {
    id: "cia",
    accent: "subj-cia",
    img: "/img/subject-cia.png",
    alt: "CIA — Cyber Intelligence Assessment",
    intro:
      "From screen safety and online strangers in Class 1 to deepfakes, cyber law and digital rights in Class 10 — always age-appropriate, testing what students would actually do in a situation.",
    topics: [
      "Screen time & safe content",
      "Personal information & privacy",
      "Passwords & safe browsing",
      "Cyber threats & fraud",
      "Digital ethics & rights",
      "Deepfakes & cyber law",
    ],
    sample: {
      classLabel: "Class 7",
   question: "An SMS says you won ₹10 lakh — click a link to claim. What do you do?",
      options: [
        "Click immediately",
        "Share your OTP to verify",
        "Ignore and report it as spam",
        "Forward it to friends",
      ],
      correct: 2,
    } satisfies Sample,
  },
  {
    id: "aia",
    accent: "subj-aia",
    img: "/img/subject-aia.png",
    alt: "AIA — Artificial Intelligence Assessment",
    intro:
      'From "helpful machines" and robots in stories in Class 1 to machine learning, neural networks, generative AI and India\'s AI policy in Class 10 — one of the most forward-looking school syllabi in India.',
    topics: [
      "Helpful & smart machines",
      "How computers think",
      "AI in everyday life",
      "Machine learning basics",
      "Generative AI & ethics",
      "India's AI policy & future",
    ],
    sample: {
      classLabel: "Class 9",
      question: "Which of these is the best everyday example of AI?",
      options: [
        "A calculator adding numbers",
        "A phone suggesting your next word",
        "A torch turning on",
        "A wall clock ticking",
      ],
      correct: 1,
    } satisfies Sample,
  },
];

const FEE_ROWS = [
  ["1 subject", "₹150"],
  ["2 subjects", "₹300"],
  ["All 3 subjects", "₹450"],
];

const INCLUDES = [
  "Examination participation",
  "Free PDF study material",
  "Central evaluation & result processing",
  "Physical printed certificate per subject",
  "Merit certificates & medals for top performers",
  "Scholarships & mentorship for Classes 9–10",
];

function SampleCard({ sample }: { sample: Sample }) {
  return (
    <div className="rounded-2xl bg-white p-8 ring-1 ring-slate-200">
      <p className="text-sm font-semibold text-slate-500">
        Sample question · {sample.classLabel}
      </p>
      <p className="mt-2 font-display font-bold text-navy">{sample.question}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {sample.options.map((opt, i) => (
          <li
            key={opt}
            className={
              i === sample.correct
                ? "rounded-lg bg-green-50 px-4 py-2.5 font-semibold text-green-800 ring-1 ring-green-300"
                : "rounded-lg bg-slate-50 px-4 py-2.5 ring-1 ring-slate-200"
            }
          >
            {String.fromCharCode(65 + i)}. {opt}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubjectBlock({ subject, index }: { subject: (typeof SUBJECTS)[number]; index: number }) {
  const flip = index === 1; // CIA has the sample card on the left
  const shaded = index % 2 === 0;

  const detail = (
    <Reveal className={subject.accent}>
      <Image src={subject.img} alt={subject.alt} width={120} height={80} className="h-20 w-auto" />
      <div className="mt-4 flex gap-3" style={{ color: "var(--accent)" }}>
        {SUBJECT_ICONS[subject.id.toUpperCase() as "FIA" | "CIA" | "AIA"].map((Ic, i) => (
          <span key={i} className="grid h-11 w-11 place-items-center rounded-xl bg-mist">
            <Ic className="h-6 w-6" />
          </span>
        ))}
      </div>
      <p className="mt-4 text-slate-600">{subject.intro}</p>
      <ul className="mt-5 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        {subject.topics.map((t) => (
          <li key={t} className="flex gap-2">
            <span style={{ color: "var(--accent)" }}>•</span> {t}
          </li>
        ))}
      </ul>
      <Link href="/syllabus" className="mt-6 inline-block font-bold text-dusty-600 hover:underline">
        See class-wise syllabus →
      </Link>
    </Reveal>
  );

  return (
    <section id={subject.id} className={`scroll-mt-24 ${shaded ? "bg-paper" : ""}`}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        {flip ? (
          <>
            <Reveal className="order-2 lg:order-1">
              <SampleCard sample={subject.sample} />
            </Reveal>
            <div className="order-1 lg:order-2">{detail}</div>
          </>
        ) : (
          <>
            {detail}
            <Reveal>
              <SampleCard sample={subject.sample} />
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}

export default function AssessmentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Assessments"
        title="The Three Assessments"
        lead="Awareness, skills and values for Classes 1–10 — same pattern, ten depths, three future-ready subjects."
      />

      {/* Common pattern */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            Examination Pattern
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
            Common across all subjects
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {PATTERN.map((p) => (
            <Reveal key={p.label}>
              <div className="rounded-2xl bg-paper p-6 text-center ring-1 ring-slate-200">
                <p className="font-display text-3xl font-extrabold text-navy">{p.big}</p>
                <p className="mt-1 text-sm text-slate-600">{p.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          School-level · annual cycle · trilingual (English + Hindi + Marathi) ·
          case-study MCQs for Classes 9–10.
        </p>
      </section>

      {SUBJECTS.map((s, i) => (
        <SubjectBlock key={s.id} subject={s} index={i} />
      ))}

      {/* Fee + includes */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            Fee Structure
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy">
            Transparent &amp; all-inclusive
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-slate-200">
            <table className="w-full text-left">
              <thead className="bg-navy text-sm text-white">
                <tr>
                  <th className="px-5 py-3 font-semibold">Subjects chosen</th>
                  <th className="px-5 py-3 text-right font-semibold">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {FEE_ROWS.map(([label, fee], i) => (
                  <tr key={label} className={i === 1 ? "bg-slate-50" : ""}>
                    <td className="px-5 py-3">{label}</td>
                    <td className="px-5 py-3 text-right font-bold text-navy">{fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            No hidden charges. Voluntary participation — appear for any one, two or
            all three subjects.
          </p>
        </Reveal>
        <Reveal>
          <div className="rounded-2xl bg-navy p-8 text-white">
            <h2 className="font-display text-2xl font-bold">What every student receives</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {INCLUDES.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="shrink-0 text-sky">
                    <svg className="mt-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <CTABand title="Enrol your students this cycle." />
    </>
  );
}
