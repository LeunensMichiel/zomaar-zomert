"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

/**
 * Parallax background for the footer photo strip. The inner image is
 * 124% tall and offset `-top-[12%]` so there's 12% slack at each end;
 * `useScroll` tracks the wrapper through the viewport and slides the
 * image between `-12%` and `+12%` so it scrolls *slower* than the page.
 * `useSpring` smooths the raw scroll progress so the image glides
 * with inertia instead of snapping pixel-for-pixel with the wheel.
 * Pure transform animation — GPU-cheap, and the outer wrapper clips
 * the slack so nothing bleeds outside the strip.
 */
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
