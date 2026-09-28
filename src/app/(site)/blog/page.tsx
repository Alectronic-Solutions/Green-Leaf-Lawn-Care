import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { CtaBand, PageHero } from "@/components/site/page-parts";
import { Icon3D } from "@/components/site/icon-3d";
import { RevealGroup, RevealItem } from "@/components/site/reveal";
import { formatPostDate, getPosts } from "@/lib/blog";
import { site } from "@/config/site";

export const metadata = buildMetadata({
  title: "Lawn Care Tips",
  description: `Practical lawn care advice for Minnesota homeowners from the crews at ${site.name}.`,
  path: "/blog",
});

export default function BlogPage() {
  const posts = getPosts();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Lawn Care Tips", path: "/blog" }]}
        eyebrow="Lawn care tips"
        title="Advice from the crew"
        lead="What we have learned from mowing, feeding and seeding thousands of Minnesota lawns. No sales pitch, just what works here."
        icon="books"
      />
      <section className="py-16 lg:py-24">
        <RevealGroup className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {posts.map((p) => (
            <RevealItem key={p.slug} as="article">
              <Link href={`/blog/${p.slug}`} className="group lift flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft hover:border-primary/30">
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-(--dur-reveal) group-hover:scale-[1.04]" />
                </div>
                <div className="relative flex flex-1 flex-col p-6 pt-9">
                  <Icon3D name={p.icon} size={56} float className="absolute -top-8 left-5" />
                  <p className="text-xs font-medium text-muted-foreground">
                    <time dateTime={p.date}>{formatPostDate(p.date)}</time> · {p.readingMinutes} min read
                  </p>
                  <h2 className="mt-2 text-xl font-semibold leading-snug">{p.title}</h2>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{p.description}</p>
                  <span className="arrow-link mt-5 text-sm font-semibold text-primary">Read the guide</span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
      <CtaBand />
    </>
  );
}
