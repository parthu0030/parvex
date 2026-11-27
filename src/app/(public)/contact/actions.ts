"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { contactFormSchema, type ContactFormState } from "@/lib/validations/contact";
import { rateLimit, refundRateLimit } from "@/lib/rate-limit";
import { assertValidFile } from "@/lib/storage/media-service";
import { verifyAttachment } from "@/lib/email/attachment";
import { cloudinaryStorage } from "@/lib/storage/cloudinary";
import { recordAnalyticsEvent } from "@/lib/analytics";
import { COMPANY, SITE_URL } from "@/data/company";
import { enquiryRecipients, redact, sendEmail } from "@/lib/email/mailer";
import { renderEnquiryEmail } from "@/lib/email/enquiry-email";

const FAILED: ContactFormState = {
  status: "error",
  message: `Something went wrong while submitting your enquiry. Please try again or contact us directly at ${COMPANY.email}.`,
};

// ---------------------------------------------------------------------------
// Duplicate protection. The form sends a one-time id per enquiry; the key is
// that id plus a hash of every field and the attachment, so a retry of the
// same enquiry is recognised while an edited or genuinely new one never is.
// A repeat within the window gets the first result without a second email; a
// repeat that arrives while the first is still sending waits for it.
// In-memory: it covers double-clicks and retries that reach the same server
// instance (the form's own guard stops double-clicks before they leave).
// ---------------------------------------------------------------------------
const DEDUPE_WINDOW_MS = 10 * 60 * 1000;
const inFlight = new Map<string, Promise<ContactFormState>>();
const delivered = new Map<string, number>();

function dedupeKeys(submissionId: string | null, fields: string[]): string[] {
  if (!submissionId) return [];
  const content = createHash("sha256").update(fields.join("\u0000")).digest("hex");
  return [`id:${submissionId}:${content}`];
}

function recentlyDelivered(keys: string[]): boolean {
  const now = Date.now();
  for (const [k, expires] of delivered) if (expires < now) delivered.delete(k);
  return keys.some((k) => delivered.has(k));
}

/** Remove control and bidi-override characters (keeping newlines and tabs) from free text. */
const clean = (value: string) =>
  value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/g, "");
/** Single-line fields: also no line breaks. */
const cleanLine = (value: string) => clean(value).replace(/[\r\n\t]+/g, " ").trim();

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    projectType: formData.get("projectType"),
    timeline: formData.get("timeline"),
    budget: formData.get("budget") || undefined,
    message: formData.get("message"),
    company_website: formData.get("company_website") || undefined,
  };

  // Honeypot: real visitors never see or fill this field. Answer bots with a
  // quiet "success" before validation, so they learn nothing.
  if (typeof raw.company_website === "string" && raw.company_website.trim() !== "") {
    return { status: "success" };
  }

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  const name = cleanLine(parsed.data.name);
  const email = cleanLine(parsed.data.email).toLowerCase();
  const company = parsed.data.company ? cleanLine(parsed.data.company) : undefined;
  const { projectType, timeline } = parsed.data;
  const budget = parsed.data.budget || undefined;
  const message = clean(parsed.data.message).trim();

  const rawId = formData.get("submissionId");
  const submissionId = typeof rawId === "string" && /^[A-Za-z0-9-]{8,64}$/.test(rawId) ? rawId : null;
  const attachmentFile = formData.get("attachment") as File | null;
  const hasAttachment = !!attachmentFile && attachmentFile.size > 0 && attachmentFile.name !== "undefined";

  const keys = dedupeKeys(submissionId, [
    name, email, company ?? "", projectType, timeline, budget ?? "", message,
    hasAttachment ? `${attachmentFile.name}:${attachmentFile.size}:${attachmentFile.type}` : "",
  ]);

  // Already delivered, or still being delivered: don't send it twice.
  if (recentlyDelivered(keys)) return { status: "success" };
  const pending = keys.map((k) => inFlight.get(k)).find(Boolean);
  if (pending) return pending;

  // Registered before the first await, so a simultaneous duplicate always
  // finds it and waits for this result instead of sending again.
  const job = (async (): Promise<ContactFormState> => {
    if (hasAttachment) {
      try {
        assertValidFile(attachmentFile);
      } catch (error) {
        return { status: "error", message: error instanceof Error ? error.message : "Invalid attachment." };
      }
    }
    // Rate limit only after the payload is valid and not a duplicate, so
    // validation mistakes and double-clicks don't use up the visitor's quota.
    // Vercel sets x-real-ip itself; x-forwarded-for is the fallback elsewhere.
    const h = await headers();
    const ip = h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limitKey = `contact:${ip}`;
    const { allowed } = rateLimit(limitKey, { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!allowed) {
      return { status: "error", message: "Too many submissions — please try again in a few minutes." };
    }
    const result = await deliver({
      name, email, company, projectType, timeline, budget, message, ip,
      attachment: hasAttachment ? attachmentFile : null,
    });
    // A failure on our side (provider down, misconfiguration) shouldn't use up
    // the visitor's attempts; a rejected attachment is the visitor's to fix.
    if (result.status === "error" && !result.message.startsWith("That file type")) refundRateLimit(limitKey);
    return result;
  })();
  for (const k of keys) inFlight.set(k, job);
  try {
    const result = await job;
    if (result.status === "success") {
      const expires = Date.now() + DEDUPE_WINDOW_MS;
      for (const k of keys) delivered.set(k, expires);
    }
    return result;
  } finally {
    for (const k of keys) inFlight.delete(k);
  }
}

interface Enquiry {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  timeline: string;
  budget?: string;
  message: string;
  ip: string;
  attachment: File | null;
}

async function deliver(e: Enquiry): Promise<ContactFormState> {
  const submittedAt = new Date();

  // Attachment: stored in Cloudinary when possible (for /admin), and always
  // attached to the notification email once it has passed validation.
  let mediaId: string | null = null;
  let attachmentUrl: string | undefined;
  let attachmentName: string | undefined;
  let emailAttachment: { filename: string; content: Buffer; contentType: string }[] | undefined;
  if (e.attachment) {
    const buffer = Buffer.from(await e.attachment.arrayBuffer());
    let verified;
    try {
      verified = verifyAttachment(e.attachment, buffer);
    } catch (error) {
      return { status: "error", message: error instanceof Error ? error.message : "Invalid attachment." };
    }
    attachmentName = verified.filename;
    emailAttachment = [{ filename: verified.filename, content: buffer, contentType: verified.contentType }];
    try {
      const uploaded = await cloudinaryStorage.upload(buffer, {
        folder: "parvex/attachments",
        filename: verified.filename,
        resourceType: verified.resourceType,
      });
      attachmentUrl = uploaded.url;
      const media = await prisma.media.create({
        data: {
          type: verified.mediaType,
          category: "ATTACHMENT",
          publicId: uploaded.publicId,
          url: uploaded.url,
          filename: verified.filename,
          mimeType: verified.contentType,
          width: uploaded.width,
          height: uploaded.height,
          bytes: uploaded.bytes,
        },
      });
      mediaId = media.id;
    } catch (error) {
      console.error("submitContactForm: attachment storage failed; it will only be emailed.", errorName(error));
    }
  }

  // Save for /admin/messages when the database is reachable. The email below
  // is what decides success; the database copy is a convenience.
  let savedId: string | null = null;
  try {
    const saved = await prisma.contactMessage.create({
      data: {
        name: e.name,
        email: e.email,
        company: e.company || null,
        projectType: e.projectType,
        timeline: e.timeline,
        budget: e.budget || null,
        message: e.message,
        ipAddress: e.ip !== "unknown" ? e.ip : null,
        ...(mediaId ? { attachments: { create: { mediaId } } } : {}),
      },
    });
    savedId = saved.id;
    void recordAnalyticsEvent("CONTACT_ENQUIRY_CREATED", saved.id, { projectType: e.projectType });
  } catch (error) {
    console.error("submitContactForm: database unavailable; continuing with email only.", errorName(error));
  }

  const reference = (savedId ?? createHash("sha256").update(`${e.email}${submittedAt.getTime()}`).digest("hex")).slice(-8).toUpperCase();
  const mail = renderEnquiryEmail({
    reference,
    name: e.name,
    email: e.email,
    company: e.company,
    projectType: e.projectType,
    timeline: e.timeline,
    budget: e.budget,
    message: e.message,
    attachmentName,
    attachmentUrl,
    submittedAt,
    adminUrl: savedId ? `${SITE_URL}/admin/messages/${savedId}` : undefined,
  });

  const result = await sendEmail({
    to: await recipients(),
    replyTo: e.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    attachments: emailAttachment,
  });

  // Provider messages only (addresses redacted) — never the visitor's details.
  if (!result.ok) console.error(`submitContactForm: email via ${result.provider} failed: ${result.error}`);
  else if (result.warning) console.warn(`submitContactForm: email via ${result.provider}: ${result.warning}`);

  if (savedId) {
    try {
      await prisma.contactMessage.update({
        where: { id: savedId },
        data: result.ok
          ? { notificationState: "SENT", notificationError: result.warning ?? null }
          : { notificationState: "FAILED", notificationError: result.error.slice(0, 500) },
      });
    } catch (error) {
      console.error("submitContactForm: could not record the notification state.", errorName(error));
    }
  }

  return result.ok ? { status: "success" } : FAILED;
}

function errorName(error: unknown): string {
  return error instanceof Error ? redact(`${error.name}: ${error.message.split("\n")[0].slice(0, 200)}`) : "Unknown error";
}

/**
 * Everyone who gets the notification: the configured list (env) plus the
 * "Contact Form Recipient" set in /admin Settings, when the database answers
 * within a couple of seconds.
 */
async function recipients(): Promise<string[]> {
  const list = enquiryRecipients();
  try {
    const settings = await Promise.race([
      prisma.setting.findUnique({ where: { id: "singleton" }, select: { contactEmail: true } }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
    ]);
    const extra = settings?.contactEmail?.trim().toLowerCase();
    if (extra && /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/.test(extra) && !list.includes(extra)) list.push(extra);
  } catch {
    // Settings unavailable: the configured list still applies.
  }
  if (list.length < 2 && process.env.NODE_ENV === "production") {
    console.warn("submitContactForm: only the studio inbox will be notified — set CONTACT_NOTIFY_EMAILS for the other recipients.");
  }
  return list;
}
