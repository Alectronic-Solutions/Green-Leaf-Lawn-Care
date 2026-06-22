import Link from "next/link";
import { Leaf, ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const PHONE = "(763) 555-0142";
const PHONE_HREF = "tel:+17635550142";

export function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  children,
}: {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
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
          <Button asChild size="sm" variant="ghost" className="gap-2 text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <div className="border-b border-border bg-card/40">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Legal
            </p>
            <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p]:mb-4 [&_ul]:text-[15px] [&_ul]:text-muted-foreground [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:leading-relaxed [&_a]:text-primary [&_a]:font-medium [&_a]:underline-offset-2 [&_a]:hover:underline">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                1482 Oak Ridge Avenue, Maple Grove, MN 55369
              </p>
              <a
                href={PHONE_HREF}
                className="flex items-center gap-2 font-semibold text-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4 text-primary" />
                {PHONE}
              </a>
              <a
                href="mailto:hello@greenleaflawncare.com"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Mail className="h-4 w-4 text-primary" />
                hello@greenleaflawncare.com
              </a>
            </div>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:text-right">
              <p>© {new Date().getFullYear()} Green Leaf Lawn Care, LLC.</p>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-primary hover:underline underline-offset-2">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-primary hover:underline underline-offset-2">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
