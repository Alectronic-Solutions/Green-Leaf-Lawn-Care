import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/asset-path";
import {
  Phone,
  Star,
  ShieldCheck,
  Sprout,
  Clock,
  MapPin,
  Mail,
  ArrowUpRight,
  Quote,
  CalendarCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site/header";
import { HeroVideo } from "@/components/site/hero-video";
import { LogoMark } from "@/components/site/logo-mark";
import { GoogleGIcon } from "@/components/site/google-icon";
import { SeasonalServices } from "@/components/site/seasonal-services";
import { WhyGreenLeaf } from "@/components/site/why-green-leaf";
import { QuoteForm } from "@/components/site/quote-form";
import { Faq } from "@/components/site/faq";

const PHONE = "(763) 555-0142";
const PHONE_HREF = "tel:+17635550142";

export default function Home() {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1 pt-16">
        {/* ===== HERO ===== */}
        <section className="relative isolate min-h-[36rem] overflow-hidden lg:min-h-[42rem]">
          <div className="absolute inset-0 -z-10">
            <HeroVideo
              src={assetPath("/videos/hero-mowing.mp4")}
              poster={assetPath("/images/hero-video-poster.jpg")}
            />
            <Image
              src={assetPath("/images/hero-video-poster.jpg")}
              alt="A lawn care technician mowing a residential lawn"
              fill
              priority
              className="object-cover motion-safe:hidden"
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/60 to-foreground/30" />
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:pb-12 lg:pt-24 lg:px-8">
            <div className="flex flex-col items-start">
              {/* Copy */}
              <div className="flex max-w-2xl flex-col items-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-3 py-1 backdrop-blur-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-background">
                    Now booking summer service
                  </span>
                </div>

                <h1 className="font-display mt-6 text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] text-balance text-background drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-[3.5rem] lg:text-[4rem]">
                  Residential lawn care,{" "}
                  <span className="text-amber-300">done right</span> the first
                  time.
                </h1>
                <p className="mt-5 max-w-md text-[17px] leading-[1.6] text-background/90 text-balance drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                  Weekly mowing, fertilization, aeration, and seasonal cleanup
                  for homes across the northwest Twin Cities. Upfront pricing,
                  the same crew every visit, and a lawn you don't have to
                  think about.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="rounded-full bg-amber-400 text-[15px] text-foreground shadow-md shadow-amber-400/20 hover:bg-amber-300">
                    <a href="#quote">
                      Get a quote
                      <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-background/40 bg-background/10 text-[15px] text-background backdrop-blur-sm hover:bg-background/20 hover:text-background"
                  >
                    <a href={PHONE_HREF}>
                      <Phone className="mr-2 h-4 w-4" />
                      {PHONE}
                    </a>
                  </Button>
                </div>

                {/* Inline rating */}
                <div className="mt-9 flex items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold tabular-nums text-background">4.9</span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-[12px] text-background/80">
                      <GoogleGIcon className="h-3 w-3" />
                      187 Google reviews
                    </p>
                  </div>
                  <div className="h-9 w-px bg-background/25" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tabular-nums text-background">
                      1,800+
                    </span>
                    <p className="mt-0.5 text-[12px] text-background/80">
                      lawns maintained to date
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating service chip */}
              <div className="mt-8 hidden rounded-xl border border-background/20 bg-background/10 p-3.5 backdrop-blur-sm sm:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/20 text-amber-400">
                    <CalendarCheck className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-background/70">
                      This week
                    </p>
                    <p className="text-sm font-bold text-background">
                      42 lawns scheduled
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust bar */}
            <div className="mt-10 grid grid-cols-4 gap-x-2 gap-y-0 border-t border-background/15 pt-6 sm:gap-x-6">
              {[
                { icon: ShieldCheck, label: "Licensed and insured", sub: "MN Lic. #LC-2024-1482" },
                { icon: Clock, label: "Same crew, same day", sub: "Every week, all season" },
                { icon: Sprout, label: "Pet and family safe", sub: "Re-entry intervals that work" },
                { icon: MapPin, label: "Free on-site estimates", sub: "We come to you, no charge" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-start sm:gap-2.5">
                  <t.icon className="h-4 w-4 shrink-0 text-amber-400" strokeWidth={2} />
                  <div>
                    <p className="text-xs font-semibold leading-tight text-background sm:text-sm">
                      {t.label}
                    </p>
                    <p className="mt-0.5 hidden text-xs leading-tight text-background/70 sm:block">
                      {t.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SEASONAL SERVICES ===== */}
        <section id="services" className="scroll-mt-20 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Seasonal services
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                What your lawn needs, when it needs it
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-balance">
                Minnesota turf changes through the year. Our service calendar
                follows it, so your lawn gets the right care at the right time.
              </p>
            </div>
            <div className="mt-12">
              <SeasonalServices />
            </div>
          </div>
        </section>

        {/* ===== WHY GREEN LEAF ===== */}
        <WhyGreenLeaf />

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                How it works
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Three steps from quote to a maintained lawn
              </h2>
            </div>

            <div className="relative mt-14 grid gap-10 md:grid-cols-3">
              <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
              {[
                {
                  step: "01",
                  title: "Tell us about your lawn",
                  desc: "Answer a few questions and see your estimated price immediately. No waiting for a callback.",
                },
                {
                  step: "02",
                  title: "We confirm on site",
                  desc: "A crew lead stops by to verify the estimate and note specifics like gate codes or problem areas.",
                },
                {
                  step: "03",
                  title: "Service begins",
                  desc: "Same crew, same day, every week. You get a text when we are on the way and when we are done.",
                },
              ].map((s) => (
                <div key={s.step} className="relative text-center">
                  <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
                    <span className="text-sm font-bold tabular-nums text-primary">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TRANSFORMATION ===== */}
        <section className="bg-card/40 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="relative">
                <div className="relative aspect-7/4 overflow-hidden rounded-2xl shadow-lg ring-1 ring-border">
                  <Image
                    src={assetPath("/images/transformation.png")}
                    alt="A lawn transformation. Patchy, thin turf on the left, thick and green on the right, six weeks into a Green Leaf care program."
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 48vw"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Real results
                </p>
                <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  A Maple Grove lawn, six weeks apart
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  This lawn came to us thin, weed-heavy, and recovering from a
                  rough winter. We started with aeration and overseeding, built
                  a five-treatment fertilizer program around it, and kept it at
                  a 3.5-inch cut through summer. The photo on the right is six
                  weeks in.
                </p>
                <ul className="mt-7 space-y-3">
                  {[
                    "Custom five-treatment fertilizer and weed program",
                    "Core aeration with Kentucky bluegrass overseed",
                    "Weekly mowing at 3.5 inches through summer",
                    "No bare spots, no dandelions by mid-June",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check
                          className="h-3 w-3 text-primary"
                          strokeWidth={3}
                        />
                      </span>
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="mt-8 rounded-full">
                  <a href="#quote">
                    Get my estimate
                    <ArrowUpRight className="ml-1.5 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== QUOTE FORM ===== */}
        <section
          id="quote"
          className="scroll-mt-20 relative overflow-hidden py-16 lg:py-24"
        >
          <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Instant estimate
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                See your price in under a minute
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-balance">
                No waiting, no pressure. Tell us about your lawn and your
                estimated price updates as you go.
              </p>
            </div>
            <div className="mt-12">
              <QuoteForm />
            </div>
          </div>
        </section>

        {/* ===== REVIEWS ===== */}
        <section
          id="reviews"
          className="scroll-mt-20 bg-card/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Google reviews
                </p>
                <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  Rated 4.9 by 187 neighbors
                </h2>
                <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                      <GoogleGIcon className="h-6 w-6" />
                    </span>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tabular-nums">
                          4.9
                        </span>
                        <div className="flex">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        187 reviews on Google
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-1.5">
                    {[
                      { stars: 5, pct: 92 },
                      { stars: 4, pct: 6 },
                      { stars: 3, pct: 1 },
                      { stars: 2, pct: 1 },
                      { stars: 1, pct: 0 },
                    ].map((r) => (
                      <div
                        key={r.stars}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="w-3 font-medium tabular-nums">
                          {r.stars}
                        </span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${r.pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-muted-foreground tabular-nums">
                          {r.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 w-full rounded-full"
                  >
                    <a
                      href="https://g.page/r/greenleaflawncare-maplegrovemn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read all reviews on Google
                    </a>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    name: "Sarah M.",
                    area: "Maple Grove, MN",
                    time: "2 weeks ago",
                    avatar: "https://i.pravatar.cc/72?img=47",
                    text: "Green Leaf took over our lawn last spring after we fired the big national company. The difference is obvious. Same crew every week, they actually edge, and the price didn't go up after the first month. Wish we'd switched sooner.",
                  },
                  {
                    name: "Mike R.",
                    area: "Plymouth, MN",
                    time: "1 month ago",
                    avatar: "https://i.pravatar.cc/72?img=12",
                    text: "I got a quote in under a minute and they were out the same week. The fall aeration made a real difference this spring, way fewer bare spots.",
                  },
                  {
                    name: "Jennifer K.",
                    area: "Brooklyn Park, MN",
                    time: "1 month ago",
                    avatar: "https://i.pravatar.cc/72?img=32",
                    text: "Honest crew. They told me I didn't need the full program, just aeration and a winterizer. Saved me money and the lawn looks better than ever.",
                  },
                  {
                    name: "David L.",
                    area: "Osseo, MN",
                    time: "2 months ago",
                    avatar: "https://i.pravatar.cc/72?img=7",
                    text: "Called Monday for a spring cleanup. They came Wednesday. The yard hadn't been touched since fall and they had it looking good in an afternoon.",
                  },
                  {
                    name: "Rachel T.",
                    area: "Champlin, MN",
                    time: "3 months ago",
                    avatar: "https://i.pravatar.cc/72?img=44",
                    text: "We have a corner lot with a lot of edging and it always looks razor sharp. Every other service we tried left the sidewalk a mess. These guys don't.",
                  },
                  {
                    name: "Tom W.",
                    area: "Dayton, MN",
                    time: "3 months ago",
                    avatar: "https://i.pravatar.cc/72?img=53",
                    text: "Signed up for the snow removal contract in October and they showed up before I even woke up after the first big storm. Zero effort on my end. Worth every dollar.",
                  },
                ].map((r) => (
                  <Card
                    key={r.name}
                    className="border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <CardContent className="flex h-full flex-col p-5">
                      <div className="flex items-center gap-3">
                        <Image
                          src={r.avatar}
                          alt={r.name}
                          width={36}
                          height={36}
                          className="rounded-full object-cover ring-1 ring-border"
                        />
                        <div>
                          <p className="text-sm font-semibold">{r.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.area}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {r.time}
                        </span>
                      </div>
                      <Quote className="mt-3 h-4 w-4 text-primary/25" />
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {r.text}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICE AREAS ===== */}
        <section id="areas" className="scroll-mt-20 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Service areas
                </p>
                <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  Serving the northwest Twin Cities
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Green Leaf is based in Maple Grove and serves homeowners
                  across the northwest suburbs. If your city is on this list,
                  you are in our zone.
                </p>
                <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {[
                    "Maple Grove",
                    "Plymouth",
                    "Brooklyn Park",
                    "Osseo",
                    "Champlin",
                    "Dayton",
                    "Brooklyn Center",
                    "New Hope",
                    "Crystal",
                  ].map((city) => (
                    <a
                      key={city}
                      href="#quote"
                      className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent/50"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {city}
                    </a>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Don't see your city?{" "}
                  <a
                    href={PHONE_HREF}
                    className="font-semibold text-primary hover:underline"
                  >
                    Give us a call
                  </a>
                  . We are expanding and may already serve your area.
                </p>
              </div>

              <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <Image
                  src={assetPath("/images/gallery-1.png")}
                  alt="A landscaped backyard in the northwest Twin Cities served by Green Leaf Lawn Care"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border bg-background/95 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">
                        Green Leaf Lawn Care
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1482 Oak Ridge Avenue, Maple Grove, MN 55369
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== GALLERY ===== */}
        <section className="bg-card/40 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Our work
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Lawns we maintain
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  src: assetPath("/images/gallery-1.png"),
                  alt: "A landscaped backyard with green grass and trimmed beds",
                },
                {
                  src: assetPath("/images/gallery-2.png"),
                  alt: "A manicured front yard with crisp grass edging along the sidewalk",
                },
                {
                  src: assetPath("/images/technician.png"),
                  alt: "A Green Leaf technician mowing a residential lawn",
                },
                {
                  src: assetPath("/images/summer.png"),
                  alt: "A thick, healthy lawn during peak summer growth",
                },
                {
                  src: assetPath("/images/fall.png"),
                  alt: "Fall leaf removal and cleanup on a residential property",
                },
                {
                  src: assetPath("/images/spring.png"),
                  alt: "Fresh spring green-up after a Green Leaf fertilization program",
                },
              ].map((g) => (
                <div
                  key={g.src}
                  className="group relative aspect-4/3 overflow-hidden rounded-xl ring-1 ring-border"
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="scroll-mt-20 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                FAQ
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Things people ask before they call
              </h2>
            </div>
            <div className="mt-10">
              <Faq />
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section
          className="relative overflow-hidden bg-foreground bg-cover bg-center bg-fixed text-background"
          style={{
            backgroundImage: `url(${assetPath("/images/grass-texture.png")})`,
          }}
        >
          <div className="absolute inset-0 bg-foreground/80" />
          <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance text-background drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] sm:text-5xl">
              Ready to hand off the lawn?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-background/90 text-balance drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
              Get a quote in under a minute, or call and we will walk you
              through it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <a href="#quote">
                  Get a quote
                  <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full"
              >
                <a href={PHONE_HREF}>
                  <Phone className="mr-2 h-4 w-4" />
                  {PHONE}
                </a>
              </Button>
            </div>
            <p className="mt-7 text-sm text-background/75 sm:text-base">
              Mon to Fri 7am to 6pm · Sat 8am to 4pm · Free estimates ·
              Licensed and insured
            </p>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="mt-auto bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="col-span-2 sm:col-span-1">
              <Link href="#top" className="flex items-center gap-2.5">
                <LogoMark className="h-9 w-9" />
                <span className="flex flex-col leading-none">
                  <span className="text-[15px] font-bold tracking-tight">
                    Green Leaf
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Lawn Care
                  </span>
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Family-owned residential lawn care serving the northwest Twin
                Cities since 2014.
              </p>
              <div className="mt-5 space-y-2 text-sm">
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    1482 Oak Ridge Avenue
                    <br />
                    Maple Grove, MN 55369
                  </span>
                </p>
                <a
                  href={PHONE_HREF}
                  className="flex items-center gap-2 font-semibold text-foreground hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  {PHONE}
                </a>
                <a
                  href="mailto:hello@greenleaflawncare.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  hello@greenleaflawncare.com
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                Services
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  "Lawn Mowing",
                  "Fertilization",
                  "Aeration & Seeding",
                  "Leaf Removal",
                  "Spring Cleanup",
                  "Snow Removal",
                ].map((s) => (
                  <li key={s}>
                    <a
                      href="#services"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                Service Areas
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  "Maple Grove",
                  "Plymouth",
                  "Brooklyn Park",
                  "Osseo",
                  "Champlin",
                  "Dayton",
                ].map((c) => (
                  <li key={c}>
                    <a
                      href="#areas"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {c}, MN
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                Hours
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="flex justify-between gap-3 text-muted-foreground">
                  <span>Mon to Fri</span>
                  <span className="font-medium text-foreground">7am to 6pm</span>
                </li>
                <li className="flex justify-between gap-3 text-muted-foreground">
                  <span>Saturday</span>
                  <span className="font-medium text-foreground">8am to 4pm</span>
                </li>
                <li className="flex justify-between gap-3 text-muted-foreground">
                  <span>Sunday</span>
                  <span className="font-medium text-foreground">Closed</span>
                </li>
              </ul>
              <Button asChild className="mt-5 w-full rounded-full" size="sm">
                <a href="#quote">Get a quote</a>
              </Button>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Green Leaf Lawn Care, LLC. All
              rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Licensed and insured · MN Lic. #LC-2024-1482
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy"
                  className="hover:text-primary underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-primary underline-offset-2 hover:underline"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-row items-center justify-between gap-1.5 text-xs text-muted-foreground">
            <p>
              Designed by{" "}
              <a
                href="https://alectronicsolutions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary underline-offset-2 hover:underline"
              >
                Alectronic Solutions
              </a>
            </p>
            <a
              href="#top"
              className="mr-4 hover:text-primary underline-offset-2 hover:underline"
            >
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
