"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Icon3D } from "@/components/site/icon-3d";
import { Reveal } from "@/components/site/reveal";
import { site } from "@/config/site";
import { levels, PROMO_LEVEL_INDEX } from "./levels";

const MowerGame = dynamic(() => import("./mower-game").then((m) => m.MowerGame), {
  ssr: false,
  loading: () => <GameSkeleton />,
});

function GameSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
      <div className="h-15 border-b border-border" />
      <div className="relative aspect-12/7 w-full bg-[repeating-linear-gradient(90deg,var(--stripe-light)_0_8.33%,var(--stripe-dark)_8.33%_16.66%)] opacity-70">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="leaf-spinner text-2xl text-cream" aria-hidden />
        </div>
      </div>
      <div className="h-12" />
    </div>
  );
}

export function GameSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  // Load the game's code only once the visitor scrolls near it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="mow" className="scroll-mt-20 bg-cream-deep py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">Just for fun</p>
            <h2 className="font-display mt-3 max-w-[18ch] text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
              Think you can stripe a lawn?
            </h2>
            <p className="measure mt-4 text-lg leading-relaxed text-muted-foreground">
              {levels.length} lawns across three neighborhoods. Mow up for light stripes and down for dark ones, just
              like our crews. Clear lawn {PROMO_LEVEL_INDEX + 1} to unlock {site.offers.gamePromo.pct}% off your first
              mow.
            </p>
          </div>
          <div className="hidden items-center gap-2 md:flex" aria-hidden>
            <Icon3D name="trophy" size={72} className="-rotate-6" />
            <Icon3D name="gift" size={56} className="rotate-6" />
          </div>
        </Reveal>
        <div ref={ref} className="mt-10">
          {mount ? <MowerGame /> : <GameSkeleton />}
        </div>
      </div>
    </section>
  );
}
