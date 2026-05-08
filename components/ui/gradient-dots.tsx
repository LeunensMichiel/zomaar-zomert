"use client";

import { cn } from "@lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof motion.div>, "ref"> & {
  /** Visible LED diameter in px. Edges are hard so dots stay crisp. */
  dotSize?: number;
  /** Cell spacing between LEDs (px). Hex spacing is derived as spacing × √3. */
  spacing?: number;
  /** Wave loop duration (s) — how long it takes for the gradient
   *  blobs to sweep across the surface. */
  duration?: number;
  /** Hue-rotate cycle duration (s). Drives the visible LED colour
   *  cycle on top of the position animation. Set to `0` to disable. */
  colorCycleDuration?: number;
  /** 4 hex/CSS colours used as the moving wave layers. */
  colors?: [string, string, string, string];
};

/**
 * Animated LED dot-matrix overlay. Renders an absolute-positioned
 * hexagonal grid of "LED" dots whose colours come from four large
 * radial-gradient waves drifting across the surface. The space
 * between dots is fully transparent (CSS mask), so anything behind
 * the overlay (e.g. a hero video) stays visible.
 *
 * Defaults to the festival's warm-wave palette to match the
 * scroll-driven background on /history. Pass `colors` to retune.
 *
 * Honours `prefers-reduced-motion` by holding a static frame.
 */
export function GradientDots({
  dotSize = 3,
  spacing = 10,
  duration = 20,
  colorCycleDuration = 0,
  colors = ["#fff1f7", "#fee198", "#ff9bb6", "#fee198"],
  className,
  style,
  ...props
}: Props) {
  const reducedMotion = useReducedMotion();
  const hexSpacing = spacing * 1.732;
  const dotRadius = dotSize / 2;
  const [c1, c2, c3, c4] = colors;

  // Two offset hard-edge radial gradients form the hex grid in the
  // mask layer. The 0.5px transition is purely for anti-aliasing —
  // any wider and the dots start reading as soft / "low-res".
  const dot = `radial-gradient(circle at 50% 50%, #000 ${dotRadius}px, transparent ${dotRadius + 0.5}px)`;
  const mask = `${dot}, ${dot}`;
  const maskSize = `${spacing}px ${hexSpacing}px, ${spacing}px ${hexSpacing}px`;
  const maskPosition = `0 0, ${spacing / 2}px ${hexSpacing / 2}px`;

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, ${c1}, transparent 60%),
          radial-gradient(circle at 50% 50%, ${c2}, transparent 60%),
          radial-gradient(circle at 50% 50%, ${c3}, transparent 60%),
          radial-gradient(ellipse at 50% 50%, ${c4}, transparent 60%)
        `,
        backgroundSize: `200% 200%, 200% 200%, 200% 200%, 200% ${hexSpacing}px`,
        backgroundPosition: "0% 0%, 0% 0%, 0% 0%, 0% 0%",
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
              backgroundPosition: [
                `800% 400%, 1000% -400%, -1200% -600%, 400% ${hexSpacing}px`,
                "0% 0%, 0% 0%, 0% 0%, 0% 0%",
              ],
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
