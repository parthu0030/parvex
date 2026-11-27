"use client";

import { Container } from "@/components/ui/Container";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

const INDEX = [
  { label: "Case studies", href: "#all-work" },
  { label: "Photography", href: "/work/photography-showcase" },
  { label: "Film & motion", href: "#film" },
];

/**
 * WorkHero — typographic opener for the Work page, with an in-page index.
 */
export function WorkHero({ projectCount }: { projectCount: number }) {
  useHeroAnimation();

  return (
    <section
      className="relative pt-[140px] pb-16 md:pt-[190px] md:pb-24 bg-white"
      aria-labelledby="work-hero-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-8 flex flex-col gap-7 md:gap-9">
            <div data-hero="eyebrow" data-hero-delay="60" className="flex items-center gap-3">
              <div className="w-5 h-px bg-[#6B6B6B]" aria-hidden="true" />
              <span className="eyebrow">Selected Work</span>
            </div>

            <h1
              id="work-hero-heading"
              className="font-semibold tracking-[-0.045em] leading-[1.0] text-[#0A0A0A]"
              style={{ fontSize: "clamp(42px, 7vw, 96px)" }}
            >
              <span data-hero="h1-line" data-hero-delay="120">
                <span>Work that speaks</span>
              </span>
              <span data-hero="h1-line" data-hero-delay="200">
                <span className="font-light italic text-[#6B6B6B]">for itself.</span>
              </span>
            </h1>

            <p
              data-hero="subtext"
              data-hero-delay="320"
              className="text-base md:text-[18px] text-[#6B6B6B] leading-[1.7] max-w-[560px] tracking-[-0.01em]"
            >
              Products, platforms and photography — each project documented
              honestly: what the problem was, what we built and how.
            </p>
          </div>

          <nav
            data-hero="ctas"
            data-hero-delay="420"
            aria-label="On this page"
            className="lg:col-span-4 flex flex-col border-t border-[#E8E8E8]"
          >
            {INDEX.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between py-4 border-b border-[#E8E8E8] text-[15px] text-[#0A0A0A]"
              >
                <span className="flex items-center gap-4">
                  <span className="text-[12px] text-[#A0A0A0] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="link-draw">{item.label}</span>
                </span>
                {i === 0 && <span className="text-[13px] text-[#6B6B6B] tabular-nums">{projectCount}</span>}
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
