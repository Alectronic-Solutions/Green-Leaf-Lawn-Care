"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Thin reading-progress bar along the top edge. Driven by a motion value,
// so scrolling never re-renders React.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.75 origin-left bg-linear-to-r from-forest-500 via-moss-300 to-wheat-400"
      style={{ scaleX }}
    />
  );
}
