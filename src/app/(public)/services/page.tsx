import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesList } from "@/components/services/ServicesList";
import { WhyChooseParvex } from "@/components/services/WhyChooseParvex";
import { ServicesProcess } from "@/components/services/ServicesProcess";
import { ServicesFAQ } from "@/components/services/ServicesFAQ";
import { CTASection } from "@/components/home/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedServices } from "@/lib/queries/services";
import { getPageContent } from "@/lib/queries/content";
import { buildPageMetadata } from "@/lib/seo";
import { FAQ } from "@/data/faq";
import { SITE_URL } from "@/data/company";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("SERVICES");
  return buildPageMetadata({
    title: content?.metaTitle ?? "Services",
    description:
      content?.metaDescription ??
      "Website design and development, web applications, UI/UX, branding, photography, videography, video editing and AI automation — from one creative technology studio.",
    path: "/services",
    canonical: content?.canonicalUrl,
    noIndex: content?.noIndex,
  });
}

export default async function ServicesPage() {
  const [services, content] = await Promise.all([getPublishedServices(), getPageContent("SERVICES")]);

  const serviceViews = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
    longDescription: s.longDescription,
    deliverables: s.deliverables,
    outcome: s.outcome,
    imageUrl: s.media?.url ?? "",
    imageAlt: s.media?.altText ?? null,
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: services.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: s.title,
              description: s.description,
              url: `${SITE_URL}/services#${s.slug}`,
              provider: { "@type": "Organization", name: "Parvex", url: SITE_URL },
            },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      <ServicesHero services={serviceViews.map((s) => ({ slug: s.slug, title: s.title }))} />
      <ServicesList services={serviceViews} />
      <WhyChooseParvex />
      <ServicesProcess />
      <ServicesFAQ />
      <CTASection
        headline={content?.finalCtaHeadline ?? undefined}
        ctaLabel={content?.finalCtaLabel ?? undefined}
        ctaLink={content?.finalCtaLink ?? undefined}
      />
    </>
  );
}
