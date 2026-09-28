import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero, CtaBand } from "@/components/site/page-parts";
import { CityCard } from "@/components/site/cards";
import { ServiceMap } from "@/components/site/service-map";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { cities } from "@/content/cities";
import { site, phoneHref } from "@/config/site";

export const metadata = buildMetadata({
  title: "Service Areas",
  description: `Lawn care in ${cities.map((c) => c.name).join(", ")}, ${site.address.region}. Local crews based in ${site.address.city}.`,
  path: "/service-areas",
});

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Service Areas", path: "/service-areas" }]}
        eyebrow="Service areas"
        title={`Lawn care across ${site.region}`}
        lead={`Our shop is in ${site.address.city}, and every city below is on a weekly route. Short drives mean crews spend their time on your lawn, not in traffic.`}
        icon="map"
      >
        <Button asChild variant="cta" size="lg">
          <Link href="/quote" className="arrow-link">
            Check my address
          </Link>
        </Button>
      </PageHero>

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-8">
          <Reveal>
            <ServiceMap />
          </Reveal>
          <div>
            <RevealGroup className="grid gap-3">
              {cities.map((c) => (
                <RevealItem key={c.slug}>
                  <CityCard city={c} />
                </RevealItem>
              ))}
            </RevealGroup>
            <p className="mt-6 text-muted-foreground">
              Just outside these cities?{" "}
              <a href={phoneHref} className="font-semibold text-primary underline-offset-4 hover:underline">
                Give us a call
              </a>
              . We add streets as routes grow.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
