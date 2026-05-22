"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { type ReactNode } from "react";

type Variant = "card" | "photo" | "bio";

type Props = {
  children: ReactNode;
  variant: Variant;
  className?: string;
  style?: React.CSSProperties;
};

const variants: Record<Variant, Variants> = {
  card: {
    hidden: { opacity: 0, y: -28, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", duration: 0.75, bounce: 0.4, delay: 0.05 },
    },
  },
  photo: {
    hidden: { opacity: 0, x: 36, y: 12 },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", duration: 0.8, bounce: 0.3, delay: 0.2 },
    },
  },
  bio: {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", duration: 0.7, bounce: 0.25, delay: 0.38 },
    },
  },
};

export function Reveal({ children, variant, className, style }: Props) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      animate="show"
      variants={variants[variant]}
    >
      {children}
    </motion.div>
  );
}
