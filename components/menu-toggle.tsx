"use client";

import { cn } from "@lib/utils";
import { type HTMLMotionProps, motion } from "motion/react";

type MenuToggleProps = {
  open?: boolean;
  transparent?: boolean;
} & HTMLMotionProps<"button">;

export function MenuToggle({
  open,
  transparent,
  className,
  ...props
}: MenuToggleProps) {
  return (
    <motion.button
      type="button"
      initial={false}
      animate={open ? "open" : "closed"}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0.5 outline-none",
        transparent ? "text-white" : "text-gray-900",
        className,
      )}
      {...props}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="h-10 w-10 md:h-14 md:w-14"
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
