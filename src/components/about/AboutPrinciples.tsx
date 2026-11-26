"use client";

import { Container } from "@/components/ui/Container";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const WORKING = [
  { title: "You talk to the makers", body: "No account managers in between. The people on your calls are the people designing, building and shooting." },
  { title: "Clear scope, clear price", body: "Every project starts with a written scope and estimate, so you know what you're getting before you commit." },
  { title: "Progress you can see", body: "Work is shared at each milestone — prototypes, previews and rough cuts — not revealed all at once at the end." },
  { title: "Built to be handed over", body: "Clean code, documented decisions and editable files. You own what we make, and you're never locked in." },
];

export function AboutPrinciples() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const listRef = useRevealChildren<HTMLOListElement>(80, { threshold: 0.05 });

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-white" aria-labelledby="working-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div ref={headerRef} data-reveal className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">Working with us</span>
            <h2
              id="working-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A] text-[34px] md:text-[44px]"
            >
              What you can
              <span className="font-light italic text-[#6B6B6B]"> expect.</span>
            </h2>
          </div>
          <ol ref={listRef} className="lg:col-span-8 border-t border-[#E8E8E8]">
            {WORKING.map((w, i) => (
              <li key={w.title} data-reveal-child className="grid grid-cols-[48px_1fr] md:grid-cols-[80px_1fr_1.2fr] gap-x-6 gap-y-2 py-8 md:py-10 border-b border-[#E8E8E8]">
                <span className="text-[12px] text-[#A0A0A0] tabular-nums pt-1.5">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-[20px] md:text-[22px] font-medium text-[#0A0A0A] tracking-[-0.02em]">{w.title}</h3>
                <p className="col-start-2 md:col-start-3 text-[15px] text-[#6B6B6B] leading-[1.7]">{w.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
