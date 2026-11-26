"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/types";
import { cn } from "@/lib/utils";

interface PhotoLightboxProps {
  photos: Photo[];
  index: number;
  collectionTitle: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/**
 * PhotoLightbox — full-screen, high-quality viewer for one collection.
 *
 * Rendered through a portal on <body> so no transformed ancestor can trap
 * its fixed positioning. Keyboard: ←/→ to browse, Esc to close, Tab stays
 * inside the dialog. Touch: swipe left/right. Neighbouring frames are
 * preloaded so browsing feels instant.
 */
export function PhotoLightbox({ photos, index, collectionTitle, onIndexChange, onClose }: PhotoLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Single-finger swipe only: pinch-zoom and two-finger gestures must never
  // change the photo the visitor is inspecting.
  const touch = useRef<{ id: number; x: number; y: number } | null>(null);

  const count = photos.length;
  const current = photos[index];
  // Track the latest index in a ref so rapid key presses / swipes each move
  // one frame, even before React has re-rendered with the new index.
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  const go = useCallback(
    (dir: 1 | -1) => {
      const next = (indexRef.current + dir + count) % count;
      indexRef.current = next;
      onIndexChange(next);
    },
    [count, onIndexChange]
  );

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
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

  const neighbours = count > 1 ? [photos[(index + 1) % count], photos[(index - 1 + count) % count]] : [];

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${collectionTitle} — ${current.caption ?? current.alt}`}
      className="fixed inset-0 z-[70] bg-[#060606]/[0.97] text-white animate-[fadeIn_250ms_ease-out]"
      onClick={onClose}
      onTouchStart={(e) => {
        if (e.touches.length !== 1) {
          touch.current = null;
          return;
        }
        const t = e.touches[0];
        touch.current = { id: t.identifier, x: t.clientX, y: t.clientY };
      }}
      onTouchMove={(e) => {
        if (e.touches.length > 1) touch.current = null;
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start || e.touches.length > 0) return;
        const t = Array.from(e.changedTouches).find((c) => c.identifier === start.id);
        if (!t) return;
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
      }}
    >
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between gap-4 px-4 md:px-8 py-4 md:py-6 z-10">
        <p className="text-[11px] md:text-[12px] tracking-[0.16em] uppercase text-white/55">
          {collectionTitle}
          <span className="ml-3 tabular-nums text-white/35">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="absolute inset-x-3 md:inset-x-24 top-[72px] md:top-[88px] bottom-[88px] md:bottom-[96px]" onClick={(e) => e.stopPropagation()}>
        <Image
          key={current.id}
          src={current.src}
          alt={current.alt}
          fill
          quality={90}
          priority
          sizes="100vw"
          className={cn("object-contain animate-[fadeIn_350ms_ease-out]", current.mono && "img-mono")}
        />
      </div>

      {/* Caption */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-140px)] md:w-auto text-center text-[13px] md:text-[14px] text-white/70"
      >
        {current.caption ?? current.alt}
        <span className="sr-only">
          , photograph {index + 1} of {count}
        </span>
      </p>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous photograph"
            className="absolute left-3 md:left-7 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next photograph"
            className="absolute right-3 md:right-7 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Preload neighbours so browsing is instant */}
      <div className="sr-only" aria-hidden="true">
        {neighbours.map((p) => (
          <Image key={p.id} src={p.src} alt="" width={p.width ?? 2400} height={p.height ?? 1800} quality={90} sizes="100vw" loading="eager" />
        ))}
      </div>
    </div>,
    document.body
  );
}
