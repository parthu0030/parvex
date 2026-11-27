"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { prisma } from "@/lib/db/prisma";
import { contactFormSchema, type ContactFormState } from "@/lib/validations/contact";
import { rateLimit } from "@/lib/rate-limit";
import { assertValidFile, classifyMime } from "@/lib/storage/media-service";
import { cloudinaryStorage } from "@/lib/storage/cloudinary";
import { recordAnalyticsEvent } from "@/lib/analytics";
import { COMPANY, SITE_URL } from "@/data/company";

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

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

  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  // Rate limit only after the payload is structurally valid. This prevents
  // repeated draft edits or validation mistakes from consuming the same quota
  // as real submissions.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!allowed) {
    return { status: "error", message: "Too many submissions — please try again in a few minutes." };
  }

  // Honeypot tripped — pretend success, do nothing.
  if (parsed.data.company_website) {
    return { status: "success" };
  }

  const { name, email, company, projectType, timeline, budget, message } = parsed.data;

  // Attachment: validate, then upload to Cloudinary (never store the raw
  // file locally or attach unvalidated bytes to an outbound email).
  const attachmentFile = formData.get("attachment") as File | null;
  let mediaId: string | null = null;
  let resendAttachment: { filename: string; content: Buffer }[] | undefined;

  if (attachmentFile && attachmentFile.size > 0 && attachmentFile.name !== "undefined") {
    try {
      assertValidFile(attachmentFile);
    } catch (error) {
      return { status: "error", message: error instanceof Error ? error.message : "Invalid attachment." };
    }

    const { mediaType, resourceType } = classifyMime(attachmentFile.type);
    const buffer = Buffer.from(await attachmentFile.arrayBuffer());
    // The file has passed validation, so it can go out with the email even
    // if storing it fails below.
    resendAttachment = [{ filename: attachmentFile.name, content: buffer }];

    try {
      const uploaded = await cloudinaryStorage.upload(buffer, {
        folder: "parvex/attachments",
        filename: attachmentFile.name,
        resourceType,
      });
      const media = await prisma.media.create({
        data: {
          type: mediaType,
          category: "ATTACHMENT",
          publicId: uploaded.publicId,
          url: uploaded.url,
          filename: attachmentFile.name,
          mimeType: attachmentFile.type,
          width: uploaded.width,
          height: uploaded.height,
          bytes: uploaded.bytes,
        },
      });
      mediaId = media.id;
    } catch (error) {
      // Storage is a convenience for /admin; the email still carries the file.
      console.error("Contact attachment storage failed; it will only be emailed:", error);
    }
  }

  // Save the enquiry so it appears in /admin/messages. If the database is
  // unreachable, carry on: the notification email below is then the only
  // copy, and the visitor is told to email directly if that fails too.
  let savedId: string | null = null;
  try {
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        company: company || null,
        projectType,
        timeline,
        budget: budget || null,
        message,
        ipAddress: ip !== "unknown" ? ip : null,
        ...(mediaId ? { attachments: { create: { mediaId } } } : {}),
      },
    });
    savedId = contactMessage.id;
    void recordAnalyticsEvent("CONTACT_ENQUIRY_CREATED", contactMessage.id, { projectType });
  } catch (error) {
    console.error("submitContactForm: could not save the enquiry to the database; relying on email", error);
  }

  const notSent: ContactFormState = {
    status: "error",
    message: `Sorry — we couldn't send your message right now. Please email us at ${COMPANY.email} instead.`,
  };

  const resend = getResendClient();
  if (!resend) {
    console.error("submitContactForm: RESEND_API_KEY is not configured — see .env.example.");
    return savedId ? { status: "success" } : notSent;
  }

  // Where enquiries go: admin Settings first (needs the database), then the
  // CONTACT_FALLBACK_EMAIL environment variable, then the public studio inbox.
  let settings: { contactEmail: string | null; primaryEmail: string | null } | null = null;
  try {
    settings = await prisma.setting.findUnique({
      where: { id: "singleton" },
      select: { contactEmail: true, primaryEmail: true },
    });
  } catch (error) {
    console.error("submitContactForm: could not read Settings; using the fallback recipient", error);
  }
  const recipient =
    settings?.contactEmail || settings?.primaryEmail || process.env.CONTACT_FALLBACK_EMAIL || COMPANY.email;
  // The sender must be on a domain verified in Resend. Deriving it from the
  // recipient breaks for Gmail and similar inboxes (hello@gmail.com is never
  // verifiable), so use RESEND_FROM_EMAIL, falling back to Resend's shared
  // test sender.
  const from = process.env.RESEND_FROM_EMAIL || "Parvex Contact <onboarding@resend.dev>";

  let sendError: string | null = null;
  try {
    // Resend reports most failures in the result rather than by throwing.
    const { error } = await resend.emails.send({
      from,
      to: recipient,
      replyTo: email,
      subject: `New enquiry — ${projectType} — ${name}`,
      attachments: resendAttachment,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        company ? `Company: ${company}` : null,
        `Project type: ${projectType}`,
        `Estimated Timeline: ${timeline}`,
        budget ? `Budget: ${budget}` : null,
        "",
        `Message:`,
        message,
        "",
        savedId
          ? `View in Admin: ${SITE_URL}/admin/messages/${savedId}`
          : "Not saved in Admin (the database was unavailable) — this email is the only copy.",
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });
    if (error) sendError = `${error.name}: ${error.message}`;
  } catch (error) {
    sendError = error instanceof Error ? error.message : "Unknown error";
  }

  if (sendError) console.error("submitContactForm: Resend send failed", sendError);

  if (savedId) {
    try {
      await prisma.contactMessage.update({
        where: { id: savedId },
        data: sendError
          ? { notificationState: "FAILED", notificationError: sendError }
          : { notificationState: "SENT" },
      });
    } catch (error) {
      console.error("submitContactForm: could not record the notification state", error);
    }
  }

  if (!savedId && sendError) return notSent;

  // The message got through, but an attachment that couldn't be stored and
  // wasn't emailed is lost — ask for it rather than claim it arrived.
  if (resendAttachment && !mediaId && sendError) {
    return {
      status: "error",
      message: `We received your message, but not your attachment. Please email the file to ${COMPANY.email}.`,
    };
  }

  // The enquiry reached the database (visible in /admin/messages) or the inbox.
  return { status: "success" };
}
