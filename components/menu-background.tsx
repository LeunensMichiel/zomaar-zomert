"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";

/**
 * Noisy gradient backdrop for the kinetic menu. Four blurred colour
 * blobs in the ZZ palette drift slowly over a hot-sunset base, with a
 * fractal-noise overlay biting risograph grain into the whole thing.
 *
 * Layers are wrapped in `motion.div`s that consume the parent panel's
 * `hidden / visible / exit` variants — the navbar passes the variant
 * + index via `custom` so each layer fades in / out on its own delay.
 */

const ease = [0.22, 0.61, 0.36, 1] as const;
const exitEase = [0.4, 0, 1, 1] as const;

// Background fades in/out in compact waves rather than single-file
// stagger, so the panel paints itself faster and reads as one
// atmosphere lighting up rather than six discrete layers.
//                       [grad, blob-a, blob-b, blob-c, blob-d, grain]
const VISIBLE_DELAY = [0, 0.05, 0.05, 0.1, 0.1, 0.15];
const EXIT_DELAY = [0.18, 0.18, 0.2, 0.2, 0.22, 0.22];

const layerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: VISIBLE_DELAY[i] ?? 0.15, ease },
  }),
  exit: (i: number) => ({
    opacity: 0,
    transition: { duration: 0.28, delay: EXIT_DELAY[i] ?? 0.2, ease: exitEase },
  }),
};

// `transform: translateZ(0)` on each blob forces a compositor layer up
// front so the GPU doesn't have to allocate them mid-animation —
// keeps mobile Chrome from dropping frames on menu enter/exit.
const PROMOTE = { transform: "translateZ(0)" } as const;

export function MenuBackground({ starBurst }: { starBurst?: ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ willChange: "opacity" }}
    >
      <motion.div
        variants={layerVariants}
        custom={0}
        className="from-brand-900 via-brand-500 absolute inset-0 bg-linear-to-br to-pink-400"
      />

      <motion.div
        variants={layerVariants}
        custom={1}
        style={PROMOTE}
        className="animate-menu-blob-a absolute -top-32 -left-32 h-[70vh] w-[70vh] rounded-full bg-pink-400 mix-blend-screen blur-3xl"
      />
      <motion.div
        variants={layerVariants}
        custom={2}
        style={PROMOTE}
        className="animate-menu-blob-b absolute -top-40 -right-32 h-[55vh] w-[55vh] rounded-full bg-blue-900 mix-blend-multiply blur-2xl"
      />
      <motion.div
        variants={layerVariants}
        custom={3}
        style={PROMOTE}
        className="animate-menu-blob-c absolute -right-40 -bottom-40 h-[75vh] w-[75vh] rounded-full bg-yellow-400 mix-blend-screen blur-3xl"
      />
      <motion.div
        variants={layerVariants}
        custom={4}
        style={PROMOTE}
        className="bg-brand-700 animate-menu-blob-d absolute -bottom-32 -left-40 h-[60vh] w-[60vh] rounded-full blur-2xl"
      />

      {starBurst && (
        <motion.div
          variants={layerVariants}
          custom={4}
          className="absolute top-1/2 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="animate-doodle-spin-slow h-full w-full opacity-50 mix-blend-soft-light blur-sm">
            {starBurst}
          </div>
        </motion.div>
      )}

      {/* Pre-rasterised noise tile — browser caches once after first
          paint. Replaces an inline feTurbulence filter that re-ran per
          frame on mobile compositors. */}
      <motion.div
        variants={layerVariants}
        custom={5}
        aria-hidden="true"
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage: "url(/assets/menu-noise.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
}
