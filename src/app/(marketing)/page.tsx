import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { Ticker } from "@/components/marketing/Ticker";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import {
  IconShieldCheck,
  IconUsers,
  IconLanguages,
  IconGlobe,
  IconClipboard,
  IconBookOpen,
  IconDownload,
  IconMail,
  IconCertificate,
  SUBJECT_ICONS,
} from "@/components/ui/icons";

const TRUST_ITEMS = [
  { title: "Section 8 Non-Profit", sub: "Registered Foundation", Icon: IconShieldCheck },
  { title: "Govt & Private Schools", sub: "Urban & rural, equal access", Icon: IconUsers },
  { title: "Trilingual Papers", sub: "English · Hindi · Marathi", Icon: IconLanguages },
  { title: "Viksit Bharat 2047", sub: "National mission aligned", Icon: IconGlobe },
];

const QUICK_LINKS = [
  { href: "/registration", label: "Register School", Icon: IconClipboard, tone: "bg-mist text-navy" },
  { href: "/syllabus", label: "Syllabus", Icon: IconBookOpen, tone: "bg-mist text-navy" },
  { href: "/publications", label: "Study Material", Icon: IconDownload, tone: "bg-mist text-navy" },
  { href: "/assessments", label: "Sample Papers", Icon: IconCertificate, tone: "bg-mist text-navy" },
  { href: "/contact", label: "Contact", Icon: IconMail, tone: "bg-mist text-navy" },
];

const PILLARS = [
  { Icon: IconClipboard, title: "Annual Assessments", tone: "bg-mist text-navy", body: "FIA, CIA & AIA for Classes 1–10. 50 MCQs, 100 marks, trilingual, ₹150 per subject — study material included free." },
  { Icon: IconUsers, title: "Social Welfare", tone: "bg-mist text-navy", body: "Scholarships, free workshops and awareness drives delivered to students and communities who need them most across Maharashtra." },
  { Icon: IconBookOpen, title: "Publications & Courses", tone: "bg-mist text-navy", body: "Class-wise study books, parent & teacher handbooks, and digital courses — distributed free and at fair price." },
];

const SUBJECTS = [
  { key: "FIA" as const, img: "/img/subject-fia.png", alt: "FIA — Financial Intelligence Assessment", bar: "bg-navy", link: "text-navy", href: "/assessments#fia", body: "Money, savings, banking and economic sense — building money-smart, scam-proof citizens from Class 1 to 10." },
  { key: "CIA" as const, img: "/img/subject-cia.png", alt: "CIA — Cyber Intelligence Assessment", bar: "bg-dusty-600", link: "text-dusty-600", href: "/assessments#cia", body: "Internet safety, digital ethics and responsible online behaviour — teaching children what to actually do online." },
  { key: "AIA" as const, img: "/img/subject-aia.png", alt: "AIA — Artificial Intelligence Assessment", bar: "bg-dusty", link: "text-dusty-600", href: "/assessments#aia", body: "AI concepts, machine-learning basics and future-ready thinking — one of India's most forward-looking school syllabi." },
];

const STATS = [
  { count: 10, suffix: "", label: "Classes Covered (1–10)" },
  { count: 3, suffix: "", label: "Future-Ready Subjects" },
  { count: 3, suffix: "", label: "Languages per Paper" },
  { count: 100, suffix: "%", label: "Students Get Certificates" },
];

const WHY_POINTS = [
  { strong: "Voluntary participation", rest: " — pick any one, two or all three subjects. No pressure, ever." },
  { strong: "No hidden charges", rest: " — one fee of ₹150 per subject, study material included." },
  { strong: "Equal access", rest: " — government, private, urban and rural schools all welcome." },
  { strong: "Real-world focus", rest: " — awareness, skills and values over rote memorisation." },
];

const WHY_STATS = [
  { big: "₹150", sub: "per subject — all-inclusive", offset: "" },
  { big: "50", sub: "MCQs · 2 marks each", offset: "mt-6" },
  { big: "3", sub: "languages per paper", offset: "" },
  { big: "1×", sub: "annual exam cycle", offset: "mt-6" },
];

const NEWS = [
  { tag: "25 Jun 2025 · Registration", title: "Cycle 2025–26 registrations now open", body: "Schools across Maharashtra can now enrol for the pilot assessment cycle." },
  { tag: "18 Jun 2025 · Scholarships", title: "Class 9–10 merit scholarships announced", body: "Top performers eligible for cash awards, mentorship and recognition." },
  { tag: "10 Jun 2025 · Publications", title: "Class 1 study material released", body: "Print-ready, child-friendly material covering all three subjects." },
];

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <Ticker />

      {/* Trust strip */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 text-center md:grid-cols-4">
          {TRUST_ITEMS.map((t) => (
            <div key={t.title} className="flex flex-col items-center gap-1">
              <span className="mb-1 grid h-11 w-11 place-items-center rounded-full bg-mist text-navy">
                <t.Icon className="h-6 w-6" />
              </span>
              <p className="text-sm font-bold leading-tight text-navy">{t.title}</p>
              <p className="text-xs text-slate-500">{t.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="lift rounded-xl bg-white p-5 text-center ring-1 ring-slate-200"
            >
              <div
                className={`mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl ${q.tone}`}
              >
                <q.Icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-navy">{q.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Three pillars */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
              Who We Are
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
              A movement, not a competition
            </h2>
            <p className="mt-4 text-slate-600">
              We measure readiness, not rank. Aivanta Scholar Foundation works
              across three pillars to prepare every Indian child for the future.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PILLARS.map((p) => (
              <Reveal key={p.title}>
                <div className="lift rounded-2xl bg-white p-7 ring-1 ring-slate-200">
                  <div
                    className={`mb-4 grid h-12 w-12 place-items-center rounded-xl ${p.tone}`}
                  >
                    <p.Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Three subjects */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            The Assessments
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
            Three skills every child needs
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SUBJECTS.map((s) => (
            <Reveal key={s.key}>
              <article className="lift overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                <div className={`h-2 ${s.bar}`} />
                <div className="p-7 text-center">
                  <Image
                    src={s.img}
                    alt={s.alt}
                    width={140}
                    height={112}
                    className="mx-auto h-28 w-auto"
                  />
                  <div className={`mt-4 flex justify-center gap-4 ${s.link}`}>
                    {SUBJECT_ICONS[s.key].map((Ic, i) => (
                      <span
                        key={i}
                        className="grid h-10 w-10 place-items-center rounded-full bg-mist"
                      >
                        <Ic className="h-5 w-5" />
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-slate-600">{s.body}</p>
                  <Link
                    href={s.href}
                    className={`mt-4 inline-block text-sm font-bold hover:underline ${s.link}`}
                  >
                    Learn more →
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-16 text-center lg:grid-cols-4">
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <p className="font-display text-4xl font-extrabold text-sky md:text-5xl">
                <AnimatedCounter value={s.count} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-slate-300">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why ASF */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            Why Aivanta
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
            Different by design
          </h2>
          <p className="mt-4 text-slate-600">
            A traditional olympiad asks &ldquo;who is the best?&rdquo; We ask
            &ldquo;is every child prepared for the future?&rdquo;
          </p>
          <ul className="mt-6 space-y-4">
            {WHY_POINTS.map((p) => (
              <li key={p.strong} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mist text-dusty-600">
                  <CheckIcon />
                </span>
                <span className="text-slate-700">
                  <strong className="text-navy">{p.strong}</strong>
                  {p.rest}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/about"
            className="mt-8 inline-block rounded-lg bg-navy px-6 py-3.5 font-bold text-white transition-colors hover:bg-navy-700"
          >
            More About Us
          </Link>
        </Reveal>
        <Reveal className="grid grid-cols-2 gap-4">
          {WHY_STATS.map((s) => (
            <div
              key={s.sub}
              className={`rounded-2xl bg-paper p-6 ring-1 ring-slate-200 ${s.offset}`}
            >
              <p className="font-display text-3xl font-extrabold text-navy">{s.big}</p>
              <p className="mt-1 text-sm text-slate-600">{s.sub}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* News */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
                Latest
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
                News &amp; Notices
              </h2>
            </div>
            <Link
              href="/social-welfare"
              className="text-sm font-bold text-navy hover:underline"
            >
              View all →
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {NEWS.map((n) => (
              <Reveal key={n.title}>
                <article className="lift overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                  <p className="text-xs font-semibold text-dusty-600">{n.tag}</p>
                  <h3 className="mt-2 font-display text-lg font-bold text-navy">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{n.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-gradient-to-r from-navy to-navy-700 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-16 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="font-display text-3xl font-extrabold">
              Ready to prepare your students for the future?
            </h2>
            <p className="mt-2 text-slate-200">
              Join the movement. Register your school for Assessment Cycle 2025–26
              today.
            </p>
          </div>
          <Link
            href="/registration"
            className="shrink-0 rounded-lg bg-orange px-8 py-4 font-bold text-navy transition-colors hover:bg-orange-600"
          >
            Register Your School
          </Link>
        </div>
      </section>
    </>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
