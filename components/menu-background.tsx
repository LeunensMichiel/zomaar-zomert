"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";

/**
 * Noisy gradient backdrop for the kinetic menu. A single drifting blob
 * sits over a hot-sunset gradient base, with a paper-grain overlay
 * biting texture into the whole thing.
 *
 * Layers are wrapped in `motion.div`s that consume the parent panel's
 * `hidden / visible / exit` variants — the navbar passes the variant
 * + index via `custom` so each layer fades in / out on its own delay.
 */

const ease = [0.22, 0.61, 0.36, 1] as const;
const exitEase = [0.4, 0, 1, 1] as const;

//                       [gradient, blob, grain]
const VISIBLE_DELAY = [0, 0.06, 0.09];
// Exits run alongside the text exits — no lingering background after
// the foreground has gone.
const EXIT_DELAY = [0, 0.02, 0.04];

const layerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.38, delay: VISIBLE_DELAY[i] ?? 0.09, ease },
  }),
  exit: (i: number) => ({
    opacity: 0,
    transition: {
      duration: 0.26,
      delay: EXIT_DELAY[i] ?? 0.04,
      ease: exitEase,
    },
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
        className="bg-brand-700 animate-menu-blob-d absolute -bottom-32 -left-40 h-[55vh] w-[55vh] rounded-full blur-2xl"
      />

      {starBurst && (
        <motion.div
          variants={layerVariants}
          custom={1}
          className="absolute top-1/2 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="animate-doodle-spin-slow h-full w-full opacity-50 mix-blend-soft-light blur-xs">
            {starBurst}
          </div>
        </motion.div>
      )}

      {/* Pre-rasterised noise tile — browser caches once after first
          paint. Replaces an inline feTurbulence filter that re-ran per
          frame on mobile compositors. */}
      <motion.div
        variants={layerVariants}
        custom={2}
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
