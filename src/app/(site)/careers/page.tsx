import { buildMetadata } from "@/lib/seo";
import { PageHero, SectionHeading, IconList } from "@/components/site/page-parts";
import { ContactForm } from "@/components/site/contact-form";
import { Icon3D, type Icon3DName } from "@/components/site/icon-3d";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { site } from "@/config/site";

export const metadata = buildMetadata({
  title: "Careers",
  description: `Seasonal and year-round lawn care jobs at ${site.name} in ${site.address.city}, ${site.address.region}. Steady routes, weekly pay, and a crew that has your back.`,
  path: "/careers",
});

const roles: { title: string; type: string; pay: string; icon: Icon3DName; desc: string }[] = [
  { title: "Lawn care crew member", type: "Seasonal, April to November", pay: "$19 to $23 / hour", icon: "tractor", desc: "Mow, trim, edge and clean up on a steady weekly route. No experience needed. We train you." },
  { title: "Crew lead", type: "Full time", pay: "$24 to $29 / hour", icon: "medal", desc: "Run a two-person crew, own your route, and be the face customers know by name." },
  { title: "Licensed applicator", type: "Seasonal", pay: "$25 to $31 / hour", icon: "seedling", desc: "Handle fertilization and weed control. We pay for your Minnesota applicator license." },
  { title: "Snow plow operator", type: "Winter, on call", pay: "$28 / hour + storm bonus", icon: "snowflake", desc: "Clear driveways on overnight routes after two-inch snowfalls." },
];

const perks: { icon: Icon3DName; title: string }[] = [
  { icon: "money", title: "Weekly pay and overtime in peak season" },
  { icon: "calendar", title: "Predictable routes, home by dinner most days" },
  { icon: "tools", title: "Well-kept equipment and a truck that starts" },
  { icon: "trophy", title: "End-of-season bonus for every returning crew member" },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Careers", path: "/careers" }]}
        eyebrow="Careers"
        title="Work outside with a crew that shows up"
        lead={`We are hiring for the season in ${site.address.city}. Steady routes, weekly pay, and people who do the job right.`}
        icon="briefcase"
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Open roles" title="Now hiring" />
          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2">
            {roles.map((r) => (
              <RevealItem key={r.title} className="group lift flex gap-5 rounded-3xl border border-border bg-card p-7 shadow-soft">
                <Icon3D name={r.icon} size={56} float />
                <div>
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.type} · <span className="font-semibold text-forest-800 nowrap">{r.pay}</span>
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-cream-deep py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <SectionHeading eyebrow="Why work here" title="Good work, fair pay, real people" />
            <Reveal delay={0.1} className="mt-8 space-y-4">
              {perks.map((p) => (
                <div key={p.title} className="flex items-center gap-4">
                  <Icon3D name={p.icon} size={40} />
                  <span className="text-lg">{p.title}</span>
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.15}>
              <IconList
                icon="leaf"
                className="mt-10 text-muted-foreground"
                items={["Must be 18 or older", "Valid driver's license for crew lead and plow roles", "Reliable, on time, and good with customers"]}
              />
            </Reveal>
          </div>
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">Apply in two minutes</h2>
            <p className="mt-2 text-muted-foreground">No resume needed. Tell us a little about yourself and we will call you.</p>
            <div className="mt-6">
              <ContactForm kind="careers" cta="Send my application" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
