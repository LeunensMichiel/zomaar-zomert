"use client";

import { cn } from "@lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof motion.div>, "ref"> & {
  /** Visible LED diameter in px. Edges are hard so dots stay crisp. */
  dotSize?: number;
  /** Cell spacing between LEDs (px). Hex vertical pitch is spacing × √3. */
  spacing?: number;
  /** Wave loop duration (s) — how long blobs take to sweep across. */
  duration?: number;
  /** Hue-rotate cycle duration (s). `0` disables. */
  colorCycleDuration?: number;
  /** 4 hex/CSS colours used as the moving wave layers. */
  colors?: [string, string, string, string];
};

// Far-offset starting positions per layer. The animation drifts each
// back to "0% 0%" linearly, then loops. Listed front-to-back to match
// the backgroundImage stacking order (CSS paints first = on top).
const FAR_POSITIONS = [
  "800% 400%", // shadow 1
  "1000% -400%", // shadow 2
  "-1200% -600%", // colour 1
  "1400% -400%", // colour 2
  "-800% 1200%", // colour 3
  "600% -1000%", // colour 4
];
const HOME_POSITIONS = FAR_POSITIONS.map(() => "0% 0%").join(", ");
const SHADOW_LAYER =
  "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.9), transparent 45%)";

/**
 * Animated LED dot-matrix overlay. A hex-packed CSS mask reveals a grid
 * of LED-shaped pixels; underneath, two dark "shadow" gradients and four
 * colour gradients drift across to create travelling waves of lit and
 * unlit LEDs. Anything behind the overlay (e.g. a hero video) shows
 * through the gaps between dots.
 *
 * Honours `prefers-reduced-motion` by holding a static frame.
 */
export function GradientDots({
  dotSize = 3,
  spacing = 10,
  duration = 10,
  colorCycleDuration = 0,
  colors = ["#fff1f7", "#fee198", "#ff9bb6", "#ffb600"],
  className,
  style,
  ...props
}: Props) {
  const reducedMotion = useReducedMotion();
  const hexSpacing = spacing * Math.sqrt(3);
  const dotRadius = dotSize / 2;

  // Two offset hard-edge radial gradients form the hex grid in the mask.
  // 0.5px transition is anti-aliasing — wider reads as soft / low-res.
  const dot = `radial-gradient(circle at 50% 50%, #000 ${dotRadius}px, transparent ${dotRadius + 0.5}px)`;
  const mask = `${dot}, ${dot}`;
  const maskSize = `${spacing}px ${hexSpacing}px, ${spacing}px ${hexSpacing}px`;
  const maskPosition = `0 0, ${spacing / 2}px ${hexSpacing / 2}px`;

  const colourLayers = colors
    .map((c) => `radial-gradient(circle at 50% 50%, ${c}, transparent 85%)`)
    .join(", ");

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        // Shadows paint on top of colours, so wherever a shadow sits
        // the LEDs there read as "off" — a travelling-lightshow feel
        // instead of "all LEDs on at once".
        backgroundImage: `${SHADOW_LAYER}, ${SHADOW_LAYER}, ${colourLayers}`,
        backgroundSize:
          "140% 140%, 140% 140%, 200% 200%, 200% 200%, 200% 200%, 200% 200%",
        backgroundPosition: HOME_POSITIONS,
        maskImage: mask,
        maskSize,
        maskPosition,
        WebkitMaskImage: mask,
        WebkitMaskSize: maskSize,
        WebkitMaskPosition: maskPosition,
        ...style,
      }}
      animate={
        reducedMotion
          ? undefined
          : {
              backgroundPosition: [FAR_POSITIONS.join(", "), HOME_POSITIONS],
              ...(colorCycleDuration > 0 && {
                filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
              }),
            }
      }
      transition={{
        backgroundPosition: {
          duration,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        },
        filter: {
          duration: colorCycleDuration,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        },
      }}
      {...props}
    />
  );
}
