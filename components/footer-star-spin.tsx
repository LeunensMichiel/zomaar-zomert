"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

// Idle baseline — one full rotation per `BASE_ROTATION_MS`. The old
// `animate-doodle-spin-slow` ran at 100 s; this is intentionally slower
// so the spin barely registers when the user isn't scrolling.
const BASE_ROTATION_MS = 240_000;
const BASE_DEG_PER_MS = 360 / BASE_ROTATION_MS;

// How aggressively scroll velocity (px/s) accelerates the spin. Tuned
// so a casual scroll (~600 px/s) adds a barely-perceptible nudge and a
// fast wheel-flick (~3000 px/s) reads as a gentle kick rather than a
// blur.
const SCROLL_BOOST = 0.000015;

/**
 * Footer star spinner — slow baseline rotation that speeds up
 * proportional to scroll velocity. `useVelocity` runs on top of a
 * smoothed scrollY, then we drive the rotation in `useAnimationFrame`
 * so the boost integrates smoothly into the accumulating angle. The
 * footer is mounted on every page but typically off-screen until
 * scrolled to — `IntersectionObserver` skips the per-frame work until
 * it enters the viewport.
 */
export function FooterStarSpin({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 200, damping: 40 });
  const rotation = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView) return;
    const boost = Math.abs(smoothVelocity.get()) * SCROLL_BOOST;
    rotation.set(rotation.get() + (BASE_DEG_PER_MS + boost) * delta);
  });

  return (
    <motion.div
      ref={ref}
      style={{ rotate: rotation }}
      className="h-full w-full opacity-60 blur-sm"
    >
      {children}
    </motion.div>
  );
}
