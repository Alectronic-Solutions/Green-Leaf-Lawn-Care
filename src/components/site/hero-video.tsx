"use client";

import { useEffect, useRef } from "react";

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Some browsers ignore the `muted` attribute set via SSR markup on
    // hydration, which silently blocks autoplay. Setting it imperatively
    // guarantees the property is set before play() is attempted.
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={videoRef}
      className="hidden h-full w-full object-cover motion-safe:block"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
