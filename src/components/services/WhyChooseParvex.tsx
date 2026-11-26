"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { getPhoto } from "@/data/photography";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const REASONS = [
  { title: "One team, end to end", body: "Strategy, design, engineering and media under one roof — no agency relay race, no lost context between hand-offs." },
  { title: "Senior attention", body: "We take on a small number of projects at a time, so the people you meet are the people who do the work." },
  { title: "Built on modern foundations", body: "Current, well-supported tools chosen for longevity — easy to maintain after launch, not just impressive on day one." },
  { title: "Performance is a feature", body: "Fast load times, accessible markup and search-ready structure are part of the brief, not an upsell." },
  { title: "Clear, honest communication", body: "Fixed milestones, regular check-ins and plain answers — including when something isn't worth building." },
  { title: "We stay after launch", body: "Support, iteration and maintenance for the projects that need to keep evolving." },
];

/**
 * WhyChooseParvex — editorial two-column list (no card grid), anchored by a
 * single photograph from the studio's own archive.
 */
export function WhyChooseParvex() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const listRef = useRevealChildren<HTMLOListElement>(60, { threshold: 0.04 });
  const photo = getPhoto("street-artisan");

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-white border-t border-[#E8E8E8]" aria-labelledby="why-choose-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
          <div ref={headerRef} data-reveal className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">Why Parvex</span>
            <h2
              id="why-choose-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A] text-[34px] md:text-[44px]"
            >
              Why clients
              <span className="font-light italic text-[#6B6B6B]"> work with us.</span>
            </h2>
            <div className="relative hidden lg:block aspect-[3/4] rounded-[12px] overflow-hidden bg-[#E8E8E8]">
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="30vw" />
            </div>
          </div>

          <ol ref={listRef} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 border-t border-[#E8E8E8]">
            {REASONS.map((r, i) => (
              <li
                key={r.title}
                data-reveal-child
                className="flex flex-col gap-3 py-8 md:py-10 border-b border-[#E8E8E8]"
              >
                <span className="text-[12px] text-[#A0A0A0] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-[20px] md:text-[22px] font-medium text-[#0A0A0A] tracking-[-0.02em]">{r.title}</h3>
                <p className="text-[15px] text-[#6B6B6B] leading-[1.7]">{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
