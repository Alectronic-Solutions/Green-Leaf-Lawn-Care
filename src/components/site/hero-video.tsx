"use client";

import { useEffect, useRef } from "react";

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Defer fetching the (multi-MB) video source until after first paint so
    // it never competes with the poster image for LCP-critical bandwidth.
    const load = () => {
      video.src = src;
      // Some browsers ignore the `muted` attribute set via SSR markup on
      // hydration, which silently blocks autoplay. Setting it imperatively
      // guarantees the property is set before play() is attempted.
      video.muted = true;
      video.play().catch(() => {});
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load);
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(load, 200);
    return () => window.clearTimeout(id);
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="hidden h-full w-full object-cover motion-safe:block"
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
    />
  );
}
