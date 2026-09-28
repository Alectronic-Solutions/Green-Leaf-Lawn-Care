import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon3D } from "@/components/site/icon-3d";
import { JsonLd } from "@/components/site/json-ld";
import { Faq } from "@/components/site/faq";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { CtaBand, IconList, PageHero, SectionHeading } from "@/components/site/page-parts";
import { CityCard, ReviewCard, ServiceCard } from "@/components/site/cards";
import { buildMetadata, faqLd, serviceLd } from "@/lib/seo";
import { services, getService, formatFrom, unitLabel } from "@/content/services";
import { cities } from "@/content/cities";
import { reviews } from "@/content/reviews";
import { site, phoneHref } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return buildMetadata({
    title: `${s.name} in ${site.address.city}, ${site.address.region}`,
    description: `${s.summary} Serving ${site.address.city} and ${site.region}. From ${formatFrom(s).replace(" ", " ")}.`,
    path: `/services/${s.slug}`,
    image: s.image,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.related.map(getService).filter((s) => !!s);
  const serviceReviews = reviews.filter((r) => r.service === service.slug).slice(0, 2);

  return (
    <>
      <JsonLd data={[serviceLd(service), faqLd(service.faqs)]} />
      <PageHero
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        eyebrow={`From ${formatFrom(service)}`}
        title={service.name}
        lead={service.summary}
        aside={
          <div className="relative hidden aspect-4/3 overflow-hidden rounded-3xl shadow-lift lg:block">
            <Image src={service.image} alt={service.imageAlt} fill priority sizes="40vw" className="object-cover" />
            <Icon3D name={service.icon} size={96} className="absolute -bottom-2 -left-2 rotate-[-8deg]" />
          </div>
        }
      >
        <Button asChild variant="cta" size="lg">
          <Link href={`/quote?service=${service.slug}`} className="arrow-link">
            Price my lawn
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={phoneHref} className="group">
            <Icon3D name="phone" size={20} float />
            <span className="nowrap">{site.phone.display}</span>
          </a>
        </Button>
      </PageHero>

      {/* Intro + what's included */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:px-8">
          <Reveal className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              How we handle {service.short.toLowerCase()} in {site.region}
            </h2>
            {service.intro.map((p) => (
              <p key={p} className="measure">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-9">
            <div className="flex items-center gap-3">
              <Icon3D name="clipboard" size={44} />
              <h2 className="text-xl font-semibold">What is included</h2>
            </div>
            <IconList className="mt-6 text-[15px]" items={service.included} />
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-cream-deep py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="The process" title="What to expect" />
          <RevealGroup as="ol" className="mt-12 grid gap-5 md:grid-cols-3">
            {service.process.map((step, i) => (
              <RevealItem as="li" key={step.title} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
                <span className="font-display text-4xl font-semibold text-forest-500">{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{step.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <Reveal className="grain on-dark rounded-3xl bg-ink p-8 text-ink-foreground shadow-lift sm:p-10">
            <div className="flex items-center gap-4">
              <Icon3D name="money" size={56} />
              <div>
                <p className="text-sm text-cream/70">Starting at</p>
                <p className="font-display flex flex-wrap items-baseline gap-x-2">
                  <span className="text-5xl font-semibold">${service.price.from}</span>
                  <span className="text-xl text-cream/75">{unitLabel[service.price.unit]}</span>
                </p>
              </div>
            </div>
            <p className="measure-narrow mt-6 leading-relaxed text-cream/80">
              Most lawns land close to the starting price. Your exact number is confirmed on site before the first visit,
              never on the invoice.
            </p>
            <Button asChild variant="cta" size="lg" className="mt-7">
              <Link href={`/quote?service=${service.slug}`} className="arrow-link">
                See my exact price
              </Link>
            </Button>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Pricing" title="What changes the price" />
            <Reveal delay={0.1}>
              <IconList icon="ruler" className="mt-7 text-base" items={service.pricingFactors} />
              <p className="measure mt-6 text-muted-foreground">
                New customers get {site.offers.firstVisitPct}% off their first visit, and there are never contracts or
                cancellation fees.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {serviceReviews.length > 0 && (
        <section className="bg-cream-deep py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Reviews" title={`What customers say about our ${service.short.toLowerCase()}`} />
            <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2">
              {serviceReviews.map((r) => (
                <RevealItem key={r.name}>
                  <ReviewCard review={r} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <SectionHeading eyebrow="Questions" title={`${service.name} FAQ`} />
          <Reveal>
            <Faq items={service.faqs} />
          </Reveal>
        </div>
      </section>

      {/* Areas + related */}
      <section className="bg-card py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Where we work" title={`${service.name} near you`} />
          <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <RevealItem key={c.slug}>
                <CityCard city={c} />
              </RevealItem>
            ))}
          </RevealGroup>

          <SectionHeading eyebrow="Pairs well with" title="Related services" className="mt-24" />
          <RevealGroup className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <RevealItem key={s.slug}>
                <ServiceCard service={s} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand service={service.slug} title={`Ready for better ${service.short.toLowerCase()}?`} />
    </>
  );
}
