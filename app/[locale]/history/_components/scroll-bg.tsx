"use client";

import { cn } from "@lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

// Five colour stops the section interpolates between as the user
// scrolls. Reads as a warm wave through the timeline:
// cream → soft yellow → hot pink → soft yellow → cream.
const STOPS = [0, 0.25, 0.5, 0.75, 1];
const COLORS = [
  "#fff1f7", // pink-50    (cream — 1998)
  "#fee198", // yellow-100 (dimmed-led — early years)
  "#ff9bb6", // pink-300   (growth)
  "#fee198", // yellow-100 (covid pause)
  "#fff1f7", // pink-50    (current)
];

/**
 * Section wrapper whose background colour shifts as the user scrolls
 * through it — mapped to `scrollYProgress` over the section's full
 * range. Used on the history page so each milestone gets its own
 * subtle backdrop without separating into discrete sections.
 */
export function ScrollBg({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const backgroundColor = useTransform(scrollYProgress, STOPS, COLORS);

  return (
    <motion.section
      ref={ref}
      className={cn("relative isolate", className)}
      style={{ backgroundColor }}
    >
      {children}
    </motion.section>
  );
}
