import { z } from "zod";

/**
 * Enquiry options shown on the contact form. `value` is the URL-safe key used
 * by `/contact?service=<value>` deep links (CTA chips, service pages); the
 * human-readable `label` is what gets stored on the message.
 */
export const INQUIRY_OPTIONS = [
  { value: "website", label: "Website" },
  { value: "web-application", label: "Web Application" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "branding", label: "Branding" },
  { value: "photography", label: "Photography" },
  { value: "videography", label: "Videography" },
  { value: "video-editing", label: "Video Editing" },
  { value: "ai-automation", label: "AI Automation" },
  { value: "something-else", label: "Something Else" },
] as const;

export const PROJECT_TYPES = INQUIRY_OPTIONS.map((o) => o.label);

/** Maps service-page slugs (and legacy slugs) to an enquiry option value. */
const SERVICE_SLUG_TO_INQUIRY: Record<string, string> = {
  "website-design-development": "website",
  "web-development": "website",
  "web-applications": "web-application",
  "app-development": "web-application",
  "branding-digital-experiences": "branding",
  "ai-products": "ai-automation",
  "creative-technology": "something-else",
};

/** Resolve a `?service=` query value to the stored project-type label. */
export function resolveInquiryLabel(service: string | null | undefined): string | undefined {
  if (!service) return undefined;
  const key = SERVICE_SLUG_TO_INQUIRY[service] ?? service;
  return INQUIRY_OPTIONS.find((o) => o.value === key)?.label;
}

export const BUDGET_RANGES = [
  "Exploring / Not Sure Yet",
  "Under ₹50K",
  "₹50K – ₹1L",
  "₹1L – ₹3L",
  "₹3L – ₹10L",
  "₹10L+",
] as const;

export const ESTIMATED_TIMELINES = [
  "Under 1 Month",
  "1 – 3 Months",
  "3 – 6 Months",
  "6+ Months",
] as const;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "That name looks a little too long."),
  email: z
    .string()
    .trim()
    .min(1, "We'll need an email to reply to.")
    .email("Enter a valid email address."),
  company: z
    .string()
    .trim()
    .max(100, "That company name looks a little too long.")
    .optional()
    .or(z.literal("")),
  // Typed as a refined string (rather than z.enum) so the inferred TS type
  // is `string`, not a strict literal union. That lets react-hook-form use
  // "" as the pre-selection default value without a type error, while the
  // refine still enforces the exact same set of valid options at runtime.
  projectType: z
    .string()
    .refine((val) => (PROJECT_TYPES as readonly string[]).includes(val), {
      message: "Let us know what you're building.",
    }),
  timeline: z
    .string()
    .refine((val) => (ESTIMATED_TIMELINES as readonly string[]).includes(val), {
      message: "Please select an estimated timeline.",
    }),
  budget: z.enum(BUDGET_RANGES).optional(),
  message: z
    .string()
    .trim()
    .min(20, "Give us a little more to go on — a couple of sentences is perfect.")
    .max(2000, "That's a lot to say — try trimming it down a bit."),
  // Honeypot — real visitors never see or fill this field
  company_website: z.union([z.literal(""), z.undefined()]),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };