"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; badge?: number };

/**
 * Persistent admin sub-navigation. Lives under the portal top bar so an admin
 * can jump between the command center, requests, schools and messages without
 * hunting for back-links. `pendingCount` drives the attention badge on Requests.
 */
export function AdminNav({ pendingCount = 0 }: { pendingCount?: number }) {
  const pathname = usePathname();

  const items: Item[] = [
    { href: "/portal", label: "Dashboard" },
    { href: "/portal/leads", label: "Requests", badge: pendingCount },
    { href: "/portal/admin/schools", label: "Schools" },
    { href: "/portal/messages", label: "Messages" },
  ];

  const isActive = (href: string) =>
    href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);

  return (
    <nav aria-label="Admin" className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors",
                active
                  ? "border-navy text-navy"
                  : "border-transparent text-slate-500 hover:text-navy"
              )}
            >
              {item.label}
              {item.badge && item.badge > 0 ? (
                <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-orange px-1.5 py-0.5 text-xs font-bold text-navy">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
