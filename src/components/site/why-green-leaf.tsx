"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  type LucideIcon,
  CalendarCheck2,
  MapPin,
  PawPrint,
  Receipt,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const FEATURES: { title: string; desc: string; icon: LucideIcon; image: string }[] = [
  {
    title: "Licensed and insured",
    desc: "Fully licensed in Minnesota and insured. Certificate of insurance available on request.",
    icon: ShieldCheck,
    image: "/images/technician.webp",
  },
  {
    title: "Re-do guarantee",
    desc: "If a visit is not right, the crew comes back within 48 hours and fixes it. No charge, no pushback.",
    icon: RefreshCcw,
    image: "/images/transformation.webp",
  },
  {
    title: "Pet and family safe",
    desc: "Fertilizer and weed-control products with re-entry intervals that work around your schedule.",
    icon: PawPrint,
    image: "/images/grass-texture.webp",
  },
  {
    title: "Local crews",
    desc: "Based in Maple Grove. Our crews know the soil, the grass varieties, and the weather here.",
    icon: MapPin,
    image: "/images/winter.webp",
  },
  {
    title: "Same crew, same day",
    desc: "You get the same two-person crew on the same day each week. They learn your property.",
    icon: CalendarCheck2,
    image: "/images/summer.webp",
  },
  {
    title: "Upfront pricing",
    desc: "Your quote is your price. No fuel surcharges, no footage fees, no surprises on the invoice.",
    icon: Receipt,
    image: "/images/gallery-2.webp",
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
        setInView(entry.isIntersecting);
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
    if (!inView) {
      setDisplay(0);
      return;
    }

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

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springCfg = { stiffness: 300, damping: 28, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), springCfg);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), springCfg);
  const glareX = useTransform(px, [0, 1], ["-10%", "110%"]);
  const glareY = useTransform(py, [0, 1], ["-10%", "110%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          rotateX,
          rotateY,
          transformPerspective: 900,
          "--card-top": `calc(5.5rem + ${index * 2.75}rem)`,
          "--card-z": index + 1,
        } as React.CSSProperties
      }
      whileHover={{ scale: 1.03 }}
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border/80 bg-card p-6 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_-3px_0_0_rgba(0,0,0,0.06)_inset,0_16px_28px_-10px_rgba(0,0,0,0.16)] ring-1 ring-transparent transition-[box-shadow,ring-color] duration-200 ease-out max-sm:sticky max-sm:top-(--card-top) max-sm:z-(--card-z) hover:shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_-3px_0_0_rgba(0,0,0,0.06)_inset,0_10px_10px_-4px_rgba(0,0,0,0.1),0_0_32px_-6px_var(--color-primary)] hover:ring-primary/20 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_-3px_0_0_rgba(0,0,0,0.35)_inset,0_16px_28px_-10px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_-3px_0_0_rgba(0,0,0,0.4)_inset,0_10px_10px_-4px_rgba(0,0,0,0.4),0_0_32px_-4px_var(--color-primary)] sm:p-8"
    >
      {/* Faded background photo, tied to the feature */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={feature.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-[0.14] grayscale-15 transition-[opacity,transform] duration-500 ease-out group-hover:scale-105 group-hover:opacity-[0.22] dark:opacity-[0.12] dark:group-hover:opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-b from-card/55 via-card/85 to-card" />
      </div>

      {/* Roving glare highlight, wow-factor gloss on hover/tilt */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) =>
              `radial-gradient(240px circle at ${gx} ${gy}, color-mix(in oklch, var(--color-primary) 18%, transparent), transparent 70%)`,
          ),
        }}
      />

      <span className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-b from-primary/20 to-primary/5 text-primary shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_2px_6px_-1px_rgba(0,0,0,0.18)] ring-1 ring-primary/15 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 dark:from-primary/25 dark:to-primary/10">
        <Icon className="size-6" strokeWidth={2} />
      </span>
      <h3 className="relative mt-4 text-base font-semibold">{feature.title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {feature.desc}
      </p>
    </motion.div>
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

        <div className="mt-12 flex flex-col gap-5 sm:grid sm:grid-cols-2 sm:gap-6 sm:perspective-[1000px] lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
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
