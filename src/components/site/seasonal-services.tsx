"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sprout, Sun, Leaf, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Season = "spring" | "summer" | "fall" | "winter";

const SEASONS: Record<
  Season,
  {
    label: string;
    icon: React.ElementType;
    image: string;
    accent: string;
    blurb: string;
    services: { name: string; desc: string; from: string; popular?: boolean }[];
  }
> = {
  spring: {
    label: "Spring",
    icon: Sprout,
    image: "/images/spring.png",
    accent: "from-emerald-500/20 to-emerald-500/0",
    blurb: "Wake your lawn up after winter and set the stage for a thick, green season.",
    services: [
      {
        name: "Spring Cleanup",
        desc: "Debris removal, stick & branch pickup, bed edging, first mow.",
        from: "$120",
        popular: true,
      },
      {
        name: "Core Aeration & Overseeding",
        desc: "Relieve compaction, introduce premium seed for denser turf.",
        from: "$180",
      },
      {
        name: "Pre-Emergent Crabgrass Control",
        desc: "Stop weeds before they sprout. Applied with first fertilization.",
        from: "$65",
      },
      {
        name: "First Fertilization Treatment",
        desc: "Slow-release nitrogen feed to green up after dormancy.",
        from: "$65",
      },
    ],
  },
  summer: {
    label: "Summer",
    icon: Sun,
    image: "/images/summer.png",
    accent: "from-amber-500/20 to-amber-500/0",
    blurb: "Keep your lawn lush, healthy and weed-free through the heat of summer.",
    services: [
      {
        name: "Weekly Mowing & Edging",
        desc: "Crisp, even cuts with precision edging and blowing of all hard surfaces.",
        from: "$45",
        popular: true,
      },
      {
        name: "Summer Fertilization",
        desc: "Heat-tolerant feeding to maintain color without burning the lawn.",
        from: "$65",
      },
      {
        name: "Grub & Insect Control",
        desc: "Protect your turf from root-feeding grubs and surface insects.",
        from: "$75",
      },
      {
        name: "Weed & Broadleaf Control",
        desc: "Targeted spot treatment for dandelions, clover and thistle.",
        from: "$55",
      },
    ],
  },
  fall: {
    label: "Fall",
    icon: Leaf,
    image: "/images/fall.png",
    accent: "from-orange-500/20 to-orange-500/0",
    blurb: "The most important season for lawn health — prep now for a gorgeous spring.",
    services: [
      {
        name: "Leaf Removal & Hauling",
        desc: "Full-property leaf cleanup, bagged and hauled off-site.",
        from: "$90",
        popular: true,
      },
      {
        name: "Fall Aeration & Overseeding",
        desc: "The #1 thing you can do for a thicker lawn next year.",
        from: "$180",
      },
      {
        name: "Winterizer Fertilization",
        desc: "Late-fall feed that stores nutrients in the roots for early green-up.",
        from: "$70",
      },
      {
        name: "Final Mow & Cut-Down",
        desc: "Lower mowing height to prevent snow mold and vole damage.",
        from: "$50",
      },
    ],
  },
  winter: {
    label: "Winter",
    icon: Snowflake,
    image: "/images/winter.png",
    accent: "from-sky-500/20 to-sky-500/0",
    blurb: "Keep your property safe and accessible all winter long.",
    services: [
      {
        name: "Snow Plowing & Shoveling",
        desc: "Driveway plowing, walkway shoveling and salting — per visit or seasonal.",
        from: "$60",
        popular: true,
      },
      {
        name: "Seasonal Snow Contract",
        desc: "Unlimited visits, priority response. Never shovel again.",
        from: "$650",
      },
      {
        name: "Ice Melt & Salting",
        desc: "Eco-friendly ice melt applied to walks, steps and drives.",
        from: "$35",
      },
      {
        name: "Roof & Gutter Ice Dam Prep",
        desc: "Inspect and clear problem areas before ice dams form.",
        from: "$150",
      },
    ],
  },
};

export function SeasonalServices() {
  const [season, setSeason] = useState<Season>("spring");
  const active = SEASONS[season];

  return (
    <div>
      {/* Season tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {(Object.keys(SEASONS) as Season[]).map((key) => {
          const s = SEASONS[key];
          const Icon = s.icon;
          const isActive = key === season;
          return (
            <button
              key={key}
              onClick={() => setSeason(key)}
              className={cn(
                "group flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all sm:px-5",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary-foreground" : "text-primary"
                )}
              />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Active season content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={season}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:gap-8"
        >
          {/* Image + blurb */}
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src={active.image}
              alt={`${active.label} lawn care services`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent",
                active.accent
              )}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 text-background">
              <div className="flex items-center gap-2">
                <active.icon className="h-6 w-6" />
                <h3 className="text-2xl font-extrabold">{active.label}</h3>
              </div>
              <p className="mt-1.5 text-sm text-background/90">
                {active.blurb}
              </p>
            </div>
          </div>

          {/* Services list */}
          <div className="grid gap-3 sm:grid-cols-2">
            {active.services.map((svc) => (
              <div
                key={svc.name}
                className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
              >
                {svc.popular && (
                  <Badge className="absolute -top-2.5 right-4 rounded-full">
                    Most booked
                  </Badge>
                )}
                <h4 className="font-bold leading-tight">{svc.name}</h4>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                  {svc.desc}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">from</span>
                  <span className="text-lg font-extrabold text-primary">
                    {svc.from}
                  </span>
                </div>
                <a
                  href="#quote"
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-accent py-2 text-xs font-semibold text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <Check className="h-3.5 w-3.5" />
                  Add to my quote
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
