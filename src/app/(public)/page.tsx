import { Hero } from "@/components/home/Hero";
import { StudioIntro } from "@/components/home/StudioIntro";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ProjectsPreview } from "@/components/home/ProjectsPreview";
import { AboutPreview } from "@/components/home/AboutPreview";
import { MediaShowcase } from "@/components/home/MediaShowcase";
import { CTASection } from "@/components/home/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFeaturedProjects } from "@/lib/queries/projects";
import { getPublishedServices } from "@/lib/queries/services";
import { getPageContent } from "@/lib/queries/content";
import { prisma } from "@/lib/db/prisma";
import { COMPANY, SITE_URL } from "@/data/company";

export const revalidate = 3600; // ISR fallback; Admin mutations explicitly revalidatePath() too

export default async function HomePage() {
  const [content, featuredProjects, services, settings] = await Promise.all([
    getPageContent("HOMEPAGE"),
    getFeaturedProjects(),
    getPublishedServices(),
    prisma.setting.findUnique({ where: { id: "singleton" } }).catch(() => {
      console.warn("Using default settings; database query failed.");
      return null;
    }),
  ]);

  const projectViews = featuredProjects.slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    year: p.year,
    description: p.description,
    services: p.services,
    status: p.deliveryStatus,
    imageSrc: p.coverImage?.url ?? p.thumbnail?.url ?? "/assets/projects/auditgpt.png",
    imageAlt: p.coverImage?.altText ?? p.thumbnail?.altText ?? p.title,
  }));

  const serviceViews = services.map((s) => ({
    slug: s.slug,
    number: s.number,
    title: s.title,
    description: s.description,
  }));

  const email = settings?.primaryEmail ?? COMPANY.email;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: COMPANY.name,
          description: COMPANY.description,
          url: SITE_URL,
          email,
          logo: `${SITE_URL}/assets/logos/parvex-logo-full.png`,
          image: `${SITE_URL}/assets/logos/parvex-og-image.png`,
          slogan: COMPANY.tagline,
          knowsAbout: services.map((s) => s.title),
        }}
      />
      {/* Poster hero — intentionally unchanged. */}
      <Hero
        eyebrow={content?.heroEyebrow ?? undefined}
        supportingCopy={content?.heroSupportingCopy ?? undefined}
        primaryCtaLabel={content?.primaryCtaLabel ?? undefined}
        primaryCtaLink={content?.primaryCtaLink ?? undefined}
      />
      <StudioIntro />
      <ServicesPreview services={serviceViews} heading={content?.servicesHeading || undefined} />
      <ProjectsPreview projects={projectViews} heading={content?.selectedWorkHeading ?? undefined} />
      <AboutPreview />
      <MediaShowcase />
      <CTASection
        headline={content?.finalCtaHeadline ?? undefined}
        ctaLabel={content?.finalCtaLabel ?? undefined}
        ctaLink={content?.finalCtaLink ?? undefined}
        contactEmail={email}
      />
    </>
  );
}
