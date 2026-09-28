import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { CtaBand, PageHero } from "@/components/site/page-parts";
import { BeforeAfterSlider } from "@/components/site/before-after-slider";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { Icon3D } from "@/components/site/icon-3d";
import { gallery } from "@/content/company";
import { getCity } from "@/content/cities";
import { getService } from "@/content/services";
import { site } from "@/config/site";

export const metadata = buildMetadata({
  title: "Our Work",
  description: `Before and after photos of lawns we care for in ${site.region}.`,
  path: "/gallery",
});

function Tags({ city, services }: { city: string; services: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
      <Link href={`/service-areas/${city}`} className="flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-forest-800 transition-colors hover:bg-sage-200">
        <Icon3D name="pin" size={14} />
        {getCity(city)?.name}
      </Link>
      {services.map((s) => (
        <Link key={s} href={`/services/${s}`} className="rounded-full border border-border px-3 py-1 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
          {getService(s)?.name}
        </Link>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const [featured, ...rest] = gallery;
  return (
    <>
      <PageHero
        crumbs={[{ name: "Our Work", path: "/gallery" }]}
        eyebrow="Our work"
        title="Lawns we take care of"
        lead="Real properties on our routes. Drag the slider to compare before and after."
        icon="camera"
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {featured.before && (
            <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
              <Reveal>
                <BeforeAfterSlider before={featured.before} after={featured.after} alt={featured.alt} />
              </Reveal>
              <Reveal delay={0.1}>
                <Tags city={featured.city} services={featured.services} />
                <h2 className="font-display mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{featured.title}</h2>
                <p className="measure mt-4 text-lg leading-relaxed text-muted-foreground">{featured.summary}</p>
              </Reveal>
            </div>
          )}

          <RevealGroup className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((g) => (
              <RevealItem key={g.title} as="article" className="group lift overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image src={g.after} alt={g.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-(--dur-reveal) group-hover:scale-[1.04]" />
                </div>
                <div className="p-6">
                  <Tags city={g.city} services={g.services} />
                  <h2 className="mt-4 text-lg font-semibold">{g.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{g.summary}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <CtaBand title="Want your lawn in the next photo?" />
    </>
  );
}
