"use client";

import { cn } from "@lib/utils";
import { type HTMLMotionProps, motion } from "motion/react";

type MenuToggleProps = {
  open?: boolean;
} & HTMLMotionProps<"button">;

const TOP_CLOSED = "M3 12 L21 12";
const TOP_OPEN = "M6 6 L18 18";
const MIDDLE = "M3 6 L21 6";
const BOTTOM_CLOSED = "M3 18 L21 18";
const BOTTOM_OPEN = "M6 18 L18 6";

export function MenuToggle({ open, className, ...props }: MenuToggleProps) {
  return (
    <motion.button
      type="button"
      initial={false}
      animate={open ? "open" : "closed"}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent outline-none",
        "p-1.5 sm:p-2",
        className,
      )}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-9 w-9 md:h-11 md:w-11 lg:h-12 lg:w-12"
      >
        <motion.path
          d={TOP_CLOSED}
          variants={{ closed: { d: TOP_CLOSED }, open: { d: TOP_OPEN } }}
        />
        <motion.path
          d={MIDDLE}
          variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
          transition={{ duration: 0.1 }}
        />
        <motion.path
          d={BOTTOM_CLOSED}
          variants={{ closed: { d: BOTTOM_CLOSED }, open: { d: BOTTOM_OPEN } }}
        />
      </svg>
    </motion.button>
  );
}
