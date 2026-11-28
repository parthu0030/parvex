"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ProjectTile, type ProjectCardView } from "@/components/work/ProjectCards";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

/** Group free-text CMS categories into a few stable filters. */
function filterFor(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("ai")) return "AI Products";
  if (c.includes("creative") || c.includes("photo") || c.includes("video")) return "Creative";
  return "Web";
}

/**
 * WorkGrid — every published case study, filterable by discipline.
 * Data is fetched server-side in work/page.tsx and passed down.
 */
export function WorkGrid({ projects }: { projects: ProjectCardView[] }) {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [filter, setFilter] = useState("All");

  const filters = useMemo(() => {
    const set = new Set(projects.map((p) => filterFor(p.category)));
    return ["All", ...["AI Products", "Web", "Creative"].filter((f) => set.has(f))];
  }, [projects]);

  const visible = filter === "All" ? projects : projects.filter((p) => filterFor(p.category) === filter);

  return (
    <section
      id="all-work"
      className="scroll-mt-24 pb-24 md:pb-32 lg:pb-40 bg-white"
      aria-labelledby="work-grid-heading"
    >
      <Container>
        <div
          ref={headerRef}
          data-reveal
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16 pt-12 md:pt-16 border-t border-[#E8E8E8]"
        >
          <h2
            id="work-grid-heading"
            className="text-[28px] md:text-[36px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.1]"
          >
            Case studies
          </h2>
          {filters.length > 2 && (
            <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                    filter === f
                      ? "bg-[#0A0A0A] border-[#0A0A0A] text-white"
                      : "border-[#DADADA] text-[#6B6B6B] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {visible.length === 0 ? (
          <p className="text-[15px] text-[#6B6B6B] py-10">New case studies are on the way.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-14 md:gap-y-20" aria-live="polite">
            {visible.map((project, i) =>
              visible.length % 2 === 1 && i === visible.length - 1 && visible.length > 1 ? (
                // An odd last card is centred rather than left beside an empty cell.
                <div key={project.slug} className="md:col-span-2 md:w-[calc(50%-12px)] lg:w-[calc(50%-16px)] md:mx-auto">
                  <ProjectTile project={project} />
                </div>
              ) : (
                <ProjectTile key={project.slug} project={project} />
              )
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
