"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

export function FooterPhotoParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.45,
  });
  const y = useTransform(
    smoothProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-7%", "7%"],
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={{ y, willChange: "transform" }}
        className='absolute inset-x-0 top-[-12%] h-[124%] bg-[url("/assets/footer.webp")] bg-cover bg-position-[50%_70%]'
      />
    </div>
  );
}
