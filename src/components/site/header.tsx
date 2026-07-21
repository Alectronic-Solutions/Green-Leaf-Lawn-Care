"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/site/logo-mark";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Reviews", href: "#reviews" },
  { label: "Service Areas", href: "#areas" },
  { label: "FAQ", href: "#faq" },
];

const PHONE = "(763) 555-0142";
const PHONE_HREF = "tel:+17635550142";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 z-50 w-full text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)] transition-all duration-300",
          "border-b border-white/10 bg-emerald-950/60 backdrop-blur-xl",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_32px_-8px_rgba(0,0,0,0.35)]"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-white/0 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent"
        />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <LogoMark className="h-9 w-9" />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-tight text-white">
              Green Leaf
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
              Lawn Care
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={PHONE_HREF}
            className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/80"
          >
            <Phone className="h-4 w-4 text-primary-foreground" />
            {PHONE}
          </a>
          <Button asChild size="sm" className="rounded-full">
            <a href="#quote">Get a quote</a>
          </Button>
        </div>

        <button
          aria-label="Open menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white lg:hidden hover:bg-white/10"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-background shadow-2xl flex flex-col">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <LogoMark className="h-8 w-8" />
                <span className="font-bold">Green Leaf</span>
              </Link>
              <button
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-accent"
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
    </>
  );
}
