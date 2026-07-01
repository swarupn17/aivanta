import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/queries";
import { canApprove } from "@/features/schools/queries";
import {
  getAdminSchools,
  applyFilters,
  filterOptions,
  type SchoolFilters as Filters,
} from "@/features/schools/admin";
import { SchoolFilters } from "@/components/portal/SchoolFilters";

export const metadata = { title: "Schools" };

export default async function AdminSchoolsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!canApprove(user?.profile?.role)) redirect("/portal");

  const sp = await searchParams;
  const filters: Filters = {
    year: sp.year,
    state: sp.state,
    district: sp.district,
    city: sp.city,
  };

  const all = await getAdminSchools();
  const options = filterOptions(all, filters);
  const schools = applyFilters(all, filters);
  const totalStudents = schools.reduce((n, s) => n + s.students, 0);

  return (
    <div>
      <Link href="/portal" className="text-sm font-semibold text-dusty-600 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-navy">Schools</h1>
      <p className="mt-1 text-slate-600">
        Filter by Year → State → District → City, then open a school to manage its
        classes and students.
      </p>

      <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <SchoolFilters options={options} />
      </div>

      <p className="mt-4 text-sm text-slate-600">
        <span className="font-semibold text-navy">{schools.length}</span> schools ·{" "}
        <span className="font-semibold text-navy">{totalStudents}</span> students
      </p>

      <div className="mt-3 overflow-x-auto rounded-2xl ring-1 ring-slate-200">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-mist text-left text-xs uppercase tracking-wider text-dusty-600">
            <tr>
              <th className="p-3">School</th>
              <th className="p-3">Location</th>
              <th className="p-3">Year</th>
              <th className="p-3">Code</th>
              <th className="p-3">Students</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {schools.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  No schools match these filters.
                </td>
              </tr>
            ) : (
              schools.map((s) => (
                <tr key={s.id} className="border-t border-slate-100 bg-white">
                  <td className="p-3 font-medium text-navy">{s.name}</td>
                  <td className="p-3 text-slate-600">
                    {[s.city, s.district, s.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="p-3">{s.academic_year}</td>
                  <td className="p-3 font-mono text-xs">{s.school_code ?? "—"}</td>
                  <td className="p-3">{s.students}</td>
                  <td className="p-3 capitalize">{s.status}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/portal/admin/schools/${s.id}`}
                      className="text-xs font-semibold text-dusty-600 hover:underline"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
