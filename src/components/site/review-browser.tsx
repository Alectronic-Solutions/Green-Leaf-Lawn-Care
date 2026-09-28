"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ReviewCard } from "@/components/site/cards";
import { reviews } from "@/content/reviews";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";
import { DURATION, EASE_SOFT } from "@/lib/motion";

export function ReviewBrowser() {
  const [service, setService] = useState("all");
  const used = useMemo(() => services.filter((s) => reviews.some((r) => r.service === s.slug)), []);
  const shown = service === "all" ? reviews : reviews.filter((r) => r.service === service);

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-(--dur-ui)",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground/75 hover:border-primary/40 hover:text-foreground"
    );

  return (
    <div>
      <div role="group" aria-label="Filter reviews by service" className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={service === "all"} onClick={() => setService("all")} className={chip(service === "all")}>
          All reviews
        </button>
        {used.map((s) => (
          <button key={s.slug} type="button" aria-pressed={service === s.slug} onClick={() => setService(s.slug)} className={chip(service === s.slug)}>
            {s.short.charAt(0).toUpperCase() + s.short.slice(1)}
          </button>
        ))}
      </div>
      <motion.div layout className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((r) => (
            <motion.div
              layout
              key={r.name + r.date}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: DURATION.ui, ease: EASE_SOFT }}
            >
              <ReviewCard review={r} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
