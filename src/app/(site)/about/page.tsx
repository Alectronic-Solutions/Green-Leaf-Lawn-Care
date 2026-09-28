import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { CtaBand, Monogram, PageHero, SectionHeading } from "@/components/site/page-parts";
import { WhyGreenLeaf } from "@/components/site/why-green-leaf";
import { Icon3D } from "@/components/site/icon-3d";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { team, values } from "@/content/company";
import { site } from "@/config/site";

export const metadata = buildMetadata({
  title: "About Us",
  description: `${site.name} is a family-owned lawn care company in ${site.address.city}, ${site.address.region}, serving ${site.region} since ${site.foundedYear}.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About us"
        title={`A ${site.address.city} company since ${site.foundedYear}`}
        lead="One truck, one push mower, and a promise to show up when we said we would. That promise is still the whole business plan."
        icon="house"
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <Reveal className="relative aspect-4/5 overflow-hidden rounded-3xl shadow-lift sm:aspect-4/3 lg:aspect-4/5">
            <Image src="/images/technician.webp" alt={`A ${site.shortName} crew member mowing a residential lawn`} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p className="eyebrow">Our story</p>
            <h2 className="font-display max-w-[18ch] text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Started on one street, still run like it
            </h2>
            <p className="measure">
              {site.shortName} started in {site.foundedYear} with a handful of lawns in {site.address.city}. Neighbors told
              neighbors, and the routes grew one street at a time. Today our crews care for more than {site.stats.lawns}{" "}
              lawns across {site.region}.
            </p>
            <p className="measure">
              We have grown, but the way we work has not changed. Every customer gets the same crew on the same day, a text
              when we are on the way, and an honest answer about what their lawn needs. Sometimes that answer is less than
              they expected to buy.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-card py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What we believe" title="Three rules every crew follows" />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <RevealItem key={v.title} className="rounded-3xl border border-border bg-cream p-7">
                <span className="font-display text-4xl font-semibold text-forest-500">{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{v.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="The team" title="The people on your lawn" lead="Small enough that the owner still answers the phone some days." />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <RevealItem key={m.name} className="group lift rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <Monogram name={m.name} className="h-14 w-14 text-lg" />
                  <Icon3D name={m.icon} size={40} float />
                </div>
                <h3 className="mt-5 font-semibold">{m.name}</h3>
                <p className="text-sm font-medium text-primary">{m.role}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{m.bio}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <WhyGreenLeaf />
      <CtaBand />
    </>
  );
}
