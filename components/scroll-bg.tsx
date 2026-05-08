"use client";

import { cn } from "@lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /**
   * Hex colour stops the section interpolates between as the user
   * scrolls — distributed evenly across the section's full range.
   * Pass at least two stops; three to seven reads as a natural wave.
   */
  colors: string[];
};

/**
 * Section wrapper whose background colour shifts as the user scrolls
 * through it — mapped to `scrollYProgress` over the section's full
 * range. Used on /history (warm wave through milestones) and /menu
 * (subtle warm-cool wave under the menu list). Each consumer passes
 * its own palette via `colors`.
 */
export function ScrollBg({ children, className, colors }: Props) {
  const ref = useRef<HTMLElement>(null);
  // ["start end", "end start"] spans `section_height + viewport_height`
  // — always positive even for sections shorter than the viewport.
  // The previous ["start start", "end end"] offset produces a negative
  // scroll range when the section fits in one viewport, causing
  // scrollYProgress to flash between 0 and 1 over a few pixels.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const stops = colors.map((_, i) => i / Math.max(colors.length - 1, 1));
  const backgroundColor = useTransform(scrollYProgress, stops, colors);

  return (
    <motion.section
      ref={ref}
      className={cn("relative", className)}
      style={{ backgroundColor }}
    >
      {children}
    </motion.section>
  );
}
