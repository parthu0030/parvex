"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProjectFeature, ProjectTile, type ProjectCardView } from "@/components/work/ProjectCards";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

export type FeaturedProjectView = ProjectCardView;

/**
 * ProjectsPreview — "Selected Work" on the homepage.
 * One lead case study in a split layout, then the rest as a tile grid.
 */
export function ProjectsPreview({
  projects,
  heading = "Selected work.",
}: {
  projects: ProjectCardView[];
  heading?: string;
}) {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const leadRef = useReveal<HTMLDivElement>({ threshold: 0.08 });
  const gridRef = useRevealChildren<HTMLDivElement>(110, { threshold: 0.05 });

  if (projects.length === 0) return null;
  const [lead, ...rest] = projects;

  return (
    <section
      id="work"
      className="py-24 md:py-32 lg:py-40 bg-white"
      aria-labelledby="projects-heading"
    >
      <Container>
        <div
          ref={headerRef}
          data-reveal
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 md:mb-20"
        >
          <div className="flex flex-col gap-6 max-w-[720px]">
            <span className="eyebrow">Selected Work</span>
            <h2
              id="projects-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A] text-[34px] md:text-5xl lg:text-[56px]"
            >
              {heading}
            </h2>
            <p className="text-[16px] text-[#6B6B6B] leading-[1.7] max-w-[520px]">
              Products, platforms and visual work — each written up as a case
              study: the problem, the approach and how it was built.
            </p>
          </div>
          <Button href="/work" variant="secondary" size="md" className="w-fit flex-shrink-0 btn-interactive">
            View all work
          </Button>
        </div>

        <div ref={leadRef} data-reveal>
          <ProjectFeature project={lead} index={0} />
        </div>

        {rest.length > 0 && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-14 mt-20 md:mt-28 pt-14 md:pt-16 border-t border-[#E8E8E8]"
          >
            {rest.map((project, i) => (
              <div
                key={project.slug}
                data-reveal-child
                className={
                  rest.length % 2 === 1 && i === rest.length - 1
                    ? "md:col-span-2 md:w-[calc(50%-12px)] md:mx-auto xl:col-span-1 xl:w-auto xl:mx-0"
                    : undefined
                }
              >
                <ProjectTile project={project} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
