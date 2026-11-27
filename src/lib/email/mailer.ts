import "server-only";
import { Resend } from "resend";
import nodemailer, { type Transporter } from "nodemailer";
import { COMPANY } from "@/data/company";

/**
 * Outbound email for site notifications.
 *
 * Provider (EMAIL_PROVIDER, or chosen automatically):
 * - "smtp"   — any SMTP server via nodemailer. With Gmail, use an App Password
 *              and send from the same Gmail address (SMTP_USER). Works without
 *              owning a domain.
 * - "resend" — Resend's API. Needs RESEND_API_KEY and RESEND_FROM_EMAIL, a
 *              sender on a domain verified in Resend. There is deliberately no
 *              fallback to Resend's shared test sender: it only delivers to
 *              the account owner, so it can never reach every recipient.
 * - "preview"— development only: nothing is sent; the email is reported as
 *              delivered so the form can be exercised locally.
 * Automatic choice: SMTP when SMTP_HOST, SMTP_USER and SMTP_PASS are set,
 * otherwise Resend when RESEND_API_KEY is set.
 */

export interface OutgoingEmail {
  to: string[];
  replyTo: string;
  subject: string;
  html: string;
  text: string;
  attachments?: { filename: string; content: Buffer; contentType: string }[];
}

/** `warning` is set when the provider accepted the email but refused some recipients. */
export type SendResult =
  | { ok: true; provider: string; warning?: string }
  | { ok: false; provider: string; error: string };

/** Provider errors can quote addresses; keep them out of logs and the database. */
export const redact = (text: string) => text.replace(/[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+/g, "[address]");

const EMAIL_RE = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/;

/**
 * Who receives enquiry notifications: CONTACT_NOTIFY_EMAILS (comma-separated)
 * plus CONTACT_FALLBACK_EMAIL, always including the public studio inbox.
 * Private addresses live in environment variables, never in this public repo.
 */
export function enquiryRecipients(): string[] {
  const fromEnv = [process.env.CONTACT_NOTIFY_EMAILS ?? "", process.env.CONTACT_FALLBACK_EMAIL ?? ""]
    .join(",")
    .split(/[,;\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => EMAIL_RE.test(s));
  return Array.from(new Set([COMPANY.email.toLowerCase(), ...fromEnv]));
}

function chooseProvider(): "smtp" | "resend" | "preview" | null {
  const forced = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (forced === "preview") return process.env.NODE_ENV === "production" ? null : "preview";
  if (forced === "smtp" || forced === "resend") return forced;
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return "smtp";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

/** Display name + address for the sender, e.g. "Parvex Website <x@y>". */
function sender(address: string): string {
  return /</.test(address) ? address : `Parvex Website <${address}>`;
}

let smtpTransport: Transporter | null = null;
function smtp(): Transporter {
  if (!smtpTransport) {
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
    smtpTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      // On 587, refuse to authenticate unless the connection is upgraded to TLS.
      requireTLS: !secure,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return smtpTransport;
}

export async function sendEmail(mail: OutgoingEmail): Promise<SendResult> {
  const provider = chooseProvider();
  if (!provider) {
    return { ok: false, provider: "none", error: "No email provider configured (set SMTP_* or RESEND_API_KEY)." };
  }
  if (mail.to.length === 0) return { ok: false, provider, error: "No recipients configured." };

  try {
    if (provider === "preview") {
      console.info(`[email:preview] "${mail.subject}" would be sent to ${mail.to.length} recipient(s); nothing was sent.`);
      return { ok: true, provider };
    }

    if (provider === "smtp") {
      const from = sender(process.env.SMTP_FROM || process.env.SMTP_USER || "");
      const info = await smtp().sendMail({
        from,
        to: mail.to,
        replyTo: mail.replyTo,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        attachments: mail.attachments,
      });
      // nodemailer resolves as long as at least one recipient was accepted.
      const rejected = Array.isArray(info.rejected) ? info.rejected.length : 0;
      const accepted = Array.isArray(info.accepted) ? info.accepted.length : 0;
      if (accepted === 0) return { ok: false, provider, error: "Every recipient was rejected by the SMTP server." };
      return rejected > 0
        ? { ok: true, provider, warning: `${rejected} of ${rejected + accepted} recipient(s) were rejected by the SMTP server.` }
        : { ok: true, provider };
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      return { ok: false, provider, error: "RESEND_FROM_EMAIL is not set (it must be an address on a domain verified in Resend)." };
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = sender(process.env.RESEND_FROM_EMAIL);
    // Resend 4.x reports most failures in the result rather than throwing.
    const { error } = await resend.emails.send({
      from,
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      // Base64 keeps the API request close to the file's size.
      attachments: mail.attachments?.map((a) => ({ filename: a.filename, content: a.content.toString("base64"), contentType: a.contentType })),
    });
    if (error) return { ok: false, provider, error: redact(`${error.name}: ${error.message}`) };
    return { ok: true, provider };
  } catch (error) {
    return { ok: false, provider, error: redact(error instanceof Error ? error.message : "Unknown error") };
  }
}
