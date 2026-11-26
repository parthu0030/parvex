"use client";

import { Container } from "@/components/ui/Container";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const PILLARS = [
  {
    label: "Vision",
    title: "Make the small studio the obvious choice.",
    body: "We want growing businesses to get the kind of design and engineering usually reserved for companies with enormous budgets — without the layers, the jargon or the waiting.",
  },
  {
    label: "Creative philosophy",
    title: "Restraint is a design decision.",
    body: "We remove until only what matters is left. Strong typography, honest imagery, generous space and motion that serves a purpose — never decoration for its own sake.",
  },
  {
    label: "Approach to technology",
    title: "Use the right tool, then make it disappear.",
    body: "We choose modern, well-supported technology for longevity, and we apply AI only where it measurably removes effort. Visitors should feel the quality, not see the stack.",
  },
  {
    label: "Commitment to quality",
    title: "Finished means finished.",
    body: "Every breakpoint, every empty state, every frame and every sentence gets considered. We would rather do fewer things properly than many things almost.",
  },
];

export function AboutPhilosophy() {
  const statementRef = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const gridRef = useRevealChildren<HTMLDivElement>(90, { threshold: 0.05 });

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-white" aria-labelledby="philosophy-heading">
      <Container>
        <div ref={statementRef} data-reveal className="max-w-[1000px] mb-20 md:mb-28">
          <span className="eyebrow">What we believe</span>
          <h2
            id="philosophy-heading"
            className="mt-7 font-medium tracking-[-0.03em] leading-[1.18] text-[#0A0A0A]"
            style={{ fontSize: "clamp(26px, 3.4vw, 44px)" }}
          >
            Most businesses end up with a designer who can&apos;t build, a
            developer who can&apos;t design and a photographer who&apos;s never
            seen the website.{" "}
            <span className="text-[#8A8A8A]">
              Parvex exists to close those gaps — one team, one standard,
              from the first sketch to the final frame.
            </span>
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-16 border-t border-[#E8E8E8]">
          {PILLARS.map((p) => (
            <div key={p.label} data-reveal-child className="flex flex-col gap-4 py-10 md:py-12 border-b border-[#E8E8E8]">
              <span className="eyebrow">{p.label}</span>
              <h3 className="text-[22px] md:text-[28px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.2]">
                {p.title}
              </h3>
              <p className="text-[15px] md:text-[16px] text-[#6B6B6B] leading-[1.75] max-w-[520px]">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
