"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

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
  const touched = useRef(false);

  // The first time the frame scrolls into view, sweep the divider once so
  // visitors see it moves. Skipped if they have already touched it or
  // prefer reduced motion.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const keys = [50, 28, 70, 50];
        const tick = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, (now - start) / 2200);
          const seg = Math.min(keys.length - 2, Math.floor(t * (keys.length - 1)));
          const local = t * (keys.length - 1) - seg;
          const eased = 1 - Math.pow(1 - local, 3);
          setPosition(keys[seg] + (keys[seg + 1] - keys[seg]) * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(frame);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const updateFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    touched.current = true;
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
    touched.current = true;
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
      className={`group relative aspect-5/4 cursor-ew-resize touch-pan-y overflow-hidden rounded-3xl shadow-lift ring-1 ring-border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className ?? ""}`}
    >
      {/* After (full frame, underneath) */}
      <Image
        src={after}
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
          src={before}
          alt=""
          aria-hidden
          fill
          draggable={false}
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 48vw"
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-forest-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cream backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-forest-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cream backdrop-blur-sm">
        After
      </span>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-cream ring-1 ring-forest-950/20"
        style={{ left: `${position}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-forest-800 shadow-lift ring-1 ring-forest-950/10 transition-transform duration-(--dur-ui) group-hover:scale-110">
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
