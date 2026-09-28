"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/site/logo-mark";
import { Icon3D } from "@/components/site/icon-3d";
import { mainNav } from "@/config/nav";
import { site, phoneHref } from "@/config/site";
import { services, formatFrom } from "@/content/services";
import { track } from "@/lib/analytics";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ServicesMenu({ overHero, active }: { overHero: boolean; active: boolean }) {
  return (
    <div className="group/menu relative">
      <Link
        href="/services"
        className={cn(
          "flex items-center gap-1.5 py-2 text-sm font-medium transition-colors",
          overHero ? "text-cream/85 hover:text-cream" : "text-foreground/75 hover:text-foreground",
          active && (overHero ? "text-cream" : "text-foreground")
        )}
      >
        Services
        <span aria-hidden className="caret size-1.5 group-hover/menu:[transform:translateY(25%)_rotate(-135deg)] group-focus-within/menu:[transform:translateY(25%)_rotate(-135deg)]" />
      </Link>
      {/* Invisible bridge keeps the menu open while the pointer crosses the gap. */}
      <div className="pointer-events-none invisible absolute left-1/2 top-full w-136 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-[opacity,transform,visibility] duration-(--dur-ui) group-hover/menu:pointer-events-auto group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-focus-within/menu:pointer-events-auto group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:opacity-100">
        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-2 text-foreground shadow-lift text-shadow-none">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-sage-50"
            >
              <Icon3D name={s.icon} size={36} float />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{s.name}</span>
                <span className="block text-xs text-muted-foreground">From {formatFrom(s)}</span>
              </span>
            </Link>
          ))}
          <Link
            href="/services"
            className="arrow-link col-span-2 mt-1 justify-center rounded-xl bg-sage-50 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-sage-100"
          >
            See the seasonal service calendar
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  // The menu remembers which page it was opened on, so navigating away
  // closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean) => setOpenOn(next ? pathname : null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent with light text only while sitting over the homepage hero.
  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,color] duration-(--dur-ui)",
        overHero
          ? "border-b border-transparent text-cream text-shadow-sm"
          : "border-b border-border/70 bg-cream/85 text-foreground shadow-soft backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-18 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9" />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-tight">{site.shortName}</span>
            <span className={cn("text-[10px] font-semibold uppercase tracking-[0.2em]", overHero ? "text-cream/80" : "text-primary")}>
              Lawn Care
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          <ServicesMenu overHero={overHero} active={isActive(pathname, "/services")} />
          {mainNav.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                "relative py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-(--dur-ui) hover:after:scale-x-100 aria-[current=page]:after:scale-x-100",
                overHero ? "text-cream/85 hover:text-cream" : "text-foreground/75 hover:text-foreground aria-[current=page]:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={phoneHref}
            onClick={() => track("call_click", { location: "header" })}
            className="group flex items-center gap-2 text-sm font-semibold nowrap"
          >
            <Icon3D name="phone" size={22} float />
            {site.phone.display}
          </a>
          <Button asChild variant="cta" size="sm">
            <Link href="/quote">Get a quote</Link>
          </Button>
        </div>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-foreground/5 lg:hidden"
            >
              <span className="burger" data-open={open}>
                <span />
                <span />
                <span />
              </span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-80 bg-forest-950/35 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
            <Dialog.Content
              className="fixed inset-y-0 right-0 z-90 flex w-[86%] max-w-sm flex-col bg-cream shadow-lift duration-(--dur-ui) ease-soft data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <Dialog.Title className="flex items-center gap-2 font-bold">
                  <LogoMark className="h-8 w-8" />
                  {site.shortName}
                </Dialog.Title>
                <Dialog.Close
                  aria-label="Close menu"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-sage-100"
                >
                  <span className="close-mark" />
                </Dialog.Close>
              </div>
              <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-3">
                {[{ label: "Home", href: "/", icon: "leaf" as const }, ...mainNav, { label: "FAQ", href: "/faq", icon: "chat" as const }, { label: "Contact", href: "/contact", icon: "envelope" as const }].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className="group flex items-center gap-3.5 rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-sage-100 aria-[current=page]:bg-sage-100"
                  >
                    <Icon3D name={link.icon} size={28} float />
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="space-y-2.5 border-t border-border p-4">
                <Button asChild variant="cta" size="lg" className="w-full">
                  <Link href="/quote">Get a free quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href={phoneHref} onClick={() => track("call_click", { location: "menu" })}>
                    <Icon3D name="phone" size={20} />
                    Call {site.phone.display}
                  </a>
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
