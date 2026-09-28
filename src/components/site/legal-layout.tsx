import { PageHero } from "@/components/site/page-parts";

export function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  path,
  children,
}: {
  title: string;
  subtitle: string;
  lastUpdated: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero crumbs={[{ name: title, path }]} eyebrow={`Last updated ${lastUpdated}`} title={title} lead={subtitle} icon="clipboard" />
      <section className="py-14 lg:py-20">
        <div className="prose-site mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">{children}</div>
      </section>
    </>
  );
}
