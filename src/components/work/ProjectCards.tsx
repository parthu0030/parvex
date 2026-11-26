import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectCardView {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  services: string[];
  status: "LIVE" | "IN_PROGRESS" | "CONCEPT";
}

/**
 * Parvex's own photography is already monochrome and real project
 * screenshots (local or Cloudinary) keep their colour; only illustrative
 * Unsplash imagery gets the mono treatment.
 */
export function monoClass(src: string) {
  return src.includes("images.unsplash.com") ? "img-mono" : "";
}

function StatusTag({ status, inverted = false }: { status: ProjectCardView["status"]; inverted?: boolean }) {
  if (status === "LIVE") return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase",
        inverted ? "bg-white/90 text-[#0A0A0A]" : "bg-[#0A0A0A] text-white"
      )}
    >
      {status === "CONCEPT" ? "Concept" : "In progress"}
    </span>
  );
}

function Meta({ project }: { project: ProjectCardView }) {
  return (
    <p className="flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] uppercase text-[#6B6B6B]">
      <span>{project.category}</span>
      <span className="w-1 h-1 rounded-full bg-[#C8C8C8]" aria-hidden="true" />
      <span className="tabular-nums">{project.year}</span>
    </p>
  );
}

/**
 * ProjectFeature — large split layout for the lead case study.
 */
export function ProjectFeature({
  project,
  index,
  priority = false,
}: {
  project: ProjectCardView;
  index: number;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="View"
      className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center focus-visible:outline-none"
    >
      <div className="lg:col-span-7 relative aspect-[4/3] md:aspect-[16/10] rounded-[14px] overflow-hidden bg-[#E8E8E8] image-hover-zoom group-focus-visible:ring-2 group-focus-visible:ring-[#0A0A0A] group-focus-visible:ring-offset-4">
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          fill
          priority={priority}
          className={cn("object-cover object-center", monoClass(project.imageSrc))}
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div className="absolute top-4 left-4">
          <StatusTag status={project.status} inverted />
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6">
        <span className="text-[12px] text-[#A0A0A0] tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Meta project={project} />
        <h3
          className="font-semibold text-[#0A0A0A] tracking-[-0.035em] leading-[1.02]"
          style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
        >
          {project.title}
        </h3>
        <p className="text-[16px] md:text-[17px] text-[#5A5A5A] leading-[1.7] max-w-[460px]">
          {project.description}
        </p>
        {project.services.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {project.services.slice(0, 4).map((s) => (
              <li key={s} className="text-[12px] text-[#0A0A0A] border border-[#DADADA] rounded-full px-3 py-1">
                {s}
              </li>
            ))}
          </ul>
        )}
        <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0A0A0A] mt-1">
          <span className="link-draw">Read the case study</span>
          <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

/**
 * ProjectTile — compact case-study card for grids.
 */
export function ProjectTile({ project }: { project: ProjectCardView }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="View"
      className="group flex flex-col gap-5 focus-visible:outline-none"
    >
      <div className="relative aspect-[4/3] rounded-[12px] overflow-hidden bg-[#E8E8E8] image-hover-zoom group-focus-visible:ring-2 group-focus-visible:ring-[#0A0A0A] group-focus-visible:ring-offset-4">
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          fill
          className={cn("object-cover object-center", monoClass(project.imageSrc))}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/10 transition-colors duration-500" aria-hidden="true" />
        <div className="absolute top-3.5 left-3.5">
          <StatusTag status={project.status} inverted />
        </div>
        <span
          className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
          aria-hidden="true"
        >
          <ArrowUpRight size={16} className="text-[#0A0A0A]" />
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        <Meta project={project} />
        <h3 className="text-[22px] md:text-[26px] font-semibold text-[#0A0A0A] tracking-[-0.03em] leading-[1.15]">
          {project.title}
        </h3>
        <p className="text-[15px] text-[#6B6B6B] leading-[1.65] line-clamp-2">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
