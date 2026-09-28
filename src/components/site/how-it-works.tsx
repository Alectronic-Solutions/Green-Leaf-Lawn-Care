import Link from "next/link";
import { Icon3D } from "@/components/site/icon-3d";
import { RevealGroup, RevealItem } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/page-parts";
import { Button } from "@/components/ui/button";
import { steps } from "@/content/company";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="From quote to a maintained lawn in three steps"
        />
        <div className="relative mt-14">
          {/* A mowed path joining the three steps on wide screens. */}
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-14 hidden h-3 rounded-full bg-[repeating-linear-gradient(90deg,var(--sage-200)_0_18px,var(--sage-100)_18px_36px)] md:block"
          />
        <RevealGroup as="ol" className="relative grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <RevealItem as="li" key={s.title} className="group relative flex flex-col items-center text-center">
              <div className="relative flex h-28 w-28 items-center justify-center">
                <Icon3D name={s.icon} size={96} float />
                <span className="font-display absolute -right-1 -top-1 text-2xl font-semibold text-forest-500">{i + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
              <p className="measure-narrow mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="cta" size="lg">
            <Link href="/quote" className="arrow-link">
              Start with step one
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
