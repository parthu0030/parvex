import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAdjacentProjects, getAllPublishedSlugs } from "@/lib/queries/projects";
import { toCaseStudyProject } from "@/lib/queries/adapters";
import { CaseStudyHero } from "@/components/casestudy/CaseStudyHero";
import { CaseStudyOverview } from "@/components/casestudy/CaseStudyOverview";
import { CaseStudyChallenge } from "@/components/casestudy/CaseStudyChallenge";
import { CaseStudySolution } from "@/components/casestudy/CaseStudySolution";
import { CaseStudyResearch } from "@/components/casestudy/CaseStudyResearch";
import { CaseStudyDevelopment } from "@/components/casestudy/CaseStudyDevelopment";
import { CaseStudyTechnology } from "@/components/casestudy/CaseStudyTechnology";
import { CaseStudyGallery } from "@/components/casestudy/CaseStudyGallery";
import { CaseStudyResults } from "@/components/casestudy/CaseStudyResults";
import { CaseStudyNavigation } from "@/components/casestudy/CaseStudyNavigation";
import { CTASection } from "@/components/home/CTASection";
import { PhotographyPortfolio } from "@/components/photography/PhotographyPortfolio";
import { PHOTOGRAPHY_SHOWCASE_SLUG } from "@/data/photography";
import { VideoPortfolio } from "@/components/videography/VideoPortfolio";
import { VIDEOGRAPHY_SHOWCASE_SLUG } from "@/data/videography";
import { buildPageMetadata } from "@/lib/seo";
import { CaseStudyAnimationInit } from "@/components/casestudy/CaseStudyAnimationInit";
import { CaseStudyFeatures } from "@/components/casestudy/CaseStudyFeatures";
import { CaseStudyLinks } from "@/components/casestudy/CaseStudyLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/data/company";
import { recordAnalyticsEvent } from "@/lib/analytics";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Failed to generateStaticParams for work/[slug]:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) return {};

    return buildPageMetadata({
      title: project.metaTitle ?? project.title,
      description: project.metaDescription ?? project.description,
      path: `/work/${project.slug}`,
      canonical: project.canonicalUrl,
      noIndex: project.noIndex,
      image: project.coverImage ? { url: project.coverImage.url, alt: project.coverImage.altText ?? project.title } : null,
    });
  } catch (error) {
    console.error("Error generating metadata for work/[slug]:", error);
    return {};
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  let projectRecord = null;
  try {
    projectRecord = await getProjectBySlug(slug);
  } catch (error) {
    console.error("Error fetching project in CaseStudyPage:", error);
  }

  if (!projectRecord) notFound();

  let next = null;
  try {
    const adjacent = await getAdjacentProjects(slug);
    next = adjacent.next;
  } catch (error) {
    console.error("Error fetching adjacent projects in CaseStudyPage:", error);
  }
  const project = toCaseStudyProject(projectRecord, next?.slug ?? "");
  const isPhotographyShowcase = project.slug === PHOTOGRAPHY_SHOWCASE_SLUG;
  const isVideographyShowcase = project.slug === VIDEOGRAPHY_SHOWCASE_SLUG;

  // First-party analytics — never blocks rendering, never throws to the page.
  void recordAnalyticsEvent("PROJECT_VIEWED", projectRecord.id);

  return (
    <>
      {/* Client-side animation initialiser — mounts hero + scroll reveals */}
      <CaseStudyAnimationInit />
      {(project.liveUrl || project.repoUrl) && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: project.subtitle ? `${project.title} — ${project.subtitle}` : project.title,
            description: project.description,
            applicationCategory: "WebApplication",
            operatingSystem: "Web",
            url: project.liveUrl ?? `${SITE_URL}/work/${project.slug}`,
            ...(project.repoUrl ? { sameAs: [project.repoUrl] } : {}),
            creator: { "@type": "Organization", name: "Parvex", url: SITE_URL },
          }}
        />
      )}

      {isPhotographyShowcase ? (
        <>
          {/* Photography Showcase: the complete portfolio comes first, then
              the write-up of how the portfolio was designed and built. The
              cover and generic gallery are skipped — they would repeat
              photographs that are already in the portfolio. */}
          <CaseStudyHero project={project} showCover={false} />
          <PhotographyPortfolio />
          <CaseStudyOverview project={project} />
          <CaseStudyChallenge project={project} />
          <CaseStudySolution project={project} />
          {project.research && <CaseStudyResearch project={project} />}
          <CaseStudyDevelopment project={project} />
          <CaseStudyTechnology project={project} />
          {project.results.length > 0 && <CaseStudyResults project={project} />}
        </>
      ) : isVideographyShowcase ? (
        <>
          {/* Videography Showcase: the films come first, then the write-up of
              how the video portfolio was designed and built. The stock cover
              is skipped so the first moving image is Parvex's own work. */}
          <CaseStudyHero project={project} showCover={false} />
          <VideoPortfolio />
          <CaseStudyOverview project={project} />
          <CaseStudyChallenge project={project} />
          <CaseStudySolution project={project} />
          {project.research && <CaseStudyResearch project={project} />}
          <CaseStudyDevelopment project={project} />
          <CaseStudyTechnology project={project} />
          {project.results.length > 0 && <CaseStudyResults project={project} />}
        </>
      ) : (
        <>
          {/* Storytelling order per Phase 3 spec */}
          <CaseStudyHero project={project} />
          <CaseStudyOverview project={project} />
          <CaseStudyChallenge project={project} />
          <CaseStudySolution project={project} />
          <CaseStudyFeatures project={project} />
          {project.research && <CaseStudyResearch project={project} />}
          <CaseStudyDevelopment project={project} />
          <CaseStudyTechnology project={project} />
          <CaseStudyGallery project={project} />
          {project.results.length > 0 && <CaseStudyResults project={project} />}
          <CaseStudyLinks project={project} />
        </>
      )}
      {next && (
        <CaseStudyNavigation
          nextProject={{
            slug: next.slug,
            title: next.title,
            category: next.category,
            description: next.description,
            thumbnail: next.coverImage?.url ?? next.thumbnail?.url ?? "/assets/projects/auditgpt.png",
            thumbnailAlt: next.coverImage?.altText ?? next.thumbnail?.altText ?? next.title,
          }}
        />
      )}
      <CTASection headline="Have a similar idea?" />
    </>
  );
}
