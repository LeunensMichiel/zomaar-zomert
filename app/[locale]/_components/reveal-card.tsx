"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

type Props = {
  /**
   * Index within a sibling group, used to compute a small per-card
   * delay so a row of cards appears to flip in sequence rather than
   * all at once.
   */
  index?: number;
  children: ReactNode;
};

/**
 * Wraps a card with the same `rotateY` flip + scale + opacity entry
 * animation used by the line-up grid, but triggered by viewport
 * intersection (`whileInView`) rather than filter state. Each card
 * animates once when it scrolls into view; reduced-motion users get
 * the children rendered straight without any animation wrapper.
 *
 * The `perspective` lives on the outer wrapper so the rotateY reads
 * as a real hinge instead of a horizontal squish.
 */
export function RevealCard({ index = 0, children }: Props) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <>{children}</>;

  return (
    <div style={{ perspective: "1200px" }}>
      <motion.div
        initial={{ opacity: 0, rotateY: -90, scale: 0.85 }}
        whileInView={{
          opacity: 1,
          rotateY: 0,
          scale: 1,
          transition: {
            duration: 0.55,
            ease: [0.22, 0.61, 0.36, 1] as const,
            delay: index * 0.06,
          },
        }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
