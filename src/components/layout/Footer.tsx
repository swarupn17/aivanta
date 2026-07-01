import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/navigation";

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export function Footer() {
  const { org, contact, social, legal } = siteConfig;
  const telHref = `tel:${contact.phone.replace(/\s/g, "")}`;
  const activeSocials = Object.entries(social).filter(([, url]) => url);

  return (
    <footer className="bg-navy-900 text-white">
      <div className="tricolour-strip" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <span className="inline-flex rounded-xl bg-white px-3 py-2.5 shadow-sm">
              <Image
                src="/img/logo-aivanta.png"
                alt={org.name}
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-300">
            A national student awareness initiative preparing school students to
            become financially aware, digitally safe, and AI-ready citizens —
            aligned with the vision of{" "}
            <span className="font-semibold text-sky">
              Viksit Bharat 2047
            </span>
            .
          </p>
          <div className="mt-5 flex items-center gap-3">
            {activeSocials.map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SOCIAL_LABELS[key] ?? key} (opens in a new tab)`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-navy hover:text-white"
              >
                <span className="text-xs font-bold uppercase">{key[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {[footerNav.assessments, footerNav.foundation].map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">
              {col.title}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-300 transition-colors hover:text-sky"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">
            Reach Us
          </h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>{contact.place}</li>
            <li>
              <a className="hover:text-sky" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </li>
            <li>
              <a className="hover:text-sky" href={telHref}>
                {contact.phone}
              </a>
            </li>
            <li>{contact.site}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {org.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-4">
            <Link href={legal.privacy} className="hover:text-sky">
              Privacy Policy
            </Link>
            <Link href={legal.terms} className="hover:text-sky">
              Terms of Use
            </Link>
            <Link href="/contact" className="hover:text-sky">
              Contact
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
