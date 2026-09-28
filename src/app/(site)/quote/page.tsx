import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-parts";
import { QuoteForm } from "@/components/site/quote-form";
import { Reveal } from "@/components/site/reveal";
import { Icon3D } from "@/components/site/icon-3d";
import { site } from "@/config/site";
import { steps } from "@/content/company";

export const metadata = buildMetadata({
  title: "Free Lawn Care Quote",
  description: `See your lawn care price in under a minute. Mowing, fertilization, aeration and cleanups in ${site.address.city} and ${site.region}. No obligation.`,
  path: "/quote",
});

export default function QuotePage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Free Quote", path: "/quote" }]}
        eyebrow="Instant estimate"
        title="See your price in under a minute"
        lead={`No waiting for a callback. Tell us about your lawn, see a typical price for ${site.address.city}, and we confirm it on site.`}
        aside={
          <ol className="hidden space-y-4 lg:block">
            {steps.map((s, i) => (
              <li key={s.title} className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 shadow-soft backdrop-blur-sm">
                <Icon3D name={s.icon} size={44} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step {i + 1}</p>
                  <p className="font-semibold">{s.title}</p>
                </div>
              </li>
            ))}
          </ol>
        }
      />
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
