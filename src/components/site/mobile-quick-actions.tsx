"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon3D } from "@/components/site/icon-3d";
import { phoneHref, smsHref } from "@/config/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Sticky call / text / quote bar on phones, where those three actions are
// what almost every visitor wants.
export function MobileQuickActions() {
  const pathname = usePathname();
  if (pathname?.startsWith("/quote")) return null;

  const item = "group flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-colors";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border/80 bg-cream/95 pb-[env(safe-area-inset-bottom)] shadow-top backdrop-blur-lg lg:hidden"
    >
      <a href={phoneHref} onClick={() => track("call_click", { location: "quick_bar" })} className={cn(item, "text-foreground/80 active:bg-sage-100")}>
        <Icon3D name="phone" size={24} float />
        Call
      </a>
      <a href={smsHref} onClick={() => track("sms_click", { location: "quick_bar" })} className={cn(item, "text-foreground/80 active:bg-sage-100")}>
        <Icon3D name="chat" size={24} float />
        Text
      </a>
      <Link href="/quote" className={cn(item, "bg-cta text-cta-foreground active:bg-cta-hover")}>
        <Icon3D name="memo" size={24} float />
        Free quote
      </Link>
    </nav>
  );
}
