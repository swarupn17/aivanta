import "server-only";
import { Resend } from "resend";
import { clientEnv, emailEnv } from "@/lib/env";
import { siteConfig } from "@/config/site";

/**
 * Transactional email via Resend (server-only).
 *
 * Design: email is a SIDE-EFFECT. A failure to send must NEVER break the flow
 * that triggered it (a school still gets registered/approved even if the email
 * bounces). So every sender is guarded and returns a result instead of throwing.
 *
 * Auth emails (the login OTP) are sent by Supabase, NOT here — configure those
 * under Supabase → SMTP. This module is only for app-level notifications.
 */

export type EmailResult = { ok: true } | { ok: false; error: string };

/** True once a Resend key + verified sender are present. */
export function isEmailConfigured(): boolean {
  const { RESEND_API_KEY, EMAIL_FROM } = emailEnv();
  return !!RESEND_API_KEY && !!EMAIL_FROM;
}

/** Lazily build a Resend client, or null if unconfigured. */
function getResend(): { client: Resend; from: string } | null {
  const { RESEND_API_KEY, EMAIL_FROM } = emailEnv();
  if (!RESEND_API_KEY || !EMAIL_FROM) return null;
  return { client: new Resend(RESEND_API_KEY), from: EMAIL_FROM };
}

/** Escape user-supplied text before dropping it into HTML. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Core send helper — guarded, never throws. */
async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<EmailResult> {
  const resend = getResend();
  if (!resend) {
    console.info("[email] skipped — Resend not configured:", opts.subject);
    return { ok: false, error: "Email not configured." };
  }
  try {
    const { error } = await resend.client.emails.send({
      from: resend.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    if (error) {
      console.error("[email] send failed", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] unexpected", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Email send failed.",
    };
  }
}

/** Brand shell so every email looks consistent (inline styles = email-safe). */
function layout(bodyHtml: string): string {
  const year = new Date().getFullYear();
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f6f9fb;font-family:Inter,Segoe UI,system-ui,-apple-system,sans-serif;color:#1f2937;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="height:3px;background:linear-gradient(90deg,#0d3b66 0%,#7f9db1 55%,#b4d6e3 100%);border-radius:3px;"></div>
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;margin-top:16px;">
      <p style="margin:0 0 16px;font-weight:800;font-size:18px;color:#0d3b66;">${esc(siteConfig.org.name)}</p>
      ${bodyHtml}
    </div>
    <p style="margin:16px 4px 0;font-size:12px;color:#94a3b8;">
      © ${year} ${esc(siteConfig.org.name)} · ${esc(siteConfig.contact.email)}
    </p>
  </div>
</body></html>`;
}

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#f08a5a;color:#0d3b66;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;">${esc(label)}</a>`;

const siteUrl = () => clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/**
 * Notify the admin that a new school registration request has arrived.
 * Goes to ADMIN_NOTIFICATION_EMAIL, or the public contact email as fallback.
 */
export async function sendNewRegistrationAdminAlert(lead: {
  applicantName: string;
  applicantEmail: string;
  applicantMobile: string;
  schoolName: string;
  city?: string | null;
  state?: string | null;
}): Promise<EmailResult> {
  const { ADMIN_NOTIFICATION_EMAIL } = emailEnv();
  const to = ADMIN_NOTIFICATION_EMAIL ?? siteConfig.contact.email;
  const place = [lead.city, lead.state]
    .filter((v): v is string => !!v)
    .map(esc)
    .join(", ");

  const body = `
    <h1 style="margin:0 0 8px;font-size:20px;color:#0d3b66;">New school registration</h1>
    <p style="margin:0 0 16px;color:#475569;font-size:14px;">A school has requested a code. Review &amp; approve it in the portal.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#64748b;width:120px;">School</td><td style="padding:6px 0;font-weight:600;">${esc(lead.schoolName)}</td></tr>
      ${place ? `<tr><td style="padding:6px 0;color:#64748b;">Location</td><td style="padding:6px 0;">${place}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#64748b;">Applicant</td><td style="padding:6px 0;">${esc(lead.applicantName)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Email</td><td style="padding:6px 0;">${esc(lead.applicantEmail)}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b;">Mobile</td><td style="padding:6px 0;">${esc(lead.applicantMobile)}</td></tr>
    </table>
    <p style="margin:24px 0 0;">${btn(`${siteUrl()}/portal/leads`, "Review request")}</p>`;

  return sendMail({
    to,
    subject: `New registration: ${lead.schoolName}`,
    html: layout(body),
  });
}

/**
 * Tell an approved school its 5-digit login code and how to sign in.
 */
export async function sendSchoolApprovalEmail(opts: {
  to: string;
  schoolName: string;
  code: string;
}): Promise<EmailResult> {
  const body = `
    <h1 style="margin:0 0 8px;font-size:20px;color:#0d3b66;">You're approved!</h1>
    <p style="margin:0 0 16px;color:#475569;font-size:14px;">
      <strong>${esc(opts.schoolName)}</strong> is approved for Aivanta assessments. Here is your school login code:
    </p>
    <div style="text-align:center;background:#eef4f8;border-radius:12px;padding:20px;margin:0 0 20px;">
      <div style="font-size:34px;font-weight:800;letter-spacing:8px;color:#0d3b66;">${esc(opts.code)}</div>
      <div style="font-size:12px;color:#64748b;margin-top:4px;">your school code</div>
    </div>
    <p style="margin:0 0 8px;color:#475569;font-size:14px;">To sign in: choose <strong>School login</strong>, enter this code and your registered school email, then type the 6-digit code we email you.</p>
    <p style="margin:20px 0 0;">${btn(`${siteUrl()}/login`, "Sign in to your portal")}</p>`;

  return sendMail({
    to: opts.to,
    subject: `Your Aivanta school code: ${opts.code}`,
    html: layout(body),
  });
}
