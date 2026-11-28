"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Video } from "@/types";
import { formatDuration } from "@/data/videography";
import { cn } from "@/lib/utils";

/** The one preview allowed to play at a time, shared across all cards. */
let activePreview: HTMLVideoElement | null = null;

function playExclusive(v: HTMLVideoElement, onPlaying: () => void) {
  if (activePreview && activePreview !== v) {
    activePreview.pause();
    activePreview.currentTime = 0;
  }
  activePreview = v;
  const p = v.play();
  if (p) p.then(onPlaying).catch(() => {});
}

interface VideoFrameProps {
  video: Video;
  onOpen: (trigger: HTMLElement) => void;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * VideoFrame — clickable 9:16 poster for one film.
 *
 * Poster in monochrome at rest (Parvex's black-and-white system); on hover
 * (mouse/trackpad only, and never with reduced motion) a 6-second silent
 * preview loop fades in, in colour. The preview isn't requested until the
 * first hover, and only the hovered card plays. Click opens the full player.
 */
export function VideoFrame({ video, onOpen, sizes, priority, className }: VideoFrameProps) {
  const previewRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const canPreview = useRef(false);
  // True while the pointer (or keyboard focus) is on the card.
  const active = useRef(false);

  useEffect(() => {
    canPreview.current =
      !!video.previewSrc &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [video.previewSrc]);

  const start = () => {
    if (!canPreview.current) return;
    active.current = true;
    setArmed(true);
    const v = previewRef.current;
    if (v) playExclusive(v, () => setPlaying(true));
  };
  const stop = () => {
    active.current = false;
    const v = previewRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
      if (activePreview === v) activePreview = null;
    }
    setPlaying(false);
  };

  // Once armed, the <video> mounts — start it on the same hover.
  useEffect(() => {
    if (!armed) return;
    const v = previewRef.current;
    if (v && v.paused && active.current) playExclusive(v, () => setPlaying(true));
  }, [armed]);

  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      onMouseEnter={start}
      onMouseLeave={stop}
      // Keyboard focus previews too — but not the programmatic focus the
      // player returns to this card on close.
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible")) start();
      }}
      onBlur={stop}
      data-cursor="Play"
      aria-label={`Play “${video.title}” (${formatDuration(video.duration)})`}
      className={cn(
        "group relative block w-full aspect-[9/16] overflow-hidden rounded-[8px] bg-white/[0.04] text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]",
        className
      )}
    >
      {video.posterSrc && (
        <Image
          src={video.posterSrc}
          alt={video.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover grayscale contrast-[1.06] transition-[filter,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:contrast-100 group-focus-visible:grayscale-0 group-hover:scale-[1.02]"
        />
      )}

      {armed && video.previewSrc && (
        <video
          ref={previewRef}
          src={video.previewSrc}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            playing ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Legibility gradient + play affordance */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" aria-hidden="true" />
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/90 text-[#0A0A0A] transition-all duration-500 group-hover:scale-90 group-hover:opacity-0"
        aria-hidden="true"
      >
        <Play size={20} className="ml-0.5" fill="currentColor" />
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 md:bottom-4 md:right-4 text-[11px] tabular-nums text-white/80 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1" aria-hidden="true">
        {formatDuration(video.duration)}
      </span>
    </button>
  );
}

/** Small uppercase meta line: category · duration. */
export function VideoMeta({ video, className }: { video: Video; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] tracking-[0.16em] uppercase text-white/45", className)}>
      <span className="whitespace-nowrap">{video.category}</span>
      {/* The dot travels with the duration, so a wrap never leaves it dangling. */}
      <span className="inline-flex items-center gap-2.5 whitespace-nowrap">
        <span className="w-1 h-1 rounded-full bg-white/30" aria-hidden="true" />
        <span className="tabular-nums">{formatDuration(video.duration)}</span>
      </span>
    </p>
  );
}
