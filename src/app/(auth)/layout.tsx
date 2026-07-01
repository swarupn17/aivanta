import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * Minimal centered layout for auth pages (no marketing header/footer).
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <div className="tricolour-strip" aria-hidden="true" />
      <header className="mx-auto w-full max-w-7xl px-4 py-5">
        <Link href="/" aria-label={`${siteConfig.org.name} home`}>
          <Image
            src="/img/logo-aivanta.png"
            alt={siteConfig.org.name}
            width={170}
            height={46}
            className="h-11 w-auto"
            priority
          />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {siteConfig.org.name}
      </footer>
    </div>
  );
}
