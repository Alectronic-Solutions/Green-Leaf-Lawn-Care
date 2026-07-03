"use client";

import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    title: "Licensed and insured",
    desc: "Fully licensed in Minnesota and insured. Certificate of insurance available on request.",
  },
  {
    title: "Re-do guarantee",
    desc: "If a visit is not right, the crew comes back within 48 hours and fixes it. No charge, no pushback.",
  },
  {
    title: "Pet and family safe",
    desc: "Fertilizer and weed-control products with re-entry intervals that work around your schedule.",
  },
  {
    title: "Local crews",
    desc: "Based in Maple Grove. Our crews know the soil, the grass varieties, and the weather here.",
  },
  {
    title: "Same crew, same day",
    desc: "You get the same two-person crew on the same day each week. They learn your property.",
  },
  {
    title: "Upfront pricing",
    desc: "Your quote is your price. No fuel surcharges, no footage fees, no surprises on the invoice.",
  },
];

type Stat = {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  { value: 10, suffix: " yrs", label: "serving the northwest metro" },
  { value: 1800, suffix: "+", label: "lawns maintained to date" },
  { value: 4.9, decimals: 1, label: "across 187 Google reviews" },
  { value: 6, suffix: " cities", label: "one local crew" },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function AnimatedStat({ stat, index }: { stat: Stat; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1200;
    const delay = index * 90;
    const start = performance.now() + delay;

    let frame: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(stat.value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, stat.value, index]);

  const formatted = stat.decimals
    ? display.toFixed(stat.decimals)
    : Math.round(display).toLocaleString();

  return (
    <div
      ref={ref}
      className="relative bg-card p-6 text-center sm:p-8"
    >
      <p className="text-4xl font-bold tracking-tight tabular-nums sm:text-[2.75rem]">
        {formatted}
        {stat.suffix}
      </p>
      <span className="mx-auto mt-3 block h-px w-8 bg-primary/40" />
      <p className="mt-3 text-sm leading-snug text-muted-foreground">
        {stat.label}
      </p>
    </div>
  );
}

export function WhyGreenLeaf() {
  return (
    <section
      id="why-us"
      className="scroll-mt-20 border-y border-border/60 bg-card/40 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Why Green Leaf
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            A local company that actually shows up
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-balance">
            We are not a national chain or a side hustle. We live here, we
            mow here, and we have been doing it for over ten years.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-sm sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="relative bg-card p-6 sm:p-8">
              <span className="font-display text-sm font-semibold text-primary/50 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats band */}
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-sm sm:grid-cols-4">
          {STATS.map((s, i) => (
            <AnimatedStat key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
