import { buildMetadata } from "@/lib/seo";
import { PageHero, SectionHeading, CtaBand } from "@/components/site/page-parts";
import { ServiceCard } from "@/components/site/cards";
import { SeasonalServices } from "@/components/site/seasonal-services";
import { RevealGroup, RevealItem, Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { services } from "@/content/services";
import { site } from "@/config/site";

export const metadata = buildMetadata({
  title: "Lawn Care Services",
  description: `Mowing, fertilization, aeration, leaf removal, spring cleanup and snow removal in ${site.address.city} and ${site.region}. See starting prices and the seasonal calendar.`,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Services"
        title="Lawn care for every season"
        lead={`Six services, one local crew, and upfront pricing on all of them. Pick what you need or let us plan the whole year for your lawn in ${site.region}.`}
        icon="seedling"
      >
        <Button asChild variant="cta" size="lg">
          <Link href="/quote" className="arrow-link">
            Get a free quote
          </Link>
        </Button>
      </PageHero>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealGroup className="grid gap-x-6 gap-y-12 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <RevealItem key={s.slug}>
                <ServiceCard service={s} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-cream-deep py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Seasonal calendar"
            title="What your lawn needs, when it needs it"
            lead="Minnesota turf has a short growing window. This is the calendar our crews follow for most lawns in the metro."
          />
          <Reveal className="mt-12">
            <SeasonalServices />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
