"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Sprout, Sun, Leaf, Snowflake, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/asset-path";

type Season = "spring" | "summer" | "fall" | "winter";

const SEASON_THEME: Record<
  Season,
  {
    active: string;
    icon: string;
    hoverBorder: string;
    hoverBg: string;
    cardBg: string;
    cardBorder: string;
    iconChip: string;
    button: string;
    buttonShadow: string;
  }
> = {
  spring: {
    active: "border-emerald-600 bg-emerald-600 text-white shadow-md",
    icon: "text-emerald-600",
    hoverBorder: "hover:border-emerald-600/40",
    hoverBg: "hover:bg-emerald-50",
    cardBg: "bg-emerald-50/60 dark:bg-emerald-950/20",
    cardBorder: "border-emerald-900/8 hover:border-emerald-600/40",
    iconChip: "bg-emerald-600 text-white",
    button: "from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600",
    buttonShadow: "shadow-emerald-900/20",
  },
  summer: {
    active: "border-amber-500 bg-amber-500 text-white shadow-md",
    icon: "text-amber-500",
    hoverBorder: "hover:border-amber-500/40",
    hoverBg: "hover:bg-amber-50",
    cardBg: "bg-amber-50/60 dark:bg-amber-950/20",
    cardBorder: "border-amber-900/8 hover:border-amber-500/40",
    iconChip: "bg-amber-500 text-white",
    button: "from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500",
    buttonShadow: "shadow-amber-900/20",
  },
  fall: {
    active: "border-orange-600 bg-orange-600 text-white shadow-md",
    icon: "text-orange-600",
    hoverBorder: "hover:border-orange-600/40",
    hoverBg: "hover:bg-orange-50",
    cardBg: "bg-orange-50/60 dark:bg-orange-950/20",
    cardBorder: "border-orange-900/8 hover:border-orange-600/40",
    iconChip: "bg-orange-600 text-white",
    button: "from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600",
    buttonShadow: "shadow-orange-900/20",
  },
  winter: {
    active: "border-sky-600 bg-sky-600 text-white shadow-md",
    icon: "text-sky-600",
    hoverBorder: "hover:border-sky-600/40",
    hoverBg: "hover:bg-sky-50",
    cardBg: "bg-sky-50/60 dark:bg-sky-950/20",
    cardBorder: "border-sky-900/8 hover:border-sky-600/40",
    iconChip: "bg-sky-600 text-white",
    button: "from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600",
    buttonShadow: "shadow-sky-900/20",
  },
};

const SEASONS: Record<
  Season,
  {
    label: string;
    short: string;
    icon: React.ElementType;
    image: string;
    blurb: string;
    services: { name: string; desc: string; from: string }[];
  }
> = {
  spring: {
    label: "Spring",
    short: "Mar–May",
    icon: Sprout,
    image: assetPath("/images/spring.webp"),
    blurb:
      "Snow mold cleanup, first feed, and soil prep to bring the lawn out of winter dormancy.",
    services: [
      {
        name: "Spring Cleanup",
        desc: "Debris and branch removal, bed edging, and the first cut of the season.",
        from: "$120",
      },
      {
        name: "Core Aeration & Overseeding",
        desc: "Core aeration to relieve compaction, paired with Kentucky bluegrass seed for denser turf.",
        from: "$180",
      },
      {
        name: "Pre-Emergent Crabgrass Control",
        desc: "Applied with your first fertilization to stop crabgrass before it germinates.",
        from: "$65",
      },
      {
        name: "Spring Fertilization",
        desc: "Slow-release nitrogen to restore color after winter dormancy.",
        from: "$65",
      },
    ],
  },
  summer: {
    label: "Summer",
    short: "Jun–Aug",
    icon: Sun,
    image: assetPath("/images/summer.webp"),
    blurb:
      "Weekly mowing at the correct height, plus heat-safe feeding and targeted weed control.",
    services: [
      {
        name: "Weekly Mowing & Edging",
        desc: "Mowed to height for conditions, edged along all hard surfaces, clippings blown clear.",
        from: "$45 / visit",
      },
      {
        name: "Summer Fertilization",
        desc: "A heat-safe formula that holds color without stressing the root system.",
        from: "$65",
      },
      {
        name: "Grub & Insect Control",
        desc: "Preventative treatment for grubs and surface-feeding insects.",
        from: "$75",
      },
      {
        name: "Broadleaf Weed Control",
        desc: "Spot treatment for dandelions, clover, and thistle. No blanket spraying.",
        from: "$55",
      },
    ],
  },
  fall: {
    label: "Fall",
    short: "Sep–Nov",
    icon: Leaf,
    image: assetPath("/images/fall.webp"),
    blurb:
      "The season that decides next year's lawn. Aeration, seed, and winterizer applied at the right time.",
    services: [
      {
        name: "Leaf Removal",
        desc: "Full-property cleanup with bagging and hauling. Scheduled around your trees, not a fixed calendar.",
        from: "$90 / visit",
      },
      {
        name: "Fall Aeration & Overseeding",
        desc: "The single most effective step toward a thicker lawn next spring.",
        from: "$180",
      },
      {
        name: "Winterizer Fertilization",
        desc: "Late-fall feeding that stores nutrients in the root zone for early green-up.",
        from: "$70",
      },
      {
        name: "Final Mow & Cut-Down",
        desc: "Lower cut height to prevent snow mold and vole damage over winter.",
        from: "$50",
      },
    ],
  },
  winter: {
    label: "Winter",
    short: "Dec–Feb",
    icon: Snowflake,
    image: assetPath("/images/winter.webp"),
    blurb:
      "Snow removal for driveways and walkways, with salting on every visit.",
    services: [
      {
        name: "Driveway & Walkway Clearing",
        desc: "Per-visit or seasonal. Cleared to pavement, not just scraped down.",
        from: "$60 / visit",
      },
      {
        name: "Seasonal Snow Contract",
        desc: "Unlimited visits with priority routing. You never call, we just show up.",
        from: "$650 / season",
      },
      {
        name: "Salting & Ice Melt",
        desc: "Applied to walks, steps, and drives on every visit.",
        from: "$35 / visit",
      },
      {
        name: "Ice Dam Inspection",
        desc: "We flag problem areas on your roof and gutters before ice dams form.",
        from: "$150",
      },
    ],
  },
};

function getCurrentSeason(): Season {
  const month = new Date().getMonth(); // 0=Jan
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

export function SeasonalServices() {
  const [season, setSeason] = useState<Season>(getCurrentSeason);
  const active = SEASONS[season];

  return (
    <MotionConfig reducedMotion="user">
    <div>
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {(Object.keys(SEASONS) as Season[]).map((key) => {
          const s = SEASONS[key];
          const theme = SEASON_THEME[key];
          const Icon = s.icon;
          const isActive = key === season;
          return (
            <button
              key={key}
              onClick={() => setSeason(key)}
              className={cn(
                "flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
                isActive
                  ? theme.active
                  : cn(
                      "border-border bg-card text-foreground shadow-sm hover:shadow-md",
                      theme.hoverBorder,
                      theme.hoverBg
                    )
              )}
            >
              <Icon
                className={cn("h-4 w-4", isActive ? "text-white" : theme.icon)}
              />
              {s.label}
              <span
                className={cn(
                  "text-[11px] font-normal tabular-nums",
                  isActive ? "text-white/75" : "text-muted-foreground"
                )}
              >
                {s.short}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={season}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8"
        >
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-105">
            <Image
              src={active.image}
              alt={`${active.label} lawn care services by Green Leaf`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/85 via-foreground/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-background">
              <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-background/80">
                <active.icon className="h-4 w-4" />
                {active.label}
              </div>
              <p className="mt-2 text-base leading-relaxed text-background/95">
                {active.blurb}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {active.services.map((svc) => {
              const theme = SEASON_THEME[season];
              return (
                <div
                  key={svc.name}
                  className={cn(
                    "group flex flex-col items-center rounded-2xl border p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
                    theme.cardBg,
                    theme.cardBorder
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full shadow-sm",
                      theme.iconChip
                    )}
                  >
                    <active.icon className="h-5 w-5" />
                  </span>

                  <h4 className="mt-3.5 font-semibold leading-snug">
                    {svc.name}
                  </h4>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {svc.desc}
                  </p>

                  <span className="mt-4 text-2xl font-bold tabular-nums text-foreground">
                    {svc.from}
                  </span>

                  <a
                    href="#quote"
                    className={cn(
                      "bg-noise btn-texture mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-linear-to-b px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]",
                      theme.button,
                      theme.buttonShadow
                    )}
                  >
                    Add to my quote
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}
