import Link from "next/link";
import type { AdminStats } from "@/features/schools/stats";
import {
  IconShieldCheck,
  IconUsers,
  IconMail,
} from "@/components/ui/icons";

const rupees = (n: number) => `\u20B9${n.toLocaleString("en-IN")}`;

/** One KPI tile. Optional href makes the whole tile a link. */
function Kpi({
  label,
  value,
  sub,
  href,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  href?: string;
  accent?: boolean;
}) {
  const inner = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-dusty-600">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-3xl font-extrabold ${
          accent ? "text-orange-600" : "text-navy"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </>
  );
  const cls =
    "rounded-2xl bg-white p-5 ring-1 ring-slate-200" +
    (href ? " lift block" : "") +
    (accent ? " ring-orange/40" : "");
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

const QUICK = [
  { href: "/portal/leads", label: "Review requests", body: "Approve schools & issue codes.", Icon: IconShieldCheck },
  { href: "/portal/admin/schools", label: "Manage schools", body: "Browse, edit, manage students.", Icon: IconUsers },
  { href: "/portal/messages", label: "Contact messages", body: "Read enquiries from the site.", Icon: IconMail },
];

export function AdminDashboard({
  stats,
  name,
}: {
  stats: AdminStats;
  name: string;
}) {
  const { leads, schools, students, enrolments, revenue, recentPending } = stats;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-dusty-600">
        Command center
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-navy">
        Welcome, {name}
      </h1>
      <p className="mt-2 text-slate-600">
        Everything you need to run the programme, at a glance.
      </p>

      {/* KPI grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi
          label="Pending requests"
          value={String(leads.pending)}
          sub={leads.pending > 0 ? "Awaiting your review" : "All caught up"}
          href="/portal/leads"
          accent={leads.pending > 0}
        />
        <Kpi
          label="Approved schools"
          value={String(schools.approved)}
          sub={`${schools.total} total in system`}
          href="/portal/admin/schools"
        />
        <Kpi label="Students" value={students.toLocaleString("en-IN")} sub="Across all schools" />
        <Kpi
          label="Subject enrolments"
          value={enrolments.total.toLocaleString("en-IN")}
          sub={`${enrolments.paid.toLocaleString("en-IN")} paid`}
        />
        <Kpi
          label="Revenue collected"
          value={rupees(revenue.collectedRupees)}
          sub={`of ${rupees(revenue.estimatedRupees)} estimated`}
        />
        <Kpi
          label="Fee per subject"
          value={rupees(revenue.perSubject)}
          sub="Current cycle"
        />
      </div>

      {/* Needs attention */}
      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dusty-600">
            Needs attention
          </h2>
          {leads.pending > 0 && (
            <Link href="/portal/leads" className="text-sm font-semibold text-navy hover:underline">
              Review all →
            </Link>
          )}
        </div>
        {recentPending.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700">
              <IconShieldCheck className="h-5 w-5" />
            </span>
            <p className="text-sm text-slate-600">
              No pending requests. You&apos;re all caught up.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
            {recentPending.map((l, i) => (
              <Link
                key={l.id}
                href="/portal/leads"
                className={`flex items-center justify-between gap-3 bg-white px-5 py-4 hover:bg-mist ${
                  i > 0 ? "border-t border-slate-100" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-navy">{l.school_name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {[l.city, l.state].filter(Boolean).join(", ") || "—"} ·{" "}
                    {l.applicant_name}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-orange px-3 py-1 text-xs font-bold text-navy">
                  Review
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Quick links */}
      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-dusty-600">
          Quick actions
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="lift rounded-2xl bg-white p-6 ring-1 ring-slate-200"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist text-navy">
                <c.Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-navy">{c.label}</h3>
              <p className="mt-1 text-sm text-slate-600">{c.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
