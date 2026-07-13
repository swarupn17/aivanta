"use client";

import { useState } from "react";
import { approveLead, rejectLead } from "@/features/schools/actions";
import type { LeadRowData } from "@/features/schools/queries";

export function LeadRow({
  lead,
  initialCode = null,
}: {
  lead: LeadRowData;
  initialCode?: string | null;
}) {
  const [status, setStatus] = useState(lead.status);
  const [code, setCode] = useState<string | null>(initialCode);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submitted = lead.created_at
    ? new Date(lead.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  async function onApprove() {
    setBusy(true);
    setErr(null);
    const res = await approveLead(lead.id);
    setBusy(false);
    if (res.ok) {
      setStatus("approved");
      if (res.code) setCode(res.code);
    } else setErr(res.error);
  }

  async function onReject() {
    setBusy(true);
    setErr(null);
    const res = await rejectLead(lead.id);
    setBusy(false);
    if (res.ok) setStatus("rejected");
    else setErr(res.error);
  }

  const badge =
    status === "approved"
      ? "bg-green-50 text-green-700 ring-green-200"
      : status === "rejected"
        ? "bg-red-50 text-red-700 ring-red-200"
        : "bg-mist text-navy ring-dusty/40";

  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-navy">{lead.school_name}</h3>
          <p className="text-sm text-slate-600">
            {[lead.city, lead.district, lead.state, lead.country].filter(Boolean).join(", ")}
            {lead.pincode ? ` - ${lead.pincode}` : ""}
          </p>
          {lead.school_address && (
            <p className="mt-1 text-xs text-slate-500">{lead.school_address}</p>
          )}
        </div>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${badge}`}>
            {status}
          </span>
          {submitted && (
            <span className="text-xs text-slate-400">{submitted}</span>
          )}
        </span>
      </div>

      <div className="mt-3 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-navy">Applicant:</span>{" "}
          {lead.applicant_name}
          {lead.applicant_role ? ` (${lead.applicant_role})` : ""}
        </p>
        <p>
          <span className="font-semibold text-navy">Applicant contact:</span>{" "}
          {lead.applicant_mobile} · {lead.applicant_email}
        </p>
        <p>
          <span className="font-semibold text-navy">Principal:</span>{" "}
          {lead.principal_name ?? "—"}
          {lead.principal_contact ? ` · ${lead.principal_contact}` : ""}
        </p>
        <p>
          <span className="font-semibold text-navy">School contact:</span>{" "}
          {lead.school_phone ?? "—"}
          {lead.school_email ? ` · ${lead.school_email}` : ""}
        </p>
      </div>

      {code && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-mist px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-dusty-600">
              School code — share with the school
            </p>
            <p className="font-display text-xl font-extrabold tracking-widest text-navy">
              {code}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(code)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-navy ring-1 ring-slate-300 hover:bg-white"
          >
            Copy
          </button>
        </div>
      )}

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      {status === "pending" && (
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onApprove}
            disabled={busy}
            className="rounded-lg bg-orange px-5 py-2 text-sm font-bold text-navy transition-colors hover:bg-orange-600 disabled:opacity-60"
          >
            {busy ? "Working…" : "Approve & generate code"}
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={busy}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
