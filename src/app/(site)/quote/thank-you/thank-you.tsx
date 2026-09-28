"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon3D } from "@/components/site/icon-3d";
import { readLastLeadRaw } from "@/lib/forms";
import { useClientValue } from "@/lib/use-client-value";
import { site, phoneHref } from "@/config/site";
import { DURATION, EASE_SOFT } from "@/lib/motion";

export function ThankYou() {
  const raw = useClientValue(readLastLeadRaw, null);
  const lead = useMemo<Record<string, string> | null>(() => {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [raw]);
  const first = lead?.name?.split(" ")[0];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-sage-50 to-cream px-4 pb-24 pt-32 sm:px-6 lg:pt-40">
      <div aria-hidden className="stripes absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: DURATION.reveal, ease: EASE_SOFT }}
          className="inline-block"
        >
          <Icon3D name="party" size={112} />
        </motion.div>
        <h1 className="font-display mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
          {first ? `Thanks, ${first}. We got it.` : "Thanks. We got your request."}
        </h1>
        <p className="measure mx-auto mt-5 text-lg leading-relaxed text-muted-foreground">
          {lead?.estimate
            ? `Your ${lead.service_name?.toLowerCase() ?? "lawn care"} estimate is ${lead.estimate}. `
            : ""}
          We will call within one business day to confirm the details and set your start date.
        </p>
        {site.demoMode && (
          <p className="mx-auto mt-4 max-w-md rounded-2xl bg-wheat-100 px-4 py-3 text-sm text-foreground/80">
            This is a demo site by {site.builtBy.name}. Nothing was sent. Connect a form endpoint in the site config to
            receive real leads.
          </p>
        )}

        <ol className="mt-12 grid gap-4 text-left sm:grid-cols-3">
          {[
            { icon: "phone" as const, title: "We call you", desc: "Within one business day, at the number you gave us." },
            { icon: "handshake" as const, title: "Quick site visit", desc: "A crew lead confirms the price. Takes ten minutes." },
            { icon: "tractor" as const, title: "Service starts", desc: "Same crew, same day, every week after that." },
          ].map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: DURATION.reveal, ease: EASE_SOFT }}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <Icon3D name={s.icon} size={44} />
              <p className="mt-3 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="cta" size="lg">
            <a href={phoneHref} className="group">
              <Icon3D name="phone" size={20} float />
              Call now: <span className="nowrap">{site.phone.display}</span>
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/blog" className="arrow-link">
              Read lawn care tips
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
