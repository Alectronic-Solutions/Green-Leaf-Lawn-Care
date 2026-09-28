"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon3D } from "@/components/site/icon-3d";
import { seasons, type Season } from "@/content/services";
import { cn } from "@/lib/utils";
import { DURATION, EASE_SOFT } from "@/lib/motion";
import { useClientValue } from "@/lib/use-client-value";

function currentSeason(): Season {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "fall";
  return "winter";
}

export function SeasonalServices() {
  // The static HTML shows spring; the browser opens on the real season
  // until the visitor picks a tab.
  const season = useClientValue<Season>(currentSeason, "spring");
  const [picked, setKey] = useState<Season | null>(null);
  const key = picked ?? season;
  const active = seasons.find((s) => s.key === key)!;

  return (
    <div>
      <div role="tablist" aria-label="Season" className="mx-auto flex w-fit flex-wrap justify-center gap-1 rounded-full border border-border bg-card p-1.5 shadow-soft">
        {seasons.map((s) => {
          const selected = s.key === key;
          return (
            <button
              key={s.key}
              role="tab"
              id={`season-tab-${s.key}`}
              aria-selected={selected}
              aria-controls="season-panel"
              onClick={() => setKey(s.key)}
              className={cn(
                "group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-(--dur-ui) sm:px-5",
                selected ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
              )}
            >
              {selected && (
                <motion.span
                  layoutId="season-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-soft"
                  transition={{ duration: DURATION.ui, ease: EASE_SOFT }}
                />
              )}
              <Icon3D name={s.icon} size={22} float className="relative" />
              <span className="relative">{s.label}</span>
              <span className={cn("relative hidden text-xs font-normal sm:inline", selected ? "text-primary-foreground/75" : "text-muted-foreground")}>
                {s.months}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          id="season-panel"
          role="tabpanel"
          aria-labelledby={`season-tab-${key}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: DURATION.ui, ease: EASE_SOFT }}
          className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8"
        >
          <div className="relative min-h-80 overflow-hidden rounded-3xl lg:min-h-full">
            <Image src={active.image} alt={`${active.label} lawn care`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-forest-950/85 via-forest-950/25 to-transparent" />
            <div className="on-dark absolute inset-x-0 bottom-0 p-7 text-cream">
              <Icon3D name={active.icon} size={56} />
              <p className="font-display mt-3 text-2xl font-semibold">{active.label}</p>
              <p className="measure-narrow mt-2 leading-relaxed text-cream/85">{active.blurb}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {active.items.map((item) => (
              <Link
                key={item.name}
                href={`/services/${item.service}`}
                className="group lift flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft hover:border-primary/30"
              >
                <h3 className="font-semibold leading-snug">{item.name}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <span>
                    <span className="block text-xs text-muted-foreground">From</span>
                    <span className="font-display text-2xl font-semibold text-forest-800 nowrap">{item.from}</span>
                  </span>
                  <span className="arrow-link text-sm font-semibold text-primary">Details</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
