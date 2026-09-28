import { buildMetadata } from "@/lib/seo";
import { CtaBand, PageHero, Stars } from "@/components/site/page-parts";
import { ReviewBrowser } from "@/components/site/review-browser";
import { GoogleGIcon } from "@/components/site/google-icon";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";

export const metadata = buildMetadata({
  title: "Customer Reviews",
  description: `${site.name} is rated ${site.rating.value} stars across ${site.rating.count} Google reviews from homeowners in ${site.region}.`,
  path: "/reviews",
});

const breakdown = [
  { stars: 5, pct: 92 },
  { stars: 4, pct: 6 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Reviews", path: "/reviews" }]}
        eyebrow="Reviews"
        title={`Rated ${site.rating.value} by ${site.rating.count} neighbors`}
        lead="Unedited reviews from homeowners across the metro. The good ones, and the ones that told us what to fix."
        aside={
          <div className="hidden rounded-3xl border border-border bg-card p-7 shadow-soft lg:block">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper shadow-soft">
                <GoogleGIcon className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-4xl font-semibold tabular-nums">{site.rating.value}</span>
                  <Stars size={18} />
                </div>
                <p className="text-sm text-muted-foreground">{site.rating.count} reviews on Google</p>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {breakdown.map((r) => (
                <div key={r.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-3 font-semibold tabular-nums">{r.stars}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sage-100">
                    <div className="h-full rounded-full bg-wheat-500" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="w-8 text-right tabular-nums text-muted-foreground">{r.pct}%</span>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-6 w-full">
              <a href={site.social.google} target="_blank" rel="noopener noreferrer">
                Leave us a review
              </a>
            </Button>
          </div>
        }
      />
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ReviewBrowser />
        </div>
      </section>
      <CtaBand title="Want to be our next five-star review?" />
    </>
  );
}
