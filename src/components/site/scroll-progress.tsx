"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? scrolled / total : 0);
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      style={{ background: "transparent" }}
    >
      {/* track */}
      <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />
      {/* fill */}
      <div
        className="absolute inset-y-0 left-0 transition-[width] duration-75 ease-out"
        style={{
          width: `${progress * 100}%`,
          background:
            "linear-gradient(to right, oklch(0.42 0.09 155), oklch(0.58 0.075 165))",
          boxShadow: "0 0 8px oklch(0.42 0.09 155 / 0.6)",
        }}
      />
      {/* glowing tip */}
      {progress > 0.005 && (
        <div
          className="absolute top-0 bottom-0 w-4 -translate-x-full"
          style={{
            left: `${progress * 100}%`,
            background:
              "linear-gradient(to right, transparent, oklch(0.58 0.075 165 / 0.8))",
          }}
        />
      )}
    </div>
  );
}
