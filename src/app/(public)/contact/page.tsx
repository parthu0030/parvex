import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactClosing } from "@/components/contact/ContactClosing";
import { buildPageMetadata } from "@/lib/seo";
import { resolveInquiryLabel } from "@/lib/validations/contact";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Start a project with Parvex. Tell us about your website, application, brand, shoot or film — we reply within one working day.",
  path: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const { service } = await searchParams;
  const initialProjectType = resolveInquiryLabel(Array.isArray(service) ? service[0] : service);

  return (
    <>
      <ContactHero />
      <ContactForm initialProjectType={initialProjectType} />
      <ContactClosing />
    </>
  );
}
