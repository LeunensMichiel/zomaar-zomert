"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; prespin?: boolean };

// One revolution per ~2400px scroll; honors prefers-reduced-motion.
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
