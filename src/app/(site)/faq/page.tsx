import { buildMetadata, faqLd } from "@/lib/seo";
import { CtaBand, PageHero } from "@/components/site/page-parts";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { faqs, faqTopics } from "@/content/faqs";
import { site } from "@/config/site";

export const metadata = buildMetadata({
  title: "Lawn Care FAQ",
  description: `Answers about scheduling, pricing, products, and policies at ${site.name}.`,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd(faqs)} />
      <PageHero
        crumbs={[{ name: "FAQ", path: "/faq" }]}
        eyebrow="FAQ"
        title="Straight answers before you call"
        lead="The questions homeowners ask us most, answered the same way we would on the phone."
        icon="chat"
      />
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl space-y-14 px-4 sm:px-6 lg:px-8">
          {faqTopics.map((topic) => (
            <Reveal key={topic}>
              <h2 className="font-display text-2xl font-semibold">{topic}</h2>
              <Faq className="mt-5" items={faqs.filter((f) => f.topic === topic)} />
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand title="Still have a question?" lead="Call or text and a real person will answer. Or get your price online in under a minute." />
    </>
  );
}
