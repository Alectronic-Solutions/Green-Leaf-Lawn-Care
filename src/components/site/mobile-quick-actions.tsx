"use client";

import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const PHONE_HREF = "tel:+17635550142";
const SMS_HREF = "sms:+17635550142";

const actions = [
  { label: "Call", href: PHONE_HREF, icon: Phone },
  { label: "Text", href: SMS_HREF, icon: MessageCircle },
  { label: "Quote", href: "#quote", icon: CalendarCheck, primary: true },
] as const;

export function MobileQuickActions() {
  return (
    <nav
      aria-label="Quick actions"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border/80",
        "bg-background/95 backdrop-blur-lg shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)]",
        "pb-[env(safe-area-inset-bottom)] lg:hidden"
      )}
    >
      {actions.map(({ label, href, icon: Icon, ...rest }) => (
        <a
          key={label}
          href={href}
          {...("external" in rest && rest.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition-colors",
            "primary" in rest && rest.primary
              ? "bg-primary text-primary-foreground"
              : "text-foreground/80 active:bg-accent"
          )}
        >
          <Icon className="h-5 w-5" />
          {label}
        </a>
      ))}
    </nav>
  );
}
