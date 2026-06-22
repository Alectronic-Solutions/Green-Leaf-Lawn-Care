"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Why Green Leaf", href: "#why-us" },
  { label: "Reviews", href: "#reviews" },
  { label: "Service Areas", href: "#areas" },
  { label: "FAQ", href: "#faq" },
];

const PHONE = "(763) 555-0142";
const PHONE_HREF = "tel:+17635550142";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#top" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-tight text-foreground">
              Green Leaf
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Lawn Care
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={PHONE_HREF}
            className="flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4 text-primary" />
            {PHONE}
          </a>
          <Button asChild size="sm" className="rounded-full">
            <a href="#quote">Get a quote</a>
          </Button>
        </div>

        <button
          aria-label="Open menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden hover:bg-accent"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-background shadow-2xl flex flex-col">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Leaf className="h-4 w-4" />
                </span>
                <span className="font-bold">Green Leaf</span>
              </span>
              <button
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-accent"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto space-y-3 border-t border-border p-4">
              <Button asChild className="w-full rounded-full">
                <a href={PHONE_HREF}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call {PHONE}
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full">
                <a href="#quote" onClick={() => setOpen(false)}>
                  Get a quote
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
