import "server-only";

/**
 * The project-enquiry notification email (HTML + plain text).
 *
 * Table-based layout with inline styles only, so it renders the same in
 * Gmail, Outlook and Apple Mail. Every value the visitor typed is HTML-escaped
 * before it is placed in the markup.
 */

export interface EnquiryDetails {
  reference: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  timeline: string;
  budget?: string;
  message: string;
  attachmentName?: string;
  attachmentUrl?: string;
  submittedAt: Date;
  /** Link to the saved enquiry in /admin, when the database stored it. */
  adminUrl?: string;
}

export const ENQUIRY_SUBJECT = "New Project Enquiry — Parvex Website";

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** mailto: link with the address and subject URL-encoded. */
function mailto(address: string, subject?: string): string {
  const at = address.lastIndexOf("@");
  const encoded = `${encodeURIComponent(address.slice(0, at))}@${encodeURIComponent(address.slice(at + 1))}`;
  return `mailto:${encoded}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}

/** Escape, then keep the visitor's line breaks. */
const paragraph = (value: string) => esc(value).replace(/\r?\n/g, "<br>");

export function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  }).format(date) + " IST";
}

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

function section(title: string, rows: string): string {
  return `
  <tr><td style="padding:28px 40px 0 40px;">
    <p style="margin:0 0 12px 0;font:600 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:#6B6B6B;">${esc(title)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid #E8E8E8;">${rows}</table>
  </td></tr>`;
}

function row(label: string, valueHtml: string): string {
  return `
      <tr>
        <td valign="top" style="padding:12px 16px 12px 0;width:150px;border-bottom:1px solid #E8E8E8;font:500 13px/1.5 ${FONT};color:#6B6B6B;">${esc(label)}</td>
        <td valign="top" style="padding:12px 0;border-bottom:1px solid #E8E8E8;font:400 15px/1.55 ${FONT};color:#0A0A0A;">${valueHtml}</td>
      </tr>`;
}

const notProvided = `<span style="color:#A0A0A0;">Not provided</span>`;

export function renderEnquiryEmail(d: EnquiryDetails): { subject: string; html: string; text: string } {
  const submitted = formatSubmittedAt(d.submittedAt);
  const firstName = d.name.split(/\s+/)[0] || d.name;

  const attachmentHtml = d.attachmentName
    ? d.attachmentUrl
      ? `<a href="${esc(d.attachmentUrl)}" style="color:#0A0A0A;">${esc(d.attachmentName)}</a> <span style="color:#6B6B6B;">(also attached to this email)</span>`
      : `${esc(d.attachmentName)} <span style="color:#6B6B6B;">(attached to this email)</span>`
    : `<span style="color:#A0A0A0;">None</span>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(ENQUIRY_SUBJECT)}</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F4;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(`${d.name} — ${d.projectType}, ${d.budget ?? "budget not given"}, ${d.timeline}`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F4;">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FFFFFF;border:1px solid #E8E8E8;">
      <tr><td style="background:#0A0A0A;padding:26px 40px;">
        <span style="font:800 18px/1 ${FONT};letter-spacing:.02em;color:#FFFFFF;">PARVEX</span>
        <span style="font:400 12px/1 ${FONT};letter-spacing:.08em;color:#8A8A8A;padding-left:10px;">Creative Technology Studio</span>
      </td></tr>
      <tr><td style="padding:36px 40px 4px 40px;">
        <p style="margin:0 0 10px 0;font:600 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:#6B6B6B;">Website enquiry · Ref ${esc(d.reference)}</p>
        <h1 style="margin:0 0 10px 0;font:600 28px/1.2 ${FONT};letter-spacing:-.02em;color:#0A0A0A;">New Project Enquiry</h1>
        <p style="margin:0;font:400 15px/1.6 ${FONT};color:#6B6B6B;">${esc(d.name)} wants to talk about <strong style="color:#0A0A0A;font-weight:600;">${esc(d.projectType)}</strong>.</p>
      </td></tr>
      ${section("Client details", [
        row("Name", esc(d.name)),
        row("Email", `<a href="${esc(mailto(d.email))}" style="color:#0A0A0A;">${esc(d.email)}</a>`),
        row("Company", d.company ? esc(d.company) : notProvided),
      ].join(""))}
      ${section("Project overview", [
        row("Project type", esc(d.projectType)),
      ].join(""))}
      ${section("Budget & timeline", [
        row("Budget", d.budget ? esc(d.budget) : notProvided),
        row("Timeline", esc(d.timeline)),
      ].join(""))}
      ${section("Project requirements", row("Message", paragraph(d.message)) + row("Attachment", attachmentHtml))}
      <tr><td style="padding:32px 40px 8px 40px;">
        <a href="${esc(mailto(d.email, "Re: Your project enquiry — Parvex"))}"
           style="display:inline-block;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font:600 14px/1 ${FONT};padding:14px 22px;border-radius:999px;">Reply to ${esc(firstName)}</a>
        <p style="margin:12px 0 0 0;font:400 13px/1.5 ${FONT};color:#6B6B6B;">Replying to this email also goes straight to ${esc(d.email)}.</p>
      </td></tr>
      <tr><td style="padding:28px 40px 32px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E8E8E8;">
          <tr><td style="padding-top:16px;font:400 12px/1.6 ${FONT};color:#8A8A8A;">
            Submitted ${esc(submitted)}<br>
            ${d.adminUrl ? `Saved in Admin: <a href="${esc(d.adminUrl)}" style="color:#6B6B6B;">${esc(d.adminUrl)}</a>` : "Not saved in Admin (the database was unavailable) — this email is the record of the enquiry."}
          </td></tr>
        </table>
      </td></tr>
    </table>
    <p style="margin:16px 0 0 0;font:400 11px/1.5 ${FONT};color:#A0A0A0;">Sent by the contact form on the Parvex website.</p>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    "PARVEX — New Project Enquiry",
    `Ref ${d.reference}`,
    "",
    "CLIENT DETAILS",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Company: ${d.company || "Not provided"}`,
    "",
    "PROJECT OVERVIEW",
    `Project type: ${d.projectType}`,
    "",
    "BUDGET & TIMELINE",
    `Budget: ${d.budget || "Not provided"}`,
    `Timeline: ${d.timeline}`,
    "",
    "PROJECT REQUIREMENTS",
    d.message,
    "",
    `Attachment: ${d.attachmentName ? `${d.attachmentName} (attached)${d.attachmentUrl ? ` — ${d.attachmentUrl}` : ""}` : "None"}`,
    "",
    `Submitted: ${submitted}`,
    d.adminUrl ? `Saved in Admin: ${d.adminUrl}` : "Not saved in Admin (the database was unavailable) — this email is the record of the enquiry.",
    "",
    `Reply to this email to answer ${d.name} directly.`,
  ].join("\n");

  return { subject: ENQUIRY_SUBJECT, html, text };
}
