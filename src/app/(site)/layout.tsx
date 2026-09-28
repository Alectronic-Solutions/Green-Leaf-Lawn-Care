import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/site-footer";
import { MobileQuickActions } from "@/components/site/mobile-quick-actions";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { LeafTrail } from "@/components/site/leaf-trail";
import { MotionProvider } from "@/components/site/motion-provider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <ScrollProgress />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
      <MobileQuickActions />
      <LeafTrail />
    </MotionProvider>
  );
}
