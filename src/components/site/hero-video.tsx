"use client";

import { useEffect, useRef } from "react";

// Background video that fades in over the hero photo once it is actually
// playing. The photo (a priority <Image>) is what paints first, so the
// video never delays LCP. Phones, Save-Data connections and reduced-motion
// visitors keep the photo and skip the multi-MB download entirely.
export function HeroVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData
    ) {
      return;
    }

    const onPlaying = () => {
      video.dataset.playing = "true";
    };
    video.addEventListener("playing", onPlaying);

    const load = () => {
      video.src = src;
      // Some browsers ignore the SSR `muted` attribute on hydration, which
      // silently blocks autoplay; setting it here guarantees it.
      video.muted = true;
      video.play().catch(() => {});
    };
    const id =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(load, { timeout: 2500 })
        : globalThis.setTimeout(load, 1200);

    return () => {
      video.removeEventListener("playing", onPlaying);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(id as number);
      globalThis.clearTimeout(id as number);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-(--dur-reveal) data-[playing=true]:opacity-100"
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
