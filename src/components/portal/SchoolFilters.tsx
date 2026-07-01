"use client";

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

  function setLevel(level: Level, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(level, value);
    else next.delete(level);
    // Reset everything below the changed level.
    const idx = LEVELS.indexOf(level);
    for (const lower of LEVELS.slice(idx + 1)) next.delete(lower);
    router.push(`/portal/admin/schools?${next.toString()}`);
  }

  const selects: { level: Level; label: string; opts: string[] }[] = [
    { level: "year", label: "Year", opts: options.years },
    { level: "state", label: "State", opts: options.states },
    { level: "district", label: "District", opts: options.districts },
    { level: "city", label: "City", opts: options.cities },
  ];

  return (
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
  );
}
