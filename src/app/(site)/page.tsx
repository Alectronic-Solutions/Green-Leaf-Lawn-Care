import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroVideo } from "@/components/site/hero-video";
import { Icon3D } from "@/components/site/icon-3d";
import { GoogleGIcon } from "@/components/site/google-icon";
import { WhyGreenLeaf } from "@/components/site/why-green-leaf";
import { HowItWorks } from "@/components/site/how-it-works";
import { BeforeAfterSlider } from "@/components/site/before-after-slider";
import { QuoteForm } from "@/components/site/quote-form";
import { Faq } from "@/components/site/faq";
import { GameSection } from "@/components/game/game-section";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { CtaBand, IconList, SectionHeading, Stars } from "@/components/site/page-parts";
import { CityCard, ReviewCard, ServiceCard } from "@/components/site/cards";
import { assetPath } from "@/lib/asset-path";
import { buildMetadata, faqLd } from "@/lib/seo";
import { site, phoneHref } from "@/config/site";
import { services } from "@/content/services";
import { cities } from "@/content/cities";
import { reviews } from "@/content/reviews";
import { faqs } from "@/content/faqs";

export const metadata = buildMetadata({ path: "/" });

const featuredFaqs = faqs.filter((f) => f.featured);

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd(featuredFaqs)} />

      {/* ===== HERO ===== */}
      <section className="relative isolate flex min-h-[40rem] flex-col overflow-hidden bg-ink lg:min-h-[max(44rem,100svh)]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-video-poster.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <HeroVideo
            src={assetPath("/videos/hero-mowing.mp4")}
            mobileSrc={assetPath("/videos/hero-mowing-mobile.mp4")}
          />
          <div className="absolute inset-0 bg-linear-to-r from-forest-950/85 via-forest-950/55 to-forest-950/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-forest-950/70 to-transparent" />
        </div>

        <div className="on-dark mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pt-36">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2.5 text-sm font-medium text-cream/85">
              <span className="pulse-dot" aria-hidden />
              Booking new lawns this week in {site.address.city}
            </p>
            <h1 className="font-display mt-5 max-w-[15ch] text-[2.75rem] font-semibold leading-[1.02] text-cream sm:text-6xl lg:text-7xl">
              Lawn care in {site.address.city}, <span className="text-wheat-400">done right</span> the first time.
            </h1>
            <p className="measure-narrow mt-6 text-lg leading-relaxed text-cream/85">
              Weekly mowing, fertilization, aeration, and seasonal cleanup across {site.region}. Upfront pricing and the
              same crew every visit.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="cta" size="lg">
                <Link href="/quote" className="arrow-link">
                  See my price in 60 seconds
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <a href={phoneHref} className="group">
                  <Icon3D name="phone" size={22} float />
                  <span className="nowrap">{site.phone.display}</span>
                </a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Stars size={18} />
                  <span className="font-semibold tabular-nums text-cream">{site.rating.value}</span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-cream/75">
                  <GoogleGIcon className="h-3 w-3" />
                  {site.rating.count} Google reviews
                </p>
              </div>
              <div className="h-9 w-px bg-cream/20" aria-hidden />
              <div>
                <p className="font-semibold tabular-nums text-cream">{site.stats.lawns}</p>
                <p className="mt-1 text-xs text-cream/75">lawns maintained since {site.foundedYear}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section aria-label="Why homeowners choose us" className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: "shield" as const, label: "Licensed and insured", sub: site.license },
            { icon: "calendar" as const, label: "Same crew, same day", sub: "Every week, all season" },
            { icon: "paw" as const, label: "Pet and family safe", sub: "Re-entry times texted to you" },
            { icon: "handshake" as const, label: "No contracts", sub: "Pause or cancel anytime" },
          ].map((t) => (
            <div key={t.label} className="group flex items-center gap-3.5">
              <Icon3D name={t.icon} size={44} float />
              <div>
                <p className="text-sm font-semibold leading-tight sm:text-[15px]">{t.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Services"
              title="Everything your lawn needs, all year"
              lead="Minnesota turf changes with the seasons, and so does our calendar. Pick one service or hand us the whole year."
            />
            <Reveal className="shrink-0">
              <Link href="/services" className="arrow-link text-sm font-semibold text-primary">
                See the seasonal calendar
              </Link>
            </Reveal>
          </div>
          <RevealGroup className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <RevealItem key={s.slug}>
                <ServiceCard service={s} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <WhyGreenLeaf />
      <HowItWorks />

      {/* ===== TRANSFORMATION ===== */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <Reveal>
            <BeforeAfterSlider
              before="/images/transformation-before.webp"
              after="/images/transformation-after.webp"
              alt="A Maple Grove lawn transformation: thin, patchy turf before and thick, green turf six weeks into a care program"
            />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Real results"
              title={`A ${site.address.city} lawn, six weeks apart`}
              lead="This lawn came to us thin, weedy, and recovering from a rough winter. Here is what we did."
            />
            <Reveal delay={0.1}>
              <IconList
                className="mt-7 text-base"
                items={[
                  "Core aeration with a Kentucky bluegrass overseed",
                  "A custom five-step feeding and weed program",
                  "Weekly mowing at 3.5 inches through the summer",
                  "No bare spots and no dandelions by mid-June",
                ]}
              />
              <Button asChild className="mt-9" size="lg">
                <Link href="/gallery" className="arrow-link">
                  See more of our work
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      <GameSection />

      {/* ===== QUOTE ===== */}
      <section id="quote" className="scroll-mt-20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Instant estimate"
            title="See your price in under a minute"
            lead="No waiting and no pressure. Tell us about your lawn and the price updates as you go."
          />
          <Reveal className="mt-12">
            <QuoteForm compact />
          </Reveal>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="bg-cream-deep py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Google reviews" title={`Rated ${site.rating.value} by ${site.rating.count} neighbors`} />
            <Reveal className="shrink-0">
              <Link href="/reviews" className="arrow-link text-sm font-semibold text-primary">
                Read all reviews
              </Link>
            </Reveal>
          </div>
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <RevealItem key={r.name}>
                <ReviewCard review={r} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== SERVICE AREAS ===== */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Service areas"
              title={`Serving ${site.region}`}
              lead={`Based in ${site.address.city}, with crews in every city on this list. Just outside the lines? Call us, we may already be on your street.`}
            />
            <Reveal delay={0.1} className="mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href="/service-areas" className="arrow-link">
                  Explore service areas
                </Link>
              </Button>
            </Reveal>
          </div>
          <RevealGroup className="grid gap-3 sm:grid-cols-2">
            {cities.map((c) => (
              <RevealItem key={c.slug}>
                <CityCard city={c} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-card py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div>
            <SectionHeading eyebrow="FAQ" title="Things people ask before they call" />
            <Reveal delay={0.1} className="mt-8 flex items-center gap-4">
              <Icon3D name="bulb" size={56} />
              <p className="text-muted-foreground">
                More questions?{" "}
                <Link href="/faq" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Read the full FAQ
                </Link>{" "}
                or <a href={phoneHref} className="font-semibold text-primary underline-offset-4 hover:underline nowrap">call us</a>.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <Faq items={featuredFaqs} />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
