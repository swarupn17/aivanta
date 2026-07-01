import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/features/auth/queries";
import { canApprove } from "@/features/schools/queries";
import { getSchoolById } from "@/features/schools/admin";
import { listRoster, summarise } from "@/features/students/queries";
import { SchoolEditForm } from "@/components/portal/SchoolEditForm";
import { AdminStudentTable } from "@/components/portal/AdminStudentTable";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Manage school" };

const SUBJECT_LABEL: Record<string, string> = { fia: "FIA", cia: "CIA", aia: "AIA" };

export default async function AdminSchoolDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!canApprove(user?.profile?.role)) redirect("/portal");

  const { id } = await params;
  const school = await getSchoolById(id);
  if (!school) notFound();

  const roster = await listRoster(id);
  const fees = summarise(roster, siteConfig.fees.perSubject);

  return (
    <div>
      <Link
        href="/portal/admin/schools"
        className="text-sm font-semibold text-dusty-600 hover:underline"
      >
        ← All schools
      </Link>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-navy">
        {school.name}
      </h1>
      <p className="mt-1 text-slate-600">
        {[school.city, school.district, school.state].filter(Boolean).join(", ") || "—"}
        {school.school_code ? ` · Code ${school.school_code}` : ""}
      </p>

      {/* Fee + exam summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-navy p-5 text-white">
          <p className="text-xs text-slate-200">Total payable</p>
          <p className="font-display text-2xl font-extrabold">
            ₹{fees.totalRupees.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-300">{fees.totalEnrolments} enrolments</p>
        </div>
        {fees.bySubject.map((b) => (
          <div key={b.subject} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <p className="font-display text-2xl font-extrabold text-navy">{b.count}</p>
            <p className="text-xs text-slate-500">{SUBJECT_LABEL[b.subject]} students</p>
          </div>
        ))}
      </div>

      {/* Classwise */}
      {fees.byClass.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-mist text-left text-xs uppercase tracking-wider text-dusty-600">
              <tr>
                <th className="p-3">Class</th>
                <th className="p-3">Students</th>
                <th className="p-3">Enrolments</th>
              </tr>
            </thead>
            <tbody>
              {fees.byClass.map((c) => (
                <tr key={c.classLevel} className="border-t border-slate-100">
                  <td className="p-3 font-semibold text-navy">Class {c.classLevel}</td>
                  <td className="p-3">{c.students}</td>
                  <td className="p-3">{c.enrolments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <SchoolEditForm school={school} />
      </div>

      <div className="mt-6">
        <AdminStudentTable schoolId={id} roster={roster} />
      </div>
    </div>
  );
}
