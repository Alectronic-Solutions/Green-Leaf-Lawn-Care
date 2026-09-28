import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon3D, type Icon3DName } from "@/components/site/icon-3d";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { breadcrumbLd } from "@/lib/seo";
import { site, phoneHref } from "@/config/site";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbLd(all)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-muted-foreground/50" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="transition-colors hover:text-primary">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Top of every inner page: breadcrumbs, title, lead, optional actions and icon. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  icon,
  children,
  aside,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  icon?: Icon3DName;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-linear-to-b from-sage-50 to-cream pt-28 pb-14 lg:pt-36 lg:pb-20">
      <div aria-hidden className="stripes absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:px-8">
        <div>
          <Breadcrumbs items={crumbs} />
          {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
          <h1 className={cn("font-display max-w-[20ch] text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl", eyebrow ? "mt-3" : "mt-8")}>
            {title}
          </h1>
          {lead && <p className="measure mt-5 text-lg leading-relaxed text-muted-foreground">{lead}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {aside ?? (icon && (
          <div className="hidden justify-end lg:flex">
            <Icon3D name={icon} size={180} className="rotate-[-6deg]" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={cn("font-display mt-3 max-w-[22ch] text-3xl font-semibold leading-[1.1] sm:text-4xl lg:text-[2.75rem]", align === "center" && "mx-auto")}>
        {title}
      </h2>
      {lead && (
        <p className={cn("measure mt-4 text-lg leading-relaxed text-muted-foreground", align === "center" && "mx-auto")}>
          {lead}
        </p>
      )}
    </Reveal>
  );
}

/** The closing call to action used at the bottom of most pages. */
export function CtaBand({
  title = "Ready to hand off the lawn?",
  lead = "Get a price in under a minute, or call and we will walk you through it.",
  service,
}: {
  title?: string;
  lead?: string;
  service?: string;
}) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="grain on-dark relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center text-ink-foreground shadow-lift sm:px-12 lg:py-20">
        <div aria-hidden className="absolute -left-10 -top-8 opacity-90">
          <Icon3D name="leaf" size={120} className="rotate-[-20deg]" />
        </div>
        <div aria-hidden className="absolute -bottom-6 -right-6 opacity-90">
          <Icon3D name="herb" size={140} className="rotate-12" />
        </div>
        <h2 className="font-display relative mx-auto max-w-[18ch] text-3xl font-semibold leading-[1.1] sm:text-5xl">{title}</h2>
        <p className="measure-narrow relative mx-auto mt-5 text-lg leading-relaxed text-cream/80">{lead}</p>
        <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="cta" size="lg">
            <Link href={service ? `/quote?service=${service}` : "/quote"} className="arrow-link">
              Get my free quote
            </Link>
          </Button>
          <Button asChild variant="glass" size="lg">
            <a href={phoneHref} className="group">
              <Icon3D name="phone" size={22} float />
              <span className="nowrap">{site.phone.display}</span>
            </a>
          </Button>
        </div>
        <p className="relative mt-8 text-sm text-cream/60">
          {site.hours
            .filter((h) => h.opens)
            .map((h) => `${h.days} ${h.label}`)
            .join(" · ")}{" "}
          · Free estimates · Licensed and insured
        </p>
      </Reveal>
    </section>
  );
}

export function Stars({ rating = 5, size = 16, className }: { rating?: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon3D key={i} name="star" size={size} className={i < rating ? "" : "opacity-25 grayscale"} />
      ))}
    </span>
  );
}

/** Round monogram used instead of stock-photo avatars. */
export function Monogram({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .replace(/[^A-Z]/gi, "")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        "font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sage-100 to-sage-200 text-sm font-semibold text-forest-800 ring-1 ring-inset ring-paper/60",
        className
      )}
    >
      {initials}
    </span>
  );
}

/** Numbered list replacement for check-mark lists. Uses a small 3D icon as the bullet. */
export function IconList({
  items,
  icon = "seedling",
  className,
  itemClassName,
}: {
  items: string[];
  icon?: Icon3DName;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <ul className={cn("space-y-3.5", className)}>
      {items.map((item) => (
        <li key={item} className={cn("flex items-start gap-3", itemClassName)}>
          <Icon3D name={icon} size={22} className="mt-0.5" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
