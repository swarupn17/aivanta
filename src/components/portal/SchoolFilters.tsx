"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fieldClasses } from "@/components/ui/form";

type Options = {
  years: string[];
  states: string[];
  districts: string[];
  cities: string[];
};

const LEVELS = ["year", "state", "district", "city"] as const;
type Level = (typeof LEVELS)[number];

/**
 * Cascading filters. Picking a higher level resets the lower ones (they'd no
 * longer be valid). State lives in the URL so the server page can read it.
 */
export function SchoolFilters({ options }: { options: Options }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setLevel(level: Level, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(level, value);
    else next.delete(level);
    // Reset everything below the changed level.
    const idx = LEVELS.indexOf(level);
    for (const lower of LEVELS.slice(idx + 1)) next.delete(lower);
    router.push(`/portal/admin/schools?${next.toString()}`);
  }

  // Debounced free-text search (name or code), preserves the dropdown filters.
  function onSearch(value: string) {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value.trim()) next.set("q", value.trim());
      else next.delete("q");
      router.push(`/portal/admin/schools?${next.toString()}`);
    }, 300);
  }

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const selects: { level: Level; label: string; opts: string[] }[] = [
    { level: "year", label: "Year", opts: options.years },
    { level: "state", label: "State", opts: options.states },
    { level: "district", label: "District", opts: options.districts },
    { level: "city", label: "City", opts: options.cities },
  ];

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={q}
        onChange={(e) => onSearch(e.target.value)}
placeholder="Search by school name or code…"
        className={fieldClasses}
        aria-label="Search schools"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {selects.map(({ level, label, opts }) => (
          <label key={level} className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-dusty-600">
              {label}
            </span>
            <select
              className={fieldClasses}
              value={params.get(level) ?? ""}
              onChange={(e) => setLevel(level, e.target.value)}
            >
              <option value="">All {label.toLowerCase()}s</option>
              {opts.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}
