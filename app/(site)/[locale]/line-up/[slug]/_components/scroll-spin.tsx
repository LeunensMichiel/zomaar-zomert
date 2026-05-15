"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { type ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

// Slowly spins its child as the user scrolls the page. One full
// revolution every ~2400 viewport pixels — enough that the motion reads
// as a gentle, ambient turn rather than a flashy spinner. Honors
// `prefers-reduced-motion`.
export function ScrollSpin({ children, className }: Props) {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 2400], [0, 360]);
  const reduced = useReducedMotion();

  return (
    <motion.div style={reduced ? undefined : { rotate }} className={className}>
      {children}
    </motion.div>
  );
}
