import { Container } from "@/components/ui/Container";
import type { CaseStudyProject } from "@/types";

/**
 * CaseStudyFeatures — the implemented capabilities, numbered and scannable.
 * Only rendered when the project lists features (each verified in code).
 */
export function CaseStudyFeatures({ project }: { project: CaseStudyProject }) {
  const features = project.features ?? [];
  if (features.length === 0) return null;

  return (
    <section className="py-20 md:py-28 border-b border-[#E8E8E8]" aria-labelledby="features-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div data-reveal className="lg:col-span-3">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B6B6B] lg:sticky lg:top-32">
              Key features
            </p>
          </div>
          <div className="lg:col-span-9">
            <h2
              id="features-heading"
              data-reveal
              className="text-2xl md:text-[32px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.25] mb-10 md:mb-12"
            >
              What it does.
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-12 border-t border-[#E8E8E8]">
              {features.map((f, i) => (
                <li key={f.title} data-reveal className="flex gap-5 py-7 border-b border-[#E8E8E8]">
                  <span className="text-[12px] text-[#A0A0A0] tabular-nums pt-1 w-6 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[17px] md:text-[18px] font-semibold text-[#0A0A0A] tracking-[-0.015em] leading-[1.3]">
                      {f.title}
                    </h3>
                    <p className="text-[15px] text-[#5A5A5A] leading-[1.7]">{f.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
