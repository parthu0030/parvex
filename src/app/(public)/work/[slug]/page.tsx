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
import { buildPageMetadata } from "@/lib/seo";
import { CaseStudyAnimationInit } from "@/components/casestudy/CaseStudyAnimationInit";
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

  // First-party analytics — never blocks rendering, never throws to the page.
  void recordAnalyticsEvent("PROJECT_VIEWED", projectRecord.id);

  return (
    <>
      {/* Client-side animation initialiser — mounts hero + scroll reveals */}
      <CaseStudyAnimationInit />

      {/* Storytelling order per Phase 3 spec */}
      <CaseStudyHero project={project} />
      <CaseStudyOverview project={project} />
      <CaseStudyChallenge project={project} />
      <CaseStudySolution project={project} />
      {project.research && <CaseStudyResearch project={project} />}
      <CaseStudyDevelopment project={project} />
      <CaseStudyTechnology project={project} />
      <CaseStudyGallery project={project} />
      {project.results.length > 0 && <CaseStudyResults project={project} />}
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
