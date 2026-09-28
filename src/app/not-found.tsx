import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/site-footer";
import { Icon3D } from "@/components/site/icon-3d";
import { Button } from "@/components/ui/button";
import { MotionProvider } from "@/components/site/motion-provider";
import { LeafTrail } from "@/components/site/leaf-trail";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <MotionProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          <section className="relative overflow-hidden bg-linear-to-b from-sage-50 to-cream px-4 pb-24 pt-32 text-center sm:px-6 lg:pt-40">
            <div aria-hidden className="stripes absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <div className="relative mx-auto max-w-2xl">
              <div className="flex items-end justify-center gap-2">
                <Icon3D name="tractor" size={96} />
                <Icon3D name="fallen-leaf" size={44} className="rotate-12" />
              </div>
              <p className="eyebrow mt-6">Error 404</p>
              <h1 className="font-display mt-3 text-4xl font-semibold leading-tight sm:text-5xl">This patch of lawn does not exist</h1>
              <p className="measure mx-auto mt-4 text-lg leading-relaxed text-muted-foreground">
                The page may have moved, or the link was mowed over. Try one of these instead.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild variant="cta" size="lg">
                  <Link href="/quote" className="arrow-link">
                    Get a free quote
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
              <ul className="mx-auto mt-12 grid max-w-xl gap-2 text-left sm:grid-cols-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 font-medium shadow-soft transition-colors hover:border-primary/30">
                      <Icon3D name={s.icon} size={28} float />
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
      <LeafTrail />
    </MotionProvider>
  );
}
