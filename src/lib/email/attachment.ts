import "server-only";

/**
 * Contact-form attachments: trust the file's bytes, not what the browser says.
 *
 * The form accepts PDF, DOCX, ZIP, PNG and JPEG. A file is accepted only if
 * its first bytes match one of those formats AND the type the browser declared
 * belongs to the same format. The name used in the outgoing email is rebuilt
 * on the server (safe characters only) with an extension that matches the
 * verified type, so "brief.pdf.html" or a right-to-left-override trick can't
 * arrive looking like something else.
 */

export interface VerifiedAttachment {
  filename: string;
  contentType: string;
  mediaType: "IMAGE" | "DOCUMENT";
  resourceType: "image" | "raw";
}

const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const startsWith = (b: Buffer, sig: number[], offset = 0) => sig.every((byte, i) => b[offset + i] === byte);

function sniff(b: Buffer): "pdf" | "png" | "jpeg" | "zip" | null {
  if (startsWith(b, [0x25, 0x50, 0x44, 0x46, 0x2d])) return "pdf"; // %PDF-
  if (startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(b, [0xff, 0xd8, 0xff])) return "jpeg";
  if (startsWith(b, [0x50, 0x4b, 0x03, 0x04])) return "zip"; // ZIP, and DOCX (which is a ZIP)
  return null;
}

/** Safe display name: ASCII letters, digits and a few separators only. */
function safeBaseName(original: string): string {
  const base = original.replace(/\.[^.]*$/, "");
  const cleaned = base
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9 ._()-]+/g, "_")
    .replace(/[._]{2,}/g, "_")
    .replace(/^[\s._-]+|[\s._-]+$/g, "")
    .slice(0, 80);
  return cleaned || "attachment";
}

export function verifyAttachment(file: { name: string; type: string }, bytes: Buffer): VerifiedAttachment {
  const kind = sniff(bytes);
  const declared = (file.type || "").toLowerCase();
  const base = safeBaseName(file.name);

  if (kind === "pdf" && declared === "application/pdf") {
    return { filename: `${base}.pdf`, contentType: "application/pdf", mediaType: "DOCUMENT", resourceType: "raw" };
  }
  if (kind === "png" && declared === "image/png") {
    return { filename: `${base}.png`, contentType: "image/png", mediaType: "IMAGE", resourceType: "image" };
  }
  if (kind === "jpeg" && (declared === "image/jpeg" || declared === "image/jpg")) {
    return { filename: `${base}.jpg`, contentType: "image/jpeg", mediaType: "IMAGE", resourceType: "image" };
  }
  if (kind === "zip" && declared === DOCX) {
    return { filename: `${base}.docx`, contentType: DOCX, mediaType: "DOCUMENT", resourceType: "raw" };
  }
  if (kind === "zip" && (declared === "application/zip" || declared === "application/x-zip-compressed")) {
    return { filename: `${base}.zip`, contentType: "application/zip", mediaType: "DOCUMENT", resourceType: "raw" };
  }
  throw new Error("That file type isn't supported. Please attach a PDF, DOCX, ZIP, PNG or JPG.");
}
