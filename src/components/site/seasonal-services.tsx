"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Sun, Leaf, Snowflake, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/asset-path";

type Season = "spring" | "summer" | "fall" | "winter";

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
    image: assetPath("/images/spring.png"),
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
    image: assetPath("/images/summer.png"),
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
    image: assetPath("/images/fall.png"),
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
    image: assetPath("/images/winter.png"),
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
    <div>
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {(Object.keys(SEASONS) as Season[]).map((key) => {
          const s = SEASONS[key];
          const Icon = s.icon;
          const isActive = key === season;
          return (
            <button
              key={key}
              onClick={() => setSeason(key)}
              className={cn(
                "flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/60"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary-foreground" : "text-primary"
                )}
              />
              {s.label}
              <span
                className={cn(
                  "text-[11px] font-normal tabular-nums",
                  isActive ? "text-primary-foreground/70" : "text-muted-foreground"
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
              <p className="mt-2 text-[15px] leading-relaxed text-background/95">
                {active.blurb}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {active.services.map((svc) => (
              <div
                key={svc.name}
                className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/35"
              >
                <h4 className="font-semibold leading-snug">{svc.name}</h4>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                  {svc.desc}
                </p>
                <div className="mt-4 flex items-baseline justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">from</span>
                  <span className="text-base font-bold text-primary tabular-nums">
                    {svc.from}
                  </span>
                </div>
                <a
                  href="#quote"
                  className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary"
                >
                  Add to my quote
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
