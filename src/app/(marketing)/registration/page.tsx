import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/PageHeader";
import { RegistrationForm } from "@/components/marketing/RegistrationForm";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "School Registration",
  description:
    "Register your school for the Aivanta Scholar Foundation annual assessments. Government, private, urban and rural schools welcome — voluntary participation, study material included.",
};

const STEPS = [
  { n: "1", title: "Submit a request", body: "Fill the form below — this sends your details to our team for review." },
  { n: "2", title: "Get approved", body: "An administrator verifies your school and emails you a unique school code." },
  { n: "3", title: "Claim & enrol", body: "Log in, enter your code, then enrol students for the cycle." },
];

export default function RegistrationPage() {
  const fee = siteConfig.fees.perSubject;
  return (
    <>
      <PageHeader
        eyebrow="Registration"
        title="Register Your School"
        lead="Government, private, urban and rural schools are all welcome. Voluntary participation, transparent fees, study material included."
      />

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <Reveal key={s.n}>
              <div className="rounded-2xl bg-paper p-6 ring-1 ring-slate-200">
                <span className="font-display text-3xl font-extrabold text-dusty-600">
                  {s.n}
                </span>
                <h3 className="mt-2 font-display font-bold text-navy">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + aside */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-3">
          <RegistrationForm />

          <aside className="self-start lg:sticky lg:top-28">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
              <h3 className="font-display text-sm font-bold text-navy">Need help?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Email{" "}
                <a
                  className="font-semibold text-dusty-600"
                  href={`mailto:${siteConfig.contact.email}`}
                >
                  {siteConfig.contact.email}
                </a>{" "}
                or call our coordinator team.
              </p>
            </div>
            <div className="mt-4 rounded-2xl bg-navy p-7 text-white">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-sky">
                What&apos;s included
              </h3>
              <p className="mt-3 text-sm text-slate-200">
                Every subject (₹{fee}) includes participation, free PDF study
                material, centralised evaluation and a printed certificate — with no
                hidden charges.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
