import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon3D } from "@/components/site/icon-3d";
import { JsonLd } from "@/components/site/json-ld";
import { ServiceMap } from "@/components/site/service-map";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { CtaBand, PageHero, SectionHeading } from "@/components/site/page-parts";
import { CityCard, ReviewCard, ServiceCard } from "@/components/site/cards";
import { buildMetadata } from "@/lib/seo";
import { cities, getCity } from "@/content/cities";
import { services } from "@/content/services";
import { reviews } from "@/content/reviews";
import { site, phoneHref, absoluteUrl } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  return buildMetadata({
    title: `Lawn Care in ${city.name}, ${site.address.region}`,
    description: `Lawn mowing, fertilization, aeration and seasonal cleanup in ${city.name}, ${site.address.region} (${city.zips.join(", ")}). Local crews, upfront pricing, same crew every visit.`,
    path: `/service-areas/${city.slug}`,
  });
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const local = reviews.filter((r) => r.city === city.slug);
  const shown = (local.length ? local : reviews).slice(0, 3);
  const nearby = city.nearby.map(getCity).filter((c) => !!c);

  const cityLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Lawn care in ${city.name}, ${site.address.region}`,
    serviceType: "Residential lawn care",
    provider: { "@id": `${site.url}/#business` },
    areaServed: {
      "@type": "City",
      name: `${city.name}, ${site.address.region}`,
      containedInPlace: { "@type": "AdministrativeArea", name: city.county },
    },
    url: absoluteUrl(`/service-areas/${city.slug}`),
  };

  return (
    <>
      <JsonLd data={cityLd} />
      <PageHero
        crumbs={[
          { name: "Service Areas", path: "/service-areas" },
          { name: city.name, path: `/service-areas/${city.slug}` },
        ]}
        eyebrow={`${city.county} · ${city.zips.join(", ")}`}
        title={`Lawn care in ${city.name}, ${site.address.region}`}
        lead={city.home ? `${site.name} is based right here in ${city.name}.` : `Weekly routes through ${city.name}, from our shop in ${site.address.city}.`}
        icon={city.home ? "house" : "pin"}
      >
        <Button asChild variant="cta" size="lg">
          <Link href="/quote" className="arrow-link">
            Get a {city.name} quote
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={phoneHref} className="group">
            <Icon3D name="phone" size={20} float />
            <span className="nowrap">{site.phone.display}</span>
          </a>
        </Button>
      </PageHero>

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">Lawns in {city.name}</h2>
            <div className="mt-5 space-y-5 text-lg leading-relaxed text-muted-foreground">
              {city.local.map((p) => (
                <p key={p} className="measure">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <Icon3D name="pin" size={36} />
                <h3 className="font-semibold">Neighborhoods we mow every week</h3>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {city.neighborhoods.map((n) => (
                  <li key={n} className="rounded-full bg-sage-100 px-3.5 py-1.5 text-sm font-medium text-forest-800">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ServiceMap active={city.slug} />
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-deep py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Services" title={`Lawn care services in ${city.name}`} />
          <RevealGroup className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <RevealItem key={s.slug}>
                <ServiceCard service={s} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Reviews" title={local.length ? `What ${city.name} customers say` : "What our customers say"} />
          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3">
            {shown.map((r) => (
              <RevealItem key={r.name}>
                <ReviewCard review={r} />
              </RevealItem>
            ))}
          </RevealGroup>

          <SectionHeading eyebrow="Nearby" title="We also serve" className="mt-20" />
          <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {nearby.map((c) => (
              <RevealItem key={c.slug}>
                <CityCard city={c} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand title={`Ready for a better lawn in ${city.name}?`} />
    </>
  );
}
