"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; prespin?: boolean };

// Slowly spins its child as the user scrolls the page. One full
// revolution every ~2400 viewport pixels — enough that the motion reads
// as a gentle, ambient turn rather than a flashy spinner. Honors
// `prefers-reduced-motion`. With `prespin`, the inner layer also does a
// one-shot wind-up rotation on mount.
export function ScrollSpin({ children, className, prespin = false }: Props) {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 2400], [0, 360]);
  const reduced = useReducedMotion();

  const inner =
    prespin && !reduced ? (
      <motion.div
        initial={{ rotate: -135 }}
        animate={{ rotate: 0 }}
        transition={{ type: "spring", duration: 1.4, bounce: 0.35, delay: 0.1 }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    ) : (
      children
    );

  return (
    <motion.div style={reduced ? undefined : { rotate }} className={className}>
      {inner}
    </motion.div>
  );
}
