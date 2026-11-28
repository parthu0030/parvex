import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { CaseStudyProject } from "@/types";
import { cn } from "@/lib/utils";

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * ProjectLinkButtons — "Live demo" and "GitHub" actions for a case study.
 * Renders nothing if the project has neither link.
 */
export function ProjectLinkButtons({
  project,
  className,
}: {
  project: Pick<CaseStudyProject, "title" | "liveUrl" | "repoUrl">;
  className?: string;
}) {
  if (!project.liveUrl && !project.repoUrl) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] text-white px-6 py-3 text-[14px] font-medium hover:bg-[#262626] transition-colors duration-300"
        >
          Live demo
          <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <span className="sr-only">: open {project.title} in a new tab</span>
        </a>
      )}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-[#0A0A0A] text-[#0A0A0A] px-6 py-3 text-[14px] font-medium hover:bg-[#0A0A0A] hover:text-white transition-colors duration-300"
        >
          GitHub repository
          <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <span className="sr-only">: view {project.title} source code in a new tab</span>
        </a>
      )}
    </div>
  );
}

/** Lets a long address wrap only after "." "/" or "-" — never mid-word. */
function breakable(text: string) {
  return text.split(/(?<=[./-])/).map((part, i) => (
    <span key={i}>
      {i > 0 && <wbr />}
      {part}
    </span>
  ));
}

/**
 * CaseStudyLinks — closing "see it in action" block with both links and
 * their addresses, so visitors know exactly where they're going.
 */
export function CaseStudyLinks({ project }: { project: CaseStudyProject }) {
  if (!project.liveUrl && !project.repoUrl) return null;
  return (
    <section className="py-20 md:py-28 border-b border-[#E8E8E8]" aria-labelledby="links-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div data-reveal className="lg:col-span-7 flex flex-col gap-5">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B]">Explore</p>
            <h2
              id="links-heading"
              className="text-2xl md:text-[36px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.2]"
            >
              See it in action.
            </h2>
            <ProjectLinkButtons project={project} className="pt-2" />
          </div>
          <dl data-reveal className="lg:col-span-5 flex flex-col border-t border-[#E8E8E8]">
            {project.liveUrl && (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 py-4 border-b border-[#E8E8E8]">
                <dt className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B]">Live</dt>
                <dd className="text-[14px] text-[#0A0A0A] sm:text-right">{breakable(host(project.liveUrl))}</dd>
              </div>
            )}
            {project.repoUrl && (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 py-4 border-b border-[#E8E8E8]">
                <dt className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B]">Source</dt>
                <dd className="text-[14px] text-[#0A0A0A] sm:text-right">{breakable(host(project.repoUrl))}</dd>
              </div>
            )}
          </dl>
        </div>
      </Container>
    </section>
  );
}
