import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Star,
  ShieldCheck,
  Leaf,
  Sprout,
  Clock,
  Truck,
  BadgeCheck,
  HeartHandshake,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  ArrowRight,
  Quote,
  Sparkles,
  TrendingUp,
  Users,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site/header";
import { SeasonalServices } from "@/components/site/seasonal-services";
import { QuoteForm } from "@/components/site/quote-form";
import { Faq } from "@/components/site/faq";

const PHONE = "(763) 555-0142";
const PHONE_HREF = "tel:+17635550142";

export default function Home() {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-grid" />
          <div className="absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-20 -left-20 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:pb-24 lg:pt-20 lg:px-8">
            {/* Copy */}
            <div className="flex flex-col items-start">
              <Badge className="mb-5 gap-1.5 rounded-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                <Sparkles className="h-3.5 w-3.5" />
                Now booking spring cleanups — first 50 customers get 15% off
              </Badge>
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                A lusher, greener lawn —{" "}
                <span className="text-primary">without lifting a finger.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground text-balance">
                Maple Grove&apos;s trusted residential lawn care pros. Seasonal
                services, fair upfront pricing, and a healthy, weed-free lawn
                guaranteed — all season long.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full text-base">
                  <a href="#quote">
                    Get My Free Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full text-base"
                >
                  <a href={PHONE_HREF}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call {PHONE}
                  </a>
                </Button>
              </div>

              {/* Trust signals */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="font-semibold">4.9</span>
                  <span className="text-muted-foreground">
                    · 187 Google reviews
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Licensed &amp; Insured
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <HeartHandshake className="h-4 w-4 text-primary" />
                  100% Satisfaction Guarantee
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-border">
                <Image
                  src="/images/hero.png"
                  alt="Beautifully manicured green lawn cared for by Green Leaf Lawn Care in front of a suburban home"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-5 -left-3 sm:-left-5 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-sm animate-float-slow">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CalendarCheck className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-2xl font-extrabold leading-none">
                      2,400+
                    </p>
                    <p className="text-xs text-muted-foreground">
                      lawns serviced in 2024
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating rating card */}
              <div className="absolute -top-4 -right-2 sm:-right-4 rounded-2xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#4285F4] shadow-sm">
                    G
                  </span>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                      <span className="ml-1 text-xs font-bold">4.9</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      on Google Business
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust bar marquee */}
          <div className="border-y border-border bg-card/50 py-4">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 text-sm font-medium text-muted-foreground sm:px-6 lg:px-8">
              <span className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" /> Family-owned since 2014
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Free on-site estimates
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" /> MN licensed &amp;
                insured
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span className="flex items-center gap-2">
                <Sprout className="h-4 w-4 text-primary" /> Kid &amp; pet-safe
                treatments
              </span>
            </div>
          </div>
        </section>

        {/* ===== SEASONAL SERVICES ===== */}
        <section id="services" className="scroll-mt-20 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-3 rounded-full gap-1">
                <CalendarCheck className="h-3 w-3" /> Seasonal Services Menu
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                The right care, in every season
              </h2>
              <p className="mt-4 text-lg text-muted-foreground text-balance">
                Your lawn&apos;s needs change through the year. Our seasonal
                service menu keeps your yard looking its best 365 days a year —
                pick what you need, when you need it.
              </p>
            </div>
            <div className="mt-10">
              <SeasonalServices />
            </div>
          </div>
        </section>

        {/* ===== WHY CHOOSE US ===== */}
        <section
          id="why-us"
          className="scroll-mt-20 border-y border-border bg-card/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-3 rounded-full gap-1">
                <HeartHandshake className="h-3 w-3" /> Why Green Leaf
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                The local lawn care company your neighbors trust
              </h2>
              <p className="mt-4 text-lg text-muted-foreground text-balance">
                We&apos;re not a faceless national chain. We live here, we mow
                here, and we treat every lawn like it&apos;s our own.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Licensed & Insured",
                  desc: "Fully licensed in Minnesota and carrying comprehensive liability insurance for your peace of mind.",
                },
                {
                  icon: HeartHandshake,
                  title: "Satisfaction Guaranteed",
                  desc: "Not happy with a visit? We'll come back within 48 hours and make it right — free. No questions asked.",
                },
                {
                  icon: Sprout,
                  title: "Kid & Pet Safe",
                  desc: "Our fertilization and weed-control products are family- and pet-friendly, applied by certified technicians.",
                },
                {
                  icon: MapPin,
                  title: "Genuinely Local",
                  desc: "Based right here in Maple Grove. We know Minnesota grass, our winters, and exactly what your lawn needs.",
                },
                {
                  icon: Clock,
                  title: "Reliable & On-Time",
                  desc: "Same crew, same day, every week. You'll get a text when we're on the way and when the job's done.",
                },
                {
                  icon: TrendingUp,
                  title: "Upfront, Fair Pricing",
                  desc: "Instant online quotes with no hidden fees. What you see is what you pay — and you can pause anytime.",
                },
              ].map((f) => (
                <Card
                  key={f.title}
                  className="group border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <f.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats row */}
            <div className="mt-14 grid grid-cols-2 gap-4 rounded-3xl bg-primary p-8 text-primary-foreground sm:grid-cols-4 lg:p-10">
              {[
                { value: "10+", label: "years in business", icon: Clock },
                { value: "2,400+", label: "lawns serviced in 2024", icon: Sprout },
                { value: "4.9★", label: "187 Google reviews", icon: Star },
                { value: "6", label: "cities served locally", icon: MapPin },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon className="mx-auto mb-2 h-6 w-6 opacity-80" />
                  <p className="text-3xl font-extrabold tracking-tight lg:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/80">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-3 rounded-full gap-1">
                <Users className="h-3 w-3" /> How It Works
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                From quote to gorgeous lawn in 3 easy steps
              </h2>
            </div>

            <div className="relative mt-12 grid gap-8 md:grid-cols-3">
              <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
              {[
                {
                  step: "1",
                  title: "Get your instant quote",
                  desc: "Tell us about your lawn in 60 seconds. See your estimated price immediately — no waiting for a callback.",
                  icon: Sparkles,
                },
                {
                  step: "2",
                  title: "Pick a plan & schedule",
                  desc: "Choose weekly, bi-weekly, or one-time. We'll lock in your service day and send a confirmation right away.",
                  icon: CalendarCheck,
                },
                {
                  step: "3",
                  title: "Enjoy a perfect lawn",
                  desc: "Our uniformed crew shows up on schedule. You get text notifications and a flawless lawn — every time.",
                  icon: Leaf,
                },
              ].map((s) => (
                <div key={s.step} className="relative text-center">
                  <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background shadow-sm">
                    <s.icon className="h-7 w-7 text-primary" />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TRANSFORMATION ===== */}
        <section className="border-y border-border bg-card/40 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="relative">
                <div className="relative aspect-[7/4] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-border">
                  <Image
                    src="/images/transformation.png"
                    alt="Lawn transformation showing patchy brown weeds lawn transformed into lush thick green grass"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -bottom-5 right-4 rounded-2xl border border-border bg-card px-5 py-3 shadow-xl">
                  <p className="text-xs font-medium text-muted-foreground">
                    After 6 weeks of Green Leaf care
                  </p>
                  <p className="text-2xl font-extrabold text-primary">
                    +92% healthier
                  </p>
                </div>
              </div>
              <div>
                <Badge className="mb-3 rounded-full gap-1">
                  <TrendingUp className="h-3 w-3" /> Real Results
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                  From patchy &amp; weedy to thick &amp; green — in one season
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  This Maple Grove lawn was thin, full of dandelions, and
                  struggling after a harsh winter. Six weeks into our
                  fertilization + aeration + weekly mowing program, it&apos;s
                  the envy of the block.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Custom 5-treatment fertilizer & weed program",
                    "Core aeration and premium overseeding",
                    "Weekly mowing at optimal height",
                    "Zero weeds, zero bare spots",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                      </span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="mt-7 rounded-full">
                  <a href="#quote">
                    Transform my lawn
                    <ArrowRight className="ml-2 h-4 w-4" />
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
          <div className="absolute inset-0 -z-10 bg-grid opacity-50" />
          <div className="absolute -top-20 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-3 rounded-full gap-1">
                <Sparkles className="h-3 w-3" /> Instant Quote
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Get your free instant quote in 60 seconds
              </h2>
              <p className="mt-4 text-lg text-muted-foreground text-balance">
                No waiting, no pressure. Tell us about your lawn and see your
                estimated price right now.
              </p>
            </div>
            <div className="mt-10">
              <QuoteForm />
            </div>
          </div>
        </section>

        {/* ===== REVIEWS ===== */}
        <section
          id="reviews"
          className="scroll-mt-20 border-y border-border bg-card/40 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
              {/* Rating summary */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <Badge className="mb-3 rounded-full gap-1">
                  <Star className="h-3 w-3 fill-current" /> Google Reviews
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                  Loved by 187 neighbors on Google
                </h2>
                <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold text-[#4285F4] shadow-sm">
                      G
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-extrabold">4.9</span>
                        <div className="flex flex-col">
                          <div className="flex">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            187 reviews
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
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
                        <span className="w-3 font-medium">{r.stars}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${r.pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-muted-foreground">
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
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read all reviews on Google
                    </a>
                  </Button>
                </div>
              </div>

              {/* Review cards */}
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  {
                    name: "Sarah M.",
                    area: "Maple Grove, MN",
                    time: "2 weeks ago",
                    text: "Green Leaf completely transformed our lawn. We went from the worst yard on the block to the best in one season. The crew is always on time, professional, and the price was exactly what they quoted. Highly recommend!",
                  },
                  {
                    name: "Mike R.",
                    area: "Plymouth, MN",
                    time: "1 month ago",
                    text: "I've used three other lawn companies over the years and these guys are by far the best. The instant quote was spot-on, no surprise fees, and my lawn has never looked greener. The text notifications are a nice touch.",
                  },
                  {
                    name: "Jennifer K.",
                    area: "Brooklyn Park, MN",
                    time: "1 month ago",
                    text: "Their fall aeration and overseeding made a huge difference this spring. My grass came in so thick I barely have any weeds anymore. Worth every penny.",
                  },
                  {
                    name: "David L.",
                    area: "Osseo, MN",
                    time: "2 months ago",
                    text: "Called them on a Monday for spring cleanup, they were out Wednesday. Fast, friendly, and they did an amazing job cleaning up a winter's worth of debris. New customer for life.",
                  },
                ].map((r) => (
                  <Card
                    key={r.name}
                    className="border-border bg-card shadow-sm"
                  >
                    <CardContent className="flex h-full flex-col p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {r.name.charAt(0)}
                          </span>
                          <div>
                            <p className="text-sm font-semibold">{r.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {r.area}
                            </p>
                          </div>
                        </div>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#4285F4] shadow-sm">
                          G
                        </span>
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
                      <Quote className="mt-3 h-5 w-5 text-primary/30" />
                      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
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
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <Badge className="mb-3 rounded-full gap-1">
                  <MapPin className="h-3 w-3" /> Service Areas
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                  Proudly serving the northwest Twin Cities metro
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Green Leaf Lawn Care is based in Maple Grove and serves
                  homeowners across the northwest suburbs. If you&apos;re in
                  one of these communities, we&apos;ve got you covered:
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                      className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {city}
                    </a>
                  ))}
                </div>
                <p className="mt-5 text-sm text-muted-foreground">
                  Don&apos;t see your city?{" "}
                  <a
                    href={PHONE_HREF}
                    className="font-semibold text-primary hover:underline"
                  >
                    Give us a call
                  </a>{" "}
                  — we&apos;re expanding and may already serve your area.
                </p>
              </div>

              {/* Map embed mock */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
                <Image
                  src="/images/gallery-1.png"
                  alt="Landscaped suburban backyard served by Green Leaf Lawn Care"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-border bg-card/95 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-bold">Green Leaf Lawn Care HQ</p>
                      <p className="text-sm text-muted-foreground">
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
        <section className="border-t border-border bg-card/40 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-3 rounded-full gap-1">
                <Leaf className="h-3 w-3" /> Our Work
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Lawns we&apos;re proud of
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A small sample of the yards we keep beautiful across the
                northwest metro.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { src: "/images/gallery-1.png", alt: "Beautifully landscaped backyard with green grass" },
                { src: "/images/gallery-2.png", alt: "Manicured front yard with crisp grass edging along sidewalk" },
                { src: "/images/technician.png", alt: "Friendly Green Leaf lawn care technician on a green lawn" },
              ].map((g) => (
                <div
                  key={g.src}
                  className="group relative aspect-square overflow-hidden rounded-2xl shadow-md ring-1 ring-border"
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
              <Badge className="mb-3 rounded-full gap-1">
                <BadgeCheck className="h-3 w-3" /> FAQ
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Questions, answered
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to know before we show up with the mowers.
              </p>
            </div>
            <div className="mt-10">
              <Faq />
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/grass-texture.png"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-foreground/70 backdrop-blur-[2px]" />
          </div>
          <div className="mx-auto max-w-4xl px-4 py-20 text-center text-background sm:px-6 lg:px-8 lg:py-28">
            <Leaf className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
              Ready for the best-looking lawn on your block?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-background/85 text-balance">
              Join 2,400+ happy homeowners across the northwest Twin Cities.
              Get your free instant quote now — or call us and we&apos;ll take
              care of the rest.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full text-base">
                <a href="#quote">
                  Get My Free Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full text-base"
              >
                <a href={PHONE_HREF}>
                  <Phone className="mr-2 h-4 w-4" />
                  {PHONE}
                </a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-background/70">
              Mon–Fri 7am–6pm · Sat 8am–4pm · Free estimates · Licensed &amp;
              insured
            </p>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="mt-auto border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            {/* Brand + NAP */}
            <div>
              <Link href="#top" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Leaf className="h-5 w-5" />
                </span>
                <span className="flex flex-col leading-none">
                  <span className="text-base font-extrabold tracking-tight">
                    Green Leaf
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                    Lawn Care
                  </span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Family-owned residential lawn care serving the northwest Twin
                Cities since 2014. A greener lawn, guaranteed.
              </p>
              <div className="mt-5 space-y-2 text-sm">
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  1482 Oak Ridge Avenue
                  <br />
                  Maple Grove, MN 55369
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
              <div className="mt-5 flex gap-2">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Instagram, label: "Instagram" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
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

            {/* Service Areas */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
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

            {/* Hours */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Hours
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="flex justify-between gap-3 text-muted-foreground">
                  <span>Mon – Fri</span>
                  <span className="font-medium text-foreground">
                    7am – 6pm
                  </span>
                </li>
                <li className="flex justify-between gap-3 text-muted-foreground">
                  <span>Saturday</span>
                  <span className="font-medium text-foreground">
                    8am – 4pm
                  </span>
                </li>
                <li className="flex justify-between gap-3 text-muted-foreground">
                  <span>Sunday</span>
                  <span className="font-medium text-foreground">Closed</span>
                </li>
              </ul>
              <Button asChild className="mt-5 w-full rounded-full" size="sm">
                <a href="#quote">Get Free Quote</a>
              </Button>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
            <p>
              © {new Date().getFullYear()} Green Leaf Lawn Care, LLC. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Licensed &amp; Insured · MN LIC #LC-2024-1482
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
