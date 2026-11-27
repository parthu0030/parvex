"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Video } from "@/types";
import { formatDuration } from "@/data/videography";

interface VideoPlayerProps {
  videos: Video[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/**
 * VideoPlayer — full-screen film viewer.
 *
 * Uses the browser's native <video> controls (play/pause, scrubbing, volume,
 * picture-in-picture and true full screen on every platform, including iOS).
 * The full film only starts downloading once the viewer opens. Rendered in a
 * portal on <body> so no transformed ancestor can trap its fixed position.
 *
 * Keyboard: Esc closes; ←/→ switch films (unless the video itself has focus,
 * where the arrows seek, as users expect from native controls).
 */
export function VideoPlayer({ videos, index, onIndexChange, onClose }: VideoPlayerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const indexRef = useRef(index);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const count = videos.length;
  const current = videos[index];

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = (indexRef.current + dir + count) % count;
      indexRef.current = next;
      onIndexChange(next);
    },
    [count, onIndexChange]
  );

  // Lock page scroll, focus the close button.
  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Start the selected film (the click that opened the viewer counts as the
  // user gesture, so playback with sound is allowed).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    const p = v.play();
    if (p) p.catch(() => {/* autoplay refused — native controls remain */});
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const onVideo = e.target === videoRef.current;
      if (e.key === "Escape") {
        // Let the browser leave native full screen first.
        if (!document.fullscreenElement) onClose();
      } else if (!onVideo && e.key === "ArrowRight") go(1);
      else if (!onVideo && e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, video"));
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  if (!current) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${current.title} — film player`}
      className="fixed inset-0 z-[70] bg-[#060606]/[0.97] text-white animate-[fadeIn_250ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-4 pt-[72px] pb-[88px] landscape:flex-row landscape:gap-8 landscape:px-20 landscape:pt-[76px] landscape:pb-4 lg:landscape:gap-14 lg:landscape:px-28 lg:landscape:py-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Film — vertical frame sized to the viewport. Portrait screens
            stack film over title; landscape screens (incl. phones on their
            side) put details beside it, and the film's height is also capped
            by the width left over so near-square screens never overflow. */}
        <div className="relative aspect-[9/16] max-w-full flex-shrink-0 rounded-[8px] overflow-hidden bg-black h-[calc(100%-52px)] landscape:h-[min(100%,calc((100vw-460px)*16/9))] lg:landscape:h-[min(100%,calc((100vw-620px)*16/9))]">
          <video
            key={current.id}
            ref={videoRef}
            src={current.src}
            poster={current.posterSrc}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain bg-black"
            aria-label={current.title}
          >
            Your browser can&apos;t play this film.
          </video>
        </div>

        {/* Details */}
        <div className="w-full landscape:w-[260px] lg:landscape:w-[340px] flex-shrink-0 flex flex-col gap-3 lg:landscape:gap-5" aria-live="polite" aria-atomic="true">
          <p className="hidden landscape:flex items-center gap-3 text-[11px] tracking-[0.16em] uppercase text-white/45">
            <span>{current.category}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" aria-hidden="true" />
            <span className="tabular-nums">{formatDuration(current.duration)}</span>
          </p>
          <h2 className="text-[18px] lg:landscape:text-[30px] font-semibold tracking-[-0.03em] leading-[1.1]">{current.title}</h2>
          <p className="hidden lg:landscape:block text-[15px] text-white/60 leading-[1.75]">{current.description}</p>
          <span className="sr-only">
            Film {index + 1} of {count}
          </span>
        </div>
      </div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between gap-4 px-4 md:px-8 py-4 md:py-6">
        <p className="text-[11px] md:text-[12px] tracking-[0.16em] uppercase text-white/55">
          Films
          <span className="ml-3 tabular-nums text-white/35">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close player"
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-white"
        >
          <X size={20} />
        </button>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous film"
            className="absolute left-3 md:left-7 bottom-5 landscape:bottom-auto landscape:top-1/2 landscape:-translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next film"
            className="absolute right-3 md:right-7 bottom-5 landscape:bottom-auto landscape:top-1/2 landscape:-translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>,
    document.body
  );
}
