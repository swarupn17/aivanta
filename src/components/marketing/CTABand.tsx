import Link from "next/link";
import { ThemeBackdrop } from "@/components/marketing/ThemeBackdrop";

/**
 * Reusable call-to-action band. Appears at the foot of several pages, so it
 * lives once here instead of being copy-pasted.
 */
export function CTABand({
  title,
  subtitle,
  ctaLabel = "Register Your School",
  ctaHref = "/registration",
}: {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-navy to-navy-700 text-white">
      <ThemeBackdrop />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-14 text-center lg:flex-row lg:text-left">
        <div>
          <h2 className="font-display text-2xl font-extrabold md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-2 text-slate-200">{subtitle}</p>}
        </div>
        <Link
          href={ctaHref}
          className="shrink-0 rounded-lg bg-orange px-8 py-4 font-bold text-navy transition-colors hover:bg-orange-600"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
