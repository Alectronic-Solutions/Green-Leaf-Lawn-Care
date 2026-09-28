import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-parts";
import { ContactForm } from "@/components/site/contact-form";
import { Icon3D } from "@/components/site/icon-3d";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { site, phoneHref, smsHref, mailHref, addressLine } from "@/config/site";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: `Call, text or email ${site.name}. ${addressLine}. ${site.phone.display}.`,
  path: "/contact",
});

export default function ContactPage() {
  const mapQuery = encodeURIComponent(addressLine);
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title="Talk to a real person"
        lead="Call, text, or send a note. Our office answers during business hours and replies to messages within one business day."
        icon="chat"
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
          <div>
            <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {[
                { icon: "phone" as const, label: "Call", value: site.phone.display, href: phoneHref },
                { icon: "chat" as const, label: "Text", value: site.phone.display, href: smsHref },
                { icon: "envelope" as const, label: "Email", value: site.email, href: mailHref },
                { icon: "pin" as const, label: "Visit", value: addressLine, href: `https://maps.google.com/?q=${mapQuery}` },
              ].map((c) => (
                <RevealItem key={c.label}>
                  <a
                    href={c.href}
                    {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group lift flex h-full items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft hover:border-primary/30"
                  >
                    <Icon3D name={c.icon} size={44} float />
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</span>
                      <span className="block break-words font-semibold">{c.value}</span>
                    </span>
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <Icon3D name="clock" size={36} />
                <h2 className="font-semibold">Office hours</h2>
              </div>
              <dl className="mt-4 divide-y divide-border text-[15px]">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-muted-foreground">{h.days}</dt>
                    <dd className="font-medium nowrap">{h.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="mt-6 overflow-hidden rounded-3xl border border-border shadow-soft">
              <iframe
                title={`Map to ${site.name}`}
                src={`https://maps.google.com/maps?q=${mapQuery}&z=13&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block aspect-16/10 w-full border-0 grayscale-[0.3]"
              />
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl font-semibold">Send us a note</h2>
            <p className="mt-2 text-muted-foreground">
              Looking for a price? The <Link href="/quote" className="font-semibold text-primary underline-offset-4 hover:underline">instant quote</Link> is faster.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
