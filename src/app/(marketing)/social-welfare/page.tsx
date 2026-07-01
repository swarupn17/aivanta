import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/PageHeader";
import { CTABand } from "@/components/marketing/CTABand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Social Welfare",
  description:
    "Our Social Welfare initiative powers scholarships, free workshops, awareness drives and study-material kits for the students who need them most.",
};

const PROGRAMS = [
  { title: "Merit Scholarships", body: "Cash scholarships for top students from government schools — with preference for girls and rural students." },
  { title: "Free Awareness Workshops", body: "Sessions on financial fraud, cyber safety and AI literacy in Zilla Parishad and rural schools." },
  { title: "Free Study-Material Kits", body: "Printed kits for students from economically weaker sections whose families cannot afford the fee." },
  { title: "Community Awareness Camps", body: "UPI fraud, digital safety and government schemes — for parents and families in rural areas." },
  { title: "Teacher Training", body: "Equipping government school teachers to deliver financial and cyber awareness in their own classrooms." },
  { title: "Women & Girls Empowerment", body: "Sessions on financial independence, digital banking and online safety across villages." },
];

const IMPACT = [
  { big: "20", label: "scholarships" },
  { big: "5", label: "workshops" },
  { big: "300", label: "free kits" },
];

export default function SocialWelfarePage() {
  return (
    <>
      <PageHeader
        eyebrow="Social Welfare"
        title="Our Social Commitment"
        lead="Through our Social Welfare initiative we deliver scholarships, free workshops, awareness drives and study materials to the students and communities who need them most."
      />

      {/* Programs */}
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
              Our Programs
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-navy md:text-4xl">
              Our welfare programs in action
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((p) => (
              <Reveal key={p.title}>
                <div className="lift rounded-2xl bg-white p-7 ring-1 ring-slate-200">
                  <h3 className="font-display text-xl font-bold text-navy">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CSR pitch */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-wider text-dusty-600">
            For Corporate Partners
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-navy">
            Measurable CSR impact
          </h2>
          <p className="mt-4 text-slate-600">
            Every ₹1 lakh in CSR funding translates into roughly 20 student
            scholarships, 5 awareness workshops and 300 free study-material kits. We
            publish an annual Community Impact Report so partners can see exactly how
            their money was used.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-navy px-6 py-3.5 font-bold text-white transition-colors hover:bg-navy-700"
          >
            Become a CSR Partner
          </a>
        </Reveal>
        <Reveal className="grid grid-cols-3 gap-4 text-center">
          {IMPACT.map((i) => (
            <div key={i.label} className="rounded-2xl bg-paper p-6 ring-1 ring-slate-200">
              <p className="font-display text-2xl font-extrabold text-navy">{i.big}</p>
              <p className="mt-1 text-xs text-slate-600">{i.label}</p>
            </div>
          ))}
          <div className="col-span-3 rounded-2xl bg-navy p-6 text-white">
            <p className="text-sm">
              …from every <span className="font-bold text-sky">₹1 lakh</span> of
              CSR funding.
            </p>
          </div>
        </Reveal>
      </section>

      <CTABand
        title="Help us reach the students who need it most."
        ctaLabel="Partner With Us"
        ctaHref="/contact"
      />
    </>
  );
}
