import Link from "next/link";
import { getCurrentUser } from "@/features/auth/queries";
import { canApprove, getMySchool } from "@/features/schools/queries";
import { getAdminStats } from "@/features/schools/stats";
import { AdminDashboard } from "@/components/portal/AdminDashboard";
import {
  IconClipboard,
  IconUsers,
  IconCertificate,
  IconGrowthChart,
  IconBookOpen,
  IconShieldCheck,
} from "@/components/ui/icons";
import type { Profile } from "@/lib/db/schema";

type Role = NonNullable<Profile["role"]>;

const ACTIONS: Record<Role, { title: string; body: string; href: string; Icon: typeof IconUsers }[]> = {
  school: [
    { title: "Enrol students", body: "Import a CSV or add students, then see the fee total.", href: "/portal/students", Icon: IconUsers },
    { title: "Registrations", body: "Review your subject registrations & fees.", href: "/portal/students", Icon: IconClipboard },
    { title: "Hall tickets", body: "Download admit cards once payment clears.", href: "/portal", Icon: IconCertificate },
  ],
  coordinator: [
    { title: "My schools", body: "Track your recruited schools' pipeline.", href: "/portal", Icon: IconUsers },
    { title: "Commissions", body: "See earnings and request payouts.", href: "/portal", Icon: IconGrowthChart },
  ],
  admin: [
    { title: "Review requests", body: "Approve schools & generate their codes.", href: "/portal/leads", Icon: IconShieldCheck },
    { title: "Schools", body: "Browse Year>State>District>City and manage students.", href: "/portal/admin/schools", Icon: IconUsers },
    { title: "Results", body: "Upload OMR data and publish results.", href: "/portal", Icon: IconGrowthChart },
  ],
  super_admin: [
    { title: "Review requests", body: "Approve schools & generate their codes.", href: "/portal/leads", Icon: IconShieldCheck },
    { title: "Schools", body: "Browse Year>State>District>City and manage students.", href: "/portal/admin/schools", Icon: IconUsers },
    { title: "Results", body: "Upload OMR data and publish results.", href: "/portal", Icon: IconGrowthChart },
  ],
  student: [
    { title: "My results", body: "View scores, ranks and rank cards.", href: "/portal", Icon: IconGrowthChart },
    { title: "Certificates", body: "Download your participation & merit certificates.", href: "/portal", Icon: IconCertificate },
    { title: "Study material", body: "Access free syllabus and sample papers.", href: "/publications", Icon: IconBookOpen },
  ],
  parent: [
    { title: "My child's progress", body: "Track registrations, results and certificates.", href: "/portal", Icon: IconGrowthChart },
    { title: "Study material", body: "Access free syllabus and sample papers.", href: "/publications", Icon: IconBookOpen },
  ],
};

export default async function PortalDashboard() {
  const user = await getCurrentUser();
  const role = (user?.profile?.role ?? "student") as Role;
  const name = user?.profile?.fullName || user?.email || "there";

  // Admins get the command center.
  if (canApprove(role)) {
    const stats = await getAdminStats();
    return <AdminDashboard stats={stats} name={name} />;
  }

  const cards = ACTIONS[role] ?? ACTIONS.student;
  const school = role === "school" && user ? await getMySchool(user.id) : null;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-dusty-600">
        Dashboard
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-navy">
        Welcome, {name}
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {school
          ? `You're managing ${school.name}.`
          : `This is your ${role.replace("_", " ")} workspace.`}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="lift rounded-2xl bg-white p-6 ring-1 ring-slate-200"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist text-navy">
              <c.Icon className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold text-navy">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
