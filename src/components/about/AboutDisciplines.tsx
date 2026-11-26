"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SERVICES, SERVICE_DISCIPLINES, getServicePresentation } from "@/data/services";
import { getPhoto } from "@/data/photography";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const STRIP = ["street-boy", "landscape-hills", "street-walk"] as const;

/**
 * AboutDisciplines — the three disciplines the studio works across, with a
 * strip of the studio's own photography.
 */
export function AboutDisciplines() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const colsRef = useRevealChildren<HTMLDivElement>(100, { threshold: 0.05 });
  const stripRef = useRevealChildren<HTMLDivElement>(90, { threshold: 0.05 });

  return (
    <section
      data-nav-theme="dark"
      className="py-24 md:py-32 lg:py-40 bg-[#0A0A0A] text-white"
      aria-labelledby="disciplines-heading"
    >
      <Container>
        <div ref={headerRef} data-reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20">
          <div className="flex flex-col gap-6">
            <span className="eyebrow !text-white/40">What we do</span>
            <h2
              id="disciplines-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[34px] md:text-5xl lg:text-[56px]"
            >
              Three disciplines,
              <span className="font-light italic text-white/50"> one team.</span>
            </h2>
          </div>
          <Link href="/services" className="group inline-flex items-center gap-2 text-[14px] text-white/80 hover:text-white w-fit">
            <span className="link-draw">All services</span>
            <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div ref={colsRef} className="grid grid-cols-1 md:grid-cols-3 gap-x-10 border-t border-white/10">
          {SERVICE_DISCIPLINES.map((d) => (
            <div key={d.name} data-reveal-child className="flex flex-col gap-5 py-10 border-b border-white/10 md:border-b-0">
              <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{d.name}</h3>
              <p className="text-[15px] text-white/55 leading-[1.7]">{d.summary}</p>
              <ul className="flex flex-col gap-2 pt-2">
                {SERVICES.filter((s) => getServicePresentation(s.slug ?? s.id).discipline === d.name).map((s) => (
                  <li key={s.id}>
                    <Link href={`/services#${s.slug ?? s.id}`} className="text-[15px] text-white/80 hover:text-white transition-colors duration-200">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div ref={stripRef} className="grid grid-cols-3 gap-3 md:gap-5 mt-16 md:mt-24">
          {STRIP.map((id) => {
            const photo = getPhoto(id);
            return (
              <div key={id} data-reveal-child className="relative aspect-[3/4] rounded-[10px] overflow-hidden bg-white/5">
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="33vw" />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
