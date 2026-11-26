"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const PRINCIPLES = [
  {
    title: "Craft and code, one standard",
    body: "The person shaping how it looks sits next to the person building how it works. Nothing gets lost in a hand-off.",
  },
  {
    title: "Fewer projects, full attention",
    body: "We keep our roster small on purpose, so every project gets senior thinking from brief to launch.",
  },
  {
    title: "Honest technology",
    body: "We recommend the simplest stack that does the job well — and tell you plainly when AI isn't the answer.",
  },
];

/**
 * AboutPreview — the thinking behind the studio, on the homepage.
 *
 * Deliberately text-led: the homepage introduces Parvex and its services,
 * while photography lives in the dedicated portfolio on /work#photography.
 */
export function AboutPreview() {
  const textRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const listRef = useRevealChildren<HTMLUListElement>(90, { threshold: 0.1 });

  return (
    <section
      id="about"
      data-nav-theme="dark"
      className="py-24 md:py-32 lg:py-40 bg-[#0A0A0A] text-white"
      aria-labelledby="about-preview-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          <div
            ref={textRef}
            data-reveal
            className="lg:col-span-6 flex flex-col gap-8 lg:sticky lg:top-28"
          >
            <span className="eyebrow !text-white/40">About Parvex</span>
            <h2
              id="about-preview-heading"
              className="font-semibold tracking-[-0.04em] leading-[1.02]"
              style={{ fontSize: "clamp(36px, 5.2vw, 72px)" }}
            >
              We care how it looks
              <span className="font-light italic text-white/50"> and how it works.</span>
            </h2>
            <p className="text-[16px] md:text-[18px] text-white/60 leading-[1.75] max-w-[520px]">
              Parvex brings software engineering and visual craft into the
              same room, because the best digital work needs both. We bring
              engineering discipline to creative work — and a
              photographer&apos;s eye to software.
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button
                href="/about"
                variant="secondary"
                size="md"
                className="w-fit btn-interactive border-white/30 text-white hover:bg-white hover:text-[#0A0A0A]"
              >
                More about the studio
              </Button>
              {/* Always-present route to the photography portfolio, even if
                  the CMS has no featured projects to show below. */}
              <Link
                href="/work#photography"
                className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-white/80 hover:text-white"
              >
                <span className="link-draw">See our photography</span>
                <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <ul ref={listRef} className="lg:col-span-6 flex flex-col border-t border-white/10 lg:mt-3">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.title}
                data-reveal-child
                className="grid grid-cols-[48px_1fr] gap-4 py-9 md:py-11 border-b border-white/10"
              >
                <span className="text-[12px] text-white/35 tabular-nums pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[21px] md:text-[26px] font-medium tracking-[-0.025em] leading-[1.2]">{p.title}</h3>
                  <p className="text-[15px] md:text-[16px] text-white/55 leading-[1.75] max-w-[480px]">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
