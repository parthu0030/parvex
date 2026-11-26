"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getServicePresentation, SERVICE_DISCIPLINES } from "@/data/services";
import { useRevealChildren } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export interface ServiceListItemView {
  slug: string;
  title: string;
  description: string;
  longDescription: string | null;
  deliverables: string[];
  outcome: string | null;
  imageUrl: string;
  imageAlt?: string | null;
}

/**
 * ServicesList — every service, grouped by discipline.
 * Each service answers: what it is, who it's for, what you get, and how to
 * start — with a deep link that pre-selects it on the contact form.
 */
export function ServicesList({ services }: { services: ServiceListItemView[] }) {
  const groups = SERVICE_DISCIPLINES.map((d) => ({
    ...d,
    items: services.filter((s) => getServicePresentation(s.slug).discipline === d.name),
  }))
    .filter((g) => g.items.length > 0)
    .map((g, i, all) => ({
      ...g,
      startIndex: all.slice(0, i).reduce((n, prev) => n + prev.items.length, 0),
    }));

  return (
    <section id="services" className="bg-white" aria-label="Services">
      {groups.map((group, gi) => (
        <div
          key={group.name}
          className={cn("py-20 md:py-28", gi % 2 === 1 ? "bg-[#F6F6F5]" : "bg-white")}
          aria-labelledby={`discipline-${gi}`}
          role="region"
        >
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 mb-12 md:mb-16 pb-8 border-b border-[#DADADA]">
              <div className="lg:col-span-5 flex items-baseline gap-4">
                <span className="text-[12px] text-[#A0A0A0] tabular-nums">{String(gi + 1).padStart(2, "0")}</span>
                <h2
                  id={`discipline-${gi}`}
                  className="text-[30px] md:text-[40px] font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A]"
                >
                  {group.name}
                </h2>
              </div>
              <p className="lg:col-span-7 text-[16px] md:text-[17px] text-[#6B6B6B] leading-[1.7] max-w-[560px] lg:justify-self-end lg:text-right self-end">
                {group.summary}
              </p>
            </div>

            <ServiceGroup items={group.items} startIndex={group.startIndex} />
          </Container>
        </div>
      ))}
    </section>
  );
}

function ServiceGroup({ items, startIndex }: { items: ServiceListItemView[]; startIndex: number }) {
  const ref = useRevealChildren<HTMLDivElement>(110, { threshold: 0.03 });

  return (
    <div ref={ref} className="flex flex-col gap-20 md:gap-28">
      {items.map((service, i) => {
        const presentation = getServicePresentation(service.slug);
        const imageSrc = service.imageUrl || presentation.image.src;
        const imageAlt = service.imageUrl ? service.imageAlt ?? service.title : presentation.image.alt;
        const flip = i % 2 === 1;

        return (
          <article
            key={service.slug}
            id={service.slug}
            data-reveal-child
            className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
            aria-labelledby={`${service.slug}-title`}
          >
            <div
              className={cn(
                "lg:col-span-6 relative aspect-[4/3] rounded-[14px] overflow-hidden bg-[#E8E8E8] image-hover-zoom",
                flip && "lg:order-last"
              )}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className={cn("object-cover object-center", (imageSrc.includes("images.unsplash.com") || (!service.imageUrl && presentation.image.mono)) && "img-mono")}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="lg:col-span-6 flex flex-col gap-7 lg:px-4">
              <div className="flex flex-col gap-4">
                <span className="text-[12px] text-[#A0A0A0] tracking-[0.12em] uppercase tabular-nums">
                  {String(startIndex + i + 1).padStart(2, "0")} — {presentation.tags.join(" · ")}
                </span>
                <h3
                  id={`${service.slug}-title`}
                  className="font-semibold text-[#0A0A0A] tracking-[-0.035em] leading-[1.05]"
                  style={{ fontSize: "clamp(28px, 3.2vw, 44px)" }}
                >
                  {service.title}
                </h3>
                <p className="text-[16px] md:text-[18px] text-[#4A4A4A] leading-[1.65] max-w-[560px]">
                  {service.longDescription || service.description}
                </p>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 border-t border-[#E0E0E0] pt-6">
                <div className="flex flex-col gap-2">
                  <dt className="eyebrow">Ideal for</dt>
                  <dd className="text-[15px] text-[#0A0A0A] leading-[1.6]">{presentation.idealFor}</dd>
                </div>
                {service.deliverables.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <dt className="eyebrow">What you get</dt>
                    <dd>
                      <ul className="flex flex-col gap-1.5">
                        {service.deliverables.map((item) => (
                          <li key={item} className="text-[15px] text-[#4A4A4A] leading-[1.5] flex gap-2.5">
                            <span className="mt-[9px] w-1 h-1 rounded-full bg-[#0A0A0A] flex-shrink-0" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 pt-2">
                <Link
                  href={`/contact?service=${service.slug}`}
                  className="group inline-flex w-fit flex-shrink-0 whitespace-nowrap items-center gap-2 rounded-full bg-[#0A0A0A] text-white px-6 py-3 text-[14px] font-medium hover:bg-[#262626] transition-colors duration-300"
                >
                  Enquire about {shortName(service.title)}
                  <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                {service.outcome && (
                  <p className="text-[14px] text-[#6B6B6B] italic leading-[1.5]">{service.outcome}</p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function shortName(title: string) {
  const t = title.split(/\s*[&,]\s*/)[0];
  return t.length > 22 ? "this service" : t.toLowerCase().replace(/^ui\/ux/, "UI/UX").replace(/^ai/, "AI");
}
