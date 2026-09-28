"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Icon3D } from "@/components/site/icon-3d";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { features } from "@/content/company";
import { site } from "@/config/site";
import { cities } from "@/content/cities";
import { DURATION, EASE_SOFT } from "@/lib/motion";

type Stat = { value: number; decimals?: number; suffix?: string; label: string };

const STATS: Stat[] = [
  { value: site.stats.years, suffix: " yrs", label: `serving ${site.region}` },
  { value: 1800, suffix: "+", label: "lawns maintained" },
  { value: site.rating.value, decimals: 1, label: `across ${site.rating.count} Google reviews` },
  { value: cities.length, label: "cities, one local crew" },
];

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, stat.value, {
      duration: DURATION.reveal * 1.6,
      ease: EASE_SOFT,
      onUpdate: setShown,
    });
    return () => controls.stop();
  }, [inView, stat.value]);

  const text = stat.decimals ? shown.toFixed(stat.decimals) : Math.round(shown).toLocaleString("en-US");
  return (
    <span ref={ref} className="tabular-nums">
      {text}
      {stat.suffix}
    </span>
  );
}

export function WhyGreenLeaf() {
  return (
    <section id="why-us" className="relative scroll-mt-20 overflow-hidden bg-cream-deep py-20 lg:py-28">
      <div aria-hidden className="stripes absolute inset-0 opacity-50" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow">Why {site.shortName}</p>
            <h2 className="font-display mt-3 max-w-[16ch] text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
              A local company that actually shows up
            </h2>
            <p className="measure mt-5 text-lg leading-relaxed text-muted-foreground">
              Not a national chain and not a side hustle. We live here, we mow here, and we have been doing it since {site.foundedYear}.
            </p>
          </Reveal>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
            {STATS.map((s) => (
              <Reveal key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-display block text-4xl font-semibold text-forest-800 sm:text-5xl">
                    <Counter stat={s} />
                  </span>
                  <span className="mt-2 block text-sm leading-snug text-muted-foreground">{s.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <RevealItem key={f.title} className="group lift rounded-3xl border border-border bg-card p-7 shadow-soft hover:border-primary/25">
              <Icon3D name={f.icon} size={56} float />
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
