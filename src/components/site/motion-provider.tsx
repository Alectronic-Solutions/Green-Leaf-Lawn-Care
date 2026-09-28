"use client";

import { MotionConfig } from "framer-motion";
import { DURATION, EASE_SOFT } from "@/lib/motion";

// Every framer-motion animation defaults to the site curve, and honors the
// visitor's reduced-motion setting.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DURATION.ui, ease: EASE_SOFT }}>
      {children}
    </MotionConfig>
  );
}
