import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata, articleLd } from "@/lib/seo";
import { Breadcrumbs, CtaBand } from "@/components/site/page-parts";
import { JsonLd } from "@/components/site/json-ld";
import { Icon3D } from "@/components/site/icon-3d";
import { Reveal } from "@/components/site/reveal";
import { formatPostDate, getPost, getPosts } from "@/lib/blog";
import { site } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}`, image: post.image, type: "article" });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const more = getPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <JsonLd data={articleLd(post)} />
      <article>
        <header className="relative overflow-hidden border-b border-border/70 bg-linear-to-b from-sage-50 to-cream pb-12 pt-28 lg:pt-36">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { name: "Lawn Care Tips", path: "/blog" },
                { name: post.title, path: `/blog/${post.slug}` },
              ]}
            />
            <Icon3D name={post.icon} size={72} className="mt-8" />
            <h1 className="font-display mt-4 text-4xl font-semibold leading-[1.08] sm:text-5xl">{post.title}</h1>
            <p className="measure mt-4 text-lg leading-relaxed text-muted-foreground">{post.description}</p>
            <p className="mt-5 text-sm text-muted-foreground">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readingMinutes} min read · By the {site.shortName} crew
            </p>
          </div>
        </header>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Reveal className="relative mb-10 aspect-16/9 overflow-hidden rounded-3xl shadow-lift">
            <Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </Reveal>
          <div className="prose-site" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </article>

      {more.length > 0 && (
        <section className="bg-card py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold">Keep reading</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {more.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group lift flex items-start gap-4 rounded-3xl border border-border bg-cream p-5 hover:border-primary/30">
                  <Icon3D name={p.icon} size={44} float />
                  <span>
                    <span className="block font-semibold leading-snug">{p.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{p.readingMinutes} min read</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
