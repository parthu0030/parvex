import type { Metadata } from "next";
import { WorkHero } from "@/components/work/WorkHero";
import { WorkGrid } from "@/components/work/WorkGrid";
import { WorkPhotography } from "@/components/work/WorkPhotography";
import { WorkVideography } from "@/components/work/WorkVideography";
import { CTASection } from "@/components/home/CTASection";
import { getPublishedProjects } from "@/lib/queries/projects";
import { getPageContent } from "@/lib/queries/content";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("WORK");
  return buildPageMetadata({
    title: content?.metaTitle ?? "Selected Work",
    description:
      content?.metaDescription ??
      "Case studies from Parvex — AI products, web applications and editorial photography, each written up with the problem, the approach and how it was built.",
    path: "/work",
    canonical: content?.canonicalUrl,
    noIndex: content?.noIndex,
  });
}

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  const workCards = projects.map((p) => ({
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

  return (
    <>
      <WorkHero projectCount={workCards.length} />
      <WorkGrid projects={workCards} />
      <WorkPhotography />
      <WorkVideography />
      <CTASection headline="Like what you see?" />
    </>
  );
}
