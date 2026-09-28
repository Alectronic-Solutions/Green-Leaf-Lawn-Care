import Link from "next/link";
import { LogoMark } from "@/components/site/logo-mark";
import { Icon3D } from "@/components/site/icon-3d";
import { Button } from "@/components/ui/button";
import { site, phoneHref, mailHref } from "@/config/site";
import { footerNav } from "@/config/nav";
import { services } from "@/content/services";
import { cities } from "@/content/cities";

const linkClass = "text-cream/70 transition-colors hover:text-cream";

export function SiteFooter() {
  return (
    <footer className="grain on-dark mt-auto bg-ink pb-24 text-ink-foreground lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link href="/" className="flex w-fit items-center gap-2.5">
              <LogoMark className="h-10 w-10" />
              <span className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight">{site.shortName}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-moss-300">Lawn Care</span>
              </span>
            </Link>
            <p className="measure-narrow mt-5 text-sm leading-relaxed text-cream/70">
              Family-owned residential lawn care serving {site.region} since{" "}
              {site.foundedYear}.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Icon3D name="pin" size={22} />
                <span className="text-cream/80">
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.region} {site.address.postalCode}
                </span>
              </li>
              <li>
                <a href={phoneHref} className="group flex items-center gap-3 font-semibold text-cream">
                  <Icon3D name="phone" size={22} float />
                  <span className="nowrap">{site.phone.display}</span>
                </a>
              </li>
              <li>
                <a href={mailHref} className="group flex items-center gap-3 text-cream/80 transition-colors hover:text-cream">
                  <Icon3D name="envelope" size={22} float />
                  {site.email}
                </a>
              </li>
            </ul>
            <Button asChild variant="cta" className="mt-7">
              <Link href="/quote">Get a free quote</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-moss-300">Services</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className={linkClass}>
                      {s.short.charAt(0).toUpperCase() + s.short.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-moss-300">Service areas</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/service-areas/${c.slug}`} className={linkClass}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-moss-300">Company</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {footerNav.company.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-moss-300">Hours</h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                {site.hours.map((h) => (
                  <div key={h.days}>
                    <dt className="text-cream/60">{h.days}</dt>
                    <dd className="font-medium text-cream nowrap">{h.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/10 py-7 text-sm text-cream/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. <span className="nowrap">{site.license}.</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerNav.legal.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-cream">
                {l.label}
              </Link>
            ))}
            <a href={site.builtBy.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">
              Site by {site.builtBy.name}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
