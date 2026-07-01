import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/features/auth/queries";
import {
  listRegistrationLeads,
  listContactMessages,
  canApprove,
} from "@/features/schools/queries";
import { LeadRow } from "@/components/portal/LeadRow";

export const metadata = { title: "Review requests" };

export default async function LeadsPage() {
  const user = await getCurrentUser();
  if (!canApprove(user?.profile?.role)) redirect("/portal");

  const [leads, messages] = await Promise.all([
    listRegistrationLeads(),
    listContactMessages(),
  ]);

  const pending = leads.filter((l) => l.status === "pending");
  const processed = leads.filter((l) => l.status !== "pending");

  return (
    <div>
      <Link href="/portal" className="text-sm font-semibold text-dusty-600 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-navy">
        School registration requests
      </h1>
      <p className="mt-2 text-slate-600">
        Approve a request to generate its unique school code, then share the code
        with the school so they can claim their account.
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-dusty-600">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            No pending requests.
          </p>
        ) : (
          <div className="space-y-4">
            {pending.map((l) => (
              <LeadRow key={l.id} lead={l} />
            ))}
          </div>
        )}
      </section>

      {processed.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-dusty-600">
            Processed ({processed.length})
          </h2>
          <div className="space-y-4">
            {processed.map((l) => (
              <LeadRow key={l.id} lead={l} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-dusty-600">
          Contact messages ({messages.length})
        </h2>
        {messages.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            No messages yet.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-semibold text-navy">
                    {m.name}{" "}
                    <span className="font-normal text-slate-500">· {m.role ?? "—"}</span>
                  </p>
                  <p className="text-sm text-dusty-600">{m.email}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
