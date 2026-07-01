"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "./LanguageToggle";

/** Is this nav item the active page? Matches "/" exactly, others by prefix. */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { org, contact } = siteConfig;
  const telHref = `tel:${contact.phone.replace(/\s/g, "")}`;

  return (
    <header>
      <div className="tricolour-strip" aria-hidden="true" />

      {/* Utility bar */}
      <div className="bg-navy text-xs text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4">
          <p className="hidden font-medium tracking-wide sm:block">{org.tagline}</p>
          <div className="ml-auto flex items-center gap-4">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-1 hover:text-sky"
            >
              <MailIcon />
              <span className="hidden sm:inline">{contact.email}</span>
            </a>
            <a
              href={telHref}
              className="inline-flex items-center gap-1 hover:text-sky"
            >
              <PhoneIcon />
              {contact.phone}
            </a>
            <div className="hidden border-l border-white/20 pl-3 md:flex">
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="sticky top-0 z-40 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link
              href="/"
              className="flex shrink-0 items-center"
              aria-label={`${org.name} home`}
            >
              <Image
                src="/img/logo-aivanta.png"
                alt={org.name}
                width={180}
                height={48}
                priority
                className="h-12 w-auto"
              />
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {mainNav.map((item) => {
                  const active = isActive(pathname, item.href);
                  const base =
                    "nav-link rounded-md px-3 py-2 text-sm font-semibold transition-colors";
                  const state = active
                    ? "text-navy bg-mist"
                    : "text-slate-700 hover:text-navy hover:bg-slate-50";

                  if (item.children) {
                    return (
                      <li key={item.key} className="nav-item relative">
                        <Link
                          href={item.href}
                          className={cn(base, state, "inline-flex items-center gap-1")}
                          aria-haspopup="true"
                        >
                          {item.label}
                          <ChevronIcon />
                        </Link>
                        <div
                          className="nav-dropdown absolute left-0 top-full z-50 w-64 pt-2"
                          role="menu"
                        >
                          <div className="overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-black/5">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                role="menuitem"
                                className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-mist hover:text-navy"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.key} className="nav-item">
                      <Link href={item.href} className={cn(base, state)}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-mist sm:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/registration"
                className="hidden items-center gap-2 rounded-lg bg-orange px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-orange-600 sm:inline-flex"
              >
                Register School
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="rounded-md p-2 text-navy hover:bg-slate-100 lg:hidden"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                <BurgerIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div
          id="mobile-nav"
          className={cn("asf-mnav border-t border-slate-100 bg-white lg:hidden", {
            "is-open": mobileOpen,
          })}
        >
          {mainNav.map((item) => (
            <div key={item.key}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-slate-100 px-4 py-3 font-semibold text-slate-800"
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-slate-100 px-8 py-2.5 text-sm text-slate-600"
                >
                  – {child.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="space-y-2 p-4">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-center font-semibold text-navy ring-1 ring-slate-200"
            >
              Login
            </Link>
            <Link
              href="/registration"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg bg-orange px-4 py-3 text-center font-bold text-navy transition-colors hover:bg-orange-600"
            >
              Register School
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---- Inline icons (kept local; tiny + no dependency) ---- */
function MailIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3l2 5-2.5 1.5a11 11 0 005 5L17 12l5 2v3a2 2 0 01-2 2A16 16 0 013 5z" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}
function BurgerIcon() {
  return (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
