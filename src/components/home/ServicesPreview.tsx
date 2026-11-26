"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getServicePresentation } from "@/data/services";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export interface ServicePreviewView {
  slug: string;
  number: string;
  title: string;
  description: string;
}

/**
 * ServicesPreview — an editorial service index.
 *
 * Large typographic rows; on desktop a monochrome preview image follows the
 * cursor over the list (pointer devices only). On touch screens each row
 * shows its description inline instead, so nothing depends on hover.
 */
export function ServicesPreview({
  services,
  heading = "Everything a modern brand needs,\nbuilt by one team.",
}: {
  services: ServicePreviewView[];
  heading?: string;
}) {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const listRef = useRevealChildren<HTMLUListElement>(55, { threshold: 0.04 });
  const areaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const area = areaRef.current;
    const preview = previewRef.current;
    if (!area || !preview) return;
    const rect = area.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      preview.style.transform = `translate3d(${x + 28}px, ${y - 140}px, 0)`;
    });
  }, []);

  if (services.length === 0) return null;

  const [line1, line2] = heading.split("\n");

  return (
    <section
      id="services"
      className="py-24 md:py-32 lg:py-40 bg-[#F6F6F5]"
      aria-labelledby="services-heading"
    >
      <Container>
        <div
          ref={headerRef}
          data-reveal
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 md:mb-20"
        >
          <div className="flex flex-col gap-6">
            <span className="eyebrow">Services</span>
            <h2
              id="services-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A] text-[34px] md:text-5xl lg:text-[56px] max-w-[820px]"
            >
              {line1}
              {line2 && (
                <>
                  <br className="hidden md:block" />{" "}
                  <span className="font-light italic text-[#6B6B6B]">{line2}</span>
                </>
              )}
            </h2>
          </div>
          <Button href="/services" variant="secondary" size="md" className="w-fit flex-shrink-0 btn-interactive">
            Explore services
          </Button>
        </div>

        <div
          ref={areaRef}
          className="relative"
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
        >
          {/* Cursor-follow preview (desktop pointer devices only) */}
          <div
            ref={previewRef}
            aria-hidden="true"
            className={cn(
              "service-preview pointer-events-none absolute left-0 top-0 z-10 hidden lg:block",
              "w-[300px] h-[210px] rounded-[10px] overflow-hidden bg-[#E8E8E8] shadow-[0_24px_60px_rgba(10,10,10,0.18)]",
              "[@media(hover:none)]:!hidden",
              active === null ? "opacity-0" : "opacity-100"
            )}
          >
            {services.map((s, i) => {
              const { image } = getServicePresentation(s.slug);
              return (
                <Image
                  key={s.slug}
                  src={image.src}
                  alt=""
                  fill
                  sizes="300px"
                  className={cn(
                    "object-cover img-mono transition-opacity duration-300",
                    active === i ? "opacity-100" : "opacity-0"
                  )}
                />
              );
            })}
          </div>

          <ul ref={listRef} className="border-t border-[#DADADA]">
            {services.map((service, i) => {
              const { tags } = getServicePresentation(service.slug);
              return (
                <li key={service.slug} data-reveal-child>
                  <Link
                    href={`/services#${service.slug}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="group grid grid-cols-[32px_1fr_auto] md:grid-cols-[56px_1fr_auto] lg:grid-cols-[72px_1fr_280px_48px] items-start lg:items-center gap-x-4 md:gap-x-6 py-6 md:py-8 border-b border-[#DADADA] focus-visible:outline-none focus-visible:bg-white"
                  >
                    <span className="text-[12px] text-[#A0A0A0] tabular-nums pt-2 lg:pt-0 transition-colors duration-300 group-hover:text-[#0A0A0A]">
                      {service.number || String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-2 min-w-0">
                      <h3
                        className="font-medium text-[#0A0A0A] tracking-[-0.03em] leading-[1.1] transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-hover:translate-x-2"
                        style={{ fontSize: "clamp(22px, 2.6vw, 36px)" }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-[14px] md:text-[15px] text-[#6B6B6B] leading-[1.6] max-w-[560px] lg:hidden">
                        {service.description}
                      </p>
                    </div>
                    <ul className="hidden lg:flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-[#6B6B6B]">
                      {tags.map((t, ti) => (
                        <li key={t} className="flex items-center gap-3">
                          {t}
                          {ti < tags.length - 1 && <span className="text-[#C8C8C8]" aria-hidden="true">/</span>}
                        </li>
                      ))}
                    </ul>
                    <span
                      className="w-10 h-10 rounded-full border border-[#D0D0D0] flex items-center justify-center justify-self-end transition-colors duration-300 group-hover:bg-[#0A0A0A] group-hover:border-[#0A0A0A]"
                      aria-hidden="true"
                    >
                      <ArrowUpRight size={16} className="text-[#0A0A0A] transition-colors duration-300 group-hover:text-white" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
