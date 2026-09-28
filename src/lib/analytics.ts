// Thin wrapper over whichever analytics script is configured in
// src/config/site.ts (GA4 and/or Plausible). A no-op when neither is set.

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, props);
    window.plausible?.(event, { props });
  } catch {
    // Analytics must never break the page.
  }
}
