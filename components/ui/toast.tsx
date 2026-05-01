"use client";

import { AnimatePresence, motion } from "motion/react";
import { type PropsWithChildren, useEffect, useState } from "react";

type ToastProps = {
  isShown: boolean;
  duration: number;
} & PropsWithChildren;

export function Toast({ children, duration, isShown }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isShown) {
      timer = setTimeout(() => {
        setVisible((x) => !x);
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isShown, duration]);

  return (
    <AnimatePresence>
      {isShown && visible && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className="bg-brand-500 fixed right-4 bottom-4 z-[1000000] max-w-[240px] p-4 text-xs text-white"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
