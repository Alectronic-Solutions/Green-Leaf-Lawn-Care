"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __glNavigated?: boolean;
  }
}

// Fades each page in on client-side navigation. The very first page load
// is not animated, so the hero paints immediately.
export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => typeof window !== "undefined" && !!window.__glNavigated);
  useEffect(() => {
    window.__glNavigated = true;
  }, []);
  return <div className={animate ? "page-in" : undefined}>{children}</div>;
}
