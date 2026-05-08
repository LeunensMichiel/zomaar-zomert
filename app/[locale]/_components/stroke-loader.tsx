"use client";

import { cn } from "@lib/utils";
import { motion, useReducedMotion } from "motion/react";

// Sub-paths split out from the `stroke` doodle so each chunk can be
// drawn (`pathLength: 0 → 1`) independently. Keeping the M point at
// the start of each chunk equal to the L endpoint of the previous
// chunk makes the four bursts read as one continuous scribble — but
// each one fires on its own beat. Four chunks → four "djoef"s.
const STROKE_PATHS = [
  "M63.2093 43.0917L137.51 40.5994L52.1302 111.359L232.573 41.2719",
  "M232.573 41.2719L46.9445 163.596L220.386 74.8238L23.2239 225.272",
  "M23.2239 225.272L425.018 16.0246L10.2916 303.448L325.238 140.553",
  "M325.238 140.553L157.491 258.867L269.449 247.26",
] as const;

/**
 * Loading state — the `stroke` doodle drawn by hand, four bursts
 * cycling on repeat ("djoef djoef djoef djoef"). Each chunk's
 * `pathLength` animates `0 → 1 → 1 → 0`: draw in fast, hold, erase,
 * repeat. The four chunks stagger their delays so the strokes appear
 * one after another and erase in the same order.
 *
 * Reduced-motion users get the static path with no animation.
 */
export function StrokeLoader({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 435.309 319.496"
      fill="none"
      className={cn("h-auto w-full", className)}
      aria-label="Loading"
      role="status"
    >
      <defs>
        <linearGradient
          id="stroke-loader-gradient"
          x1="333.494"
          y1="292.474"
          x2="298.472"
          y2="52.2879"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFB600" />
          <stop offset="1" stopColor="#FF7BAC" />
        </linearGradient>
      </defs>
      {STROKE_PATHS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="url(#stroke-loader-gradient)"
          strokeWidth="36.1349"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: reducedMotion ? 1 : 0 }}
          animate={
            reducedMotion ? { pathLength: 1 } : { pathLength: [0, 1, 1, 0] }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: 1.5,
                  times: [0, 0.3, 0.55, 0.85],
                  repeat: Infinity,
                  repeatDelay: 0.3,
                  delay: i * 0.15,
                  ease: "easeOut",
                }
          }
        />
      ))}
    </svg>
  );
}
