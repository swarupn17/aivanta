import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/queries";
import { signOut } from "@/features/auth/actions";
import { siteConfig } from "@/config/site";

/**
 * Portal layout — authenticated area. Server-side guard (defense in depth on top
 * of middleware). Shows a slim top bar with the signed-in identity + sign out.
 */
export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/portal");

  const role = user.profile?.role ?? "student";

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <div className="tricolour-strip" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/portal" aria-label={`${siteConfig.org.name} portal`}>
            <Image
              src="/img/logo-aivanta.png"
              alt={siteConfig.org.name}
              width={150}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:inline">
              {user.email}
            </span>
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold capitalize text-navy">
              {role.replace("_", " ")}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-dusty-600 ring-1 ring-slate-200 transition-colors hover:bg-mist"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
