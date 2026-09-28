import { cn } from "@/lib/utils";

// Scroll-driven reveals, pure CSS (see `.reveal` in globals.css). Content
// is always in the HTML and visible without JavaScript; in browsers that
// support scroll timelines it rises into place as it enters the viewport,
// tied to the scroll itself so the motion never lags or jumps. Anything
// already on screen at load paints immediately, which keeps LCP fast.

type Tag = "div" | "section" | "li" | "ul" | "ol" | "article" | "header";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Extra offset (seconds-ish, mapped to scroll distance) for staggering. */
  delay?: number;
  as?: Tag;
};

export function Reveal({ children, className, delay = 0, as: Tag = "div" }: Props) {
  return (
    <Tag className={cn("reveal", className)} style={delay ? ({ "--reveal-delay": `${Math.round(delay * 60)}%` } as React.CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}

/** Children marked with RevealItem stagger in one after another. */
export function RevealGroup({ children, className, as: Tag = "div" }: Props) {
  return <Tag className={cn("reveal-group", className)}>{children}</Tag>;
}

export function RevealItem({ children, className, as: Tag = "div" }: Props) {
  return <Tag className={cn("reveal", className)}>{children}</Tag>;
}
