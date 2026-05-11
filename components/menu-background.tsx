"use client";

import { motion } from "motion/react";
import { useId } from "react";

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

export function MenuBackground() {
  const noiseId = useId();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        variants={layerVariants}
        custom={0}
        className="from-brand-900 via-brand-500 absolute inset-0 bg-linear-to-br to-pink-400"
      />

      <motion.div
        variants={layerVariants}
        custom={1}
        className="animate-menu-blob-a absolute -top-32 -left-32 h-[70vh] w-[70vh] rounded-full bg-pink-400 mix-blend-screen blur-3xl"
      />
      <motion.div
        variants={layerVariants}
        custom={2}
        className="animate-menu-blob-b absolute -top-40 -right-32 h-[55vh] w-[55vh] rounded-full bg-blue-900 mix-blend-multiply blur-3xl"
      />
      <motion.div
        variants={layerVariants}
        custom={3}
        className="animate-menu-blob-c absolute -right-40 -bottom-40 h-[75vh] w-[75vh] rounded-full bg-yellow-400 mix-blend-screen blur-3xl"
      />
      <motion.div
        variants={layerVariants}
        custom={4}
        className="bg-brand-700 animate-menu-blob-d absolute -bottom-32 -left-40 h-[60vh] w-[60vh] rounded-full blur-3xl"
      />

      <motion.svg
        variants={layerVariants}
        custom={5}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full mix-blend-overlay"
      >
        <filter id={noiseId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
      </motion.svg>
    </div>
  );
}
