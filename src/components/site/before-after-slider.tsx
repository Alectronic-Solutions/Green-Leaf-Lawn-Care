"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

type Props = {
  before: string;
  after: string;
  alt: string;
  className?: string;
};

// Hover-driven before/after reveal. The divider follows the cursor while the
// pointer is over the frame (no click needed), drags on touch, and nudges with
// the arrow keys so keyboard users can compare too. Position is a percentage
// of the frame width so it survives resizes without recomputing.
export function BeforeAfterSlider({ before, after, alt, className }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);

  const updateFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Mouse: follow on hover. Touch/pen: only while pressed, so a scroll
    // gesture that starts on the image doesn't hijack the divider.
    if (e.pointerType !== "mouse" && e.buttons === 0) return;
    updateFromClientX(e.clientX);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    frameRef.current?.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div
      ref={frameRef}
      role="slider"
      tabIndex={0}
      aria-label="Compare before and after"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      aria-valuetext={`${Math.round(position)}% before`}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={`group relative aspect-5/4 cursor-ew-resize touch-pan-y overflow-hidden rounded-2xl shadow-lg ring-1 ring-border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className ?? ""}`}
    >
      {/* After (full frame, underneath) */}
      <Image
        src={assetPath(after)}
        alt={alt}
        fill
        draggable={false}
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 48vw"
      />

      {/* Before (clipped from the left edge to the divider) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={assetPath(before)}
          alt=""
          aria-hidden
          fill
          draggable={false}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 48vw"
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
        After
      </span>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
        style={{ left: `${position}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground shadow-md ring-1 ring-black/10 transition-transform group-hover:scale-105">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 6 3 12l6 6" />
            <path d="m15 6 6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
