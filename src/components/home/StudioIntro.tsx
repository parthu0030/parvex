"use client";

import { Container } from "@/components/ui/Container";
import { SERVICE_DISCIPLINES } from "@/data/services";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const AUDIENCES = ["Startups", "Growing businesses", "Creators & personal brands", "Agencies & studios"];

/**
 * StudioIntro — the first thing after the hero poster. Answers, in one read:
 * who Parvex is, what it does, and who it is for.
 */
export function StudioIntro() {
  const statementRef = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const listRef = useRevealChildren<HTMLDivElement>(90, { threshold: 0.1 });

  return (
    <section
      id="studio"
      className="py-24 md:py-32 lg:py-40 bg-white"
      aria-labelledby="studio-intro-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
          <div ref={statementRef} data-reveal className="lg:col-span-8 flex flex-col gap-8">
            <span className="eyebrow">The Studio</span>
            <h2
              id="studio-intro-heading"
              className="font-medium tracking-[-0.03em] leading-[1.15] text-[#0A0A0A] max-w-[860px]"
              style={{ fontSize: "clamp(24px, 3.6vw, 46px)" }}
            >
              Parvex is a creative technology studio. We design, engineer and
              film the things that make a business{" "}
              <span className="text-[#8A8A8A]">
                look credible and work properly — websites, applications,
                brands and visual stories, under one roof.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 lg:pt-12 flex flex-col gap-10">
            <div ref={listRef} className="flex flex-col">
              {SERVICE_DISCIPLINES.map((d, i) => (
                <div
                  key={d.name}
                  data-reveal-child
                  className="flex gap-5 py-5 border-t border-[#E8E8E8] last:border-b"
                >
                  <span className="text-[12px] text-[#A0A0A0] tabular-nums pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[16px] font-semibold text-[#0A0A0A] tracking-[-0.01em]">
                      {d.name}
                    </h3>
                    <p className="text-[14px] text-[#6B6B6B] leading-[1.6]">{d.summary}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="eyebrow">Who we work with</span>
              <ul className="flex flex-wrap gap-2">
                {AUDIENCES.map((a) => (
                  <li
                    key={a}
                    className="text-[13px] text-[#0A0A0A] border border-[#E0E0E0] rounded-full px-3.5 py-1.5"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
