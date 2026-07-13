import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/queries";
import { listRegistrationLeads, canApprove } from "@/features/schools/queries";
import { getLeadCodeIndex, codeForLead } from "@/features/schools/stats";
import {
  RequestsManager,
  type LeadWithCode,
} from "@/components/portal/RequestsManager";

export const metadata = { title: "Requests" };

export default async function LeadsPage() {
  const user = await getCurrentUser();
  if (!canApprove(user?.profile?.role)) redirect("/portal");

  const [leads, codeIndex] = await Promise.all([
    listRegistrationLeads(),
    getLeadCodeIndex(),
  ]);

  // Resolve each approved lead's school code so it persists across reloads.
  const enriched: LeadWithCode[] = leads.map((l) => ({
    ...l,
    code: l.status === "approved" ? codeForLead(codeIndex, l) : null,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-navy">
        School registration requests
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Approve a request to generate its unique school code, then share it with
        the school. Approved requests keep their code here for reference.
      </p>

      <div className="mt-8">
        <RequestsManager leads={enriched} />
      </div>
    </div>
  );
}
