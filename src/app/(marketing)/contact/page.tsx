import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/PageHeader";
import { CTABand } from "@/components/marketing/CTABand";
import { ContactForm } from "@/components/marketing/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Aivanta Scholar Foundation for school registration, partnerships, CSR funding and general queries.",
};

export default function ContactPage() {
  const { contact } = siteConfig;
  const cards = [
    { title: "Head Office", value: contact.place },
    { title: "Email", value: contact.email, href: `mailto:${contact.email}` },
    {
      title: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    },
    { title: "Website", value: contact.site },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        lead="Questions about registration, partnerships or CSR? We would love to hear from you."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-3">
        <div className="space-y-4">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl bg-paper p-6 ring-1 ring-slate-200"
            >
              <h2 className="font-display font-bold text-navy">{c.title}</h2>
              {c.href ? (
                <a
                  href={c.href}
                  className="mt-2 inline-block text-sm font-semibold text-dusty-600"
                >
                  {c.value}
                </a>
              ) : (
                <p className="mt-2 text-sm text-slate-600">{c.value}</p>
              )}
            </div>
          ))}
        </div>

        <ContactForm />
      </section>

      <CTABand
        title="Ready to register your school?"
        ctaLabel="Start Registration"
      />
    </>
  );
}
