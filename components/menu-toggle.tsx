"use client";

import { cn } from "@lib/utils";
import { type HTMLMotionProps, motion } from "motion/react";

type MenuToggleProps = {
  open?: boolean;
} & HTMLMotionProps<"button">;

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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="h-9 w-9 md:h-11 md:w-11 lg:h-12 lg:w-12"
      >
        <motion.path
          variants={{
            closed: { d: "M3 12, L21 12" },
            open: { d: "M6 6, L18 18" },
          }}
          fill="transparent"
          strokeWidth="2"
          stroke="currentColor"
        />
        <motion.path
          d="M3 6, L21 6"
          variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
          transition={{ duration: 0.1 }}
          fill="transparent"
          strokeWidth="2"
          stroke="currentColor"
        />
        <motion.path
          variants={{
            closed: { d: "M3 18, L21 18" },
            open: { d: "M6 18, L18 6" },
          }}
          fill="transparent"
          strokeWidth="2"
          stroke="currentColor"
        />
      </svg>
    </motion.button>
  );
}
