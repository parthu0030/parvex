import { ArrowUpRight } from "lucide-react";
import { INSTAGRAM } from "@/data/social";
import { cn } from "@/lib/utils";

/**
 * InstagramLink — "more work on Instagram" link for the photography and
 * videography showcases. Renders nothing if no Instagram profile is set.
 */
export function InstagramLink({ label, className }: { label: string; className?: string }) {
  if (!INSTAGRAM) return null;
  return (
    <a
      href={INSTAGRAM.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("group inline-flex w-fit items-center gap-2 text-[14px] text-white/80 hover:text-white transition-colors duration-200", className)}
    >
      <span className="link-draw">{label}</span>
      {INSTAGRAM.handle && <span className="text-white/45">{INSTAGRAM.handle}</span>}
      <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      <span className="sr-only">(opens Instagram in a new tab)</span>
    </a>
  );
}
