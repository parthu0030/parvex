"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

/**
 * ServicesHero — editorial opener for the Services page, with a compact
 * index of every service so visitors can jump straight to what they need.
 */
export function ServicesHero({ services }: { services: { slug: string; title: string }[] }) {
  useHeroAnimation();

  return (
    <section
      className="relative pt-[140px] pb-16 md:pt-[190px] md:pb-24 bg-white"
      aria-labelledby="services-hero-heading"
    >
      <Container className="flex flex-col gap-12 md:gap-16">
        <div className="flex flex-col gap-8 md:gap-10">
          <div data-hero="eyebrow" data-hero-delay="60" className="flex items-center gap-3">
            <div className="w-5 h-px bg-[#6B6B6B]" aria-hidden="true" />
            <span className="eyebrow">Services</span>
          </div>

          <h1
            id="services-hero-heading"
            className="font-semibold tracking-[-0.045em] leading-[1.0] text-[#0A0A0A] max-w-[1000px]"
            style={{ fontSize: "clamp(42px, 7vw, 96px)" }}
          >
            <span data-hero="h1-line" data-hero-delay="120">
              <span>Engineering and craft,</span>
            </span>
            <span data-hero="h1-line" data-hero-delay="200">
              <span className="font-light italic text-[#6B6B6B]">under one roof.</span>
            </span>
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
            <p
              data-hero="subtext"
              data-hero-delay="320"
              className="text-base md:text-[18px] text-[#6B6B6B] leading-[1.7] max-w-[560px] tracking-[-0.01em]"
            >
              We design, build, shoot and edit — so nothing about how your
              brand looks or works feels like it came from a different team.
              Pick one service or bring us the whole problem.
            </p>

            <div data-hero="ctas" data-hero-delay="400" className="flex-shrink-0">
              <Button href="/contact" variant="primary" size="lg" className="btn-interactive">
                Start a project
              </Button>
            </div>
          </div>
        </div>

        <nav
          data-hero="image"
          data-hero-delay="480"
          aria-label="Jump to a service"
          className="border-t border-[#E8E8E8] pt-6"
        >
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <a
                  href={`#${s.slug}`}
                  className="inline-flex text-[13px] text-[#0A0A0A] border border-[#DADADA] rounded-full px-4 py-2 hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] transition-colors duration-300"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
