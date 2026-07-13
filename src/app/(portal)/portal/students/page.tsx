import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/queries";
import { getMySchool } from "@/features/schools/queries";
import { listRoster, summarise } from "@/features/students/queries";
import { StudentUploader } from "@/components/portal/StudentUploader";
import { RosterTable } from "@/components/portal/RosterTable";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Students & enrolments" };

const SUBJECT_LABEL: Record<string, string> = { fia: "FIA", cia: "CIA", aia: "AIA" };

export default async function StudentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/portal/students");

  const school = await getMySchool(user.id);
  if (!school) {
    return (
      <div>
        <Link href="/portal" className="text-sm font-semibold text-dusty-600 hover:underline">
          ← Dashboard
        </Link>
        <div className="mt-6 rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
          <h1 className="font-display text-2xl font-extrabold text-navy">
            Claim your school first
          </h1>
          <p className="mt-2 text-slate-600">
            Enter the code an admin issued you on the dashboard to unlock student
            enrolment.
          </p>
          <Link
            href="/portal"
            className="mt-4 inline-block rounded-lg bg-orange px-6 py-3 font-bold text-navy hover:bg-orange-600"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const s = school as { id: string; name: string };
  const roster = await listRoster(s.id);
  const fees = summarise(roster, siteConfig.fees.perSubject);

  return (
    <div>
      <Link href="/portal" className="text-sm font-semibold text-dusty-600 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-navy">
        Students & enrolments
      </h1>
      <p className="mt-1 text-slate-600">{s.name}</p>

      <div className="mt-6">
        <StudentUploader />
      </div>

      {/* Fee summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-navy p-6 text-white">
          <p className="text-sm text-slate-200">Total payable</p>
          <p className="font-display text-3xl font-extrabold">
            ₹{fees.totalRupees.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-slate-300">
            {fees.totalEnrolments} enrolments × ₹{fees.perSubjectRupees}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:col-span-2">
          <p className="mb-2 text-sm font-semibold text-dusty-600">By subject</p>
          <div className="flex gap-6">
            {fees.bySubject.map((b) => (
              <div key={b.subject}>
                <p className="font-display text-2xl font-extrabold text-navy">{b.count}</p>
                <p className="text-xs text-slate-500">{SUBJECT_LABEL[b.subject]}</p>
              </div>
            ))}
          </div>
        </div>
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

      {/* Roster */}
      <div className="mt-10">
        <RosterTable roster={roster} />
      </div>
    </div>
  );
}
