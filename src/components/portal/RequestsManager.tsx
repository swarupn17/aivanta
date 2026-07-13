"use client";

import { useMemo, useState } from "react";
import { LeadRow } from "@/components/portal/LeadRow";
import type { LeadRowData } from "@/features/schools/queries";
import { fieldClasses } from "@/components/ui/form";

export type LeadWithCode = LeadRowData & { code: string | null };

type TabKey = "pending" | "approved" | "rejected" | "all";
const TABS: { key: TabKey; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

/**
 * Requests workbench. Status tabs (with counts) + a search box so an admin can
 * find any request instantly instead of scrolling a wall of cards. Approved
 * rows carry their school code (resolved server-side) so it survives reloads.
 */
export function RequestsManager({ leads }: { leads: LeadWithCode[] }) {
  const [tab, setTab] = useState<TabKey>("pending");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      pending: leads.filter((l) => l.status === "pending").length,
      approved: leads.filter((l) => l.status === "approved").length,
      rejected: leads.filter((l) => l.status === "rejected").length,
      all: leads.length,
    }),
    [leads]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (tab !== "all" && l.status !== tab) return false;
      if (!q) return true;
      return [
        l.school_name,
        l.applicant_name,
        l.applicant_email,
        l.school_email,
        l.city,
        l.district,
        l.state,
        l.code,
      ]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q));
    });
  }, [leads, tab, query]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-mist p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-navy"
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs text-slate-400">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by school, applicant, email, city or code…"
          className={fieldClasses}
          aria-label="Search requests"
        />
      </div>

      {/* Results */}
      <p className="mt-4 text-sm text-slate-500">
        {visible.length} {visible.length === 1 ? "request" : "requests"}
        {query ? " match your search" : ""}
      </p>

      {visible.length === 0 ? (
        <p className="mt-3 rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
          {query ? "Nothing matches your search." : "Nothing here yet."}
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {visible.map((l) => (
            <LeadRow key={l.id} lead={l} initialCode={l.code} />
          ))}
        </div>
      )}
    </div>
  );
}
