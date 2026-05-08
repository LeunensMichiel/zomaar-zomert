import "server-only";

import { cn } from "@lib/utils";
import { type CSSProperties } from "react";

import { DOODLE_SVGS } from "./doodle-svgs";

export type DoodleShape =
  // Inline shape — drawn directly in this component so it can be
  // recoloured per section without touching the asset pipeline.
  | "eye"
  // Asset-backed doodles, drawn in Figma and exported as SVG to
  // [public/assets/doodles/](public/assets/doodles/). Pre-extracted
  // into [doodle-svgs.ts](./doodle-svgs.ts) so we can render them
  // inline (which is the only way to theme per-layer fills/strokes
  // — `mask-image` collapses every layer to one colour).
  | "plus"
  | "zz"
  | "play"
  | "cross"
  | "banner"
  | "sun-rays"
  | "star-burst"
  | "zzz"
  | "stroke"
  | "horns"
  | "coil"
  | "radial"
  | "lips"
  | "stripes"
  | "asterisk"
  | "flame"
  | "cocktail"
  | "star";

/**
 * Solid colour tokens (Zomaar Zomert palette) and the four named
 * gradient styles. Solids are CSS variable references so they keep
 * pace with theme changes; gradients resolve to literal `linear-gradient`
 * /`radial-gradient` strings (used as inline `<linearGradient>` defs
 * isn't worth the complexity for a single per-layer pass).
 */
export type DoodleColor =
  // Solid — ZZ named anchors + utility neutrals.
  | "summer-red"
  | "royal-yellow"
  | "dimmed-led"
  | "blue-cola"
  | "tardis-blue"
  | "pink"
  | "ink"
  | "paper"
  | "white";

const colorVar: Record<DoodleColor, string> = {
  "summer-red": "var(--color-brand-500)",
  "royal-yellow": "var(--color-yellow-400)",
  "dimmed-led": "var(--color-yellow-100)",
  "blue-cola": "var(--color-blue-500)",
  "tardis-blue": "var(--color-blue-900)",
  pink: "var(--color-pink-400)",
  ink: "var(--color-gray-900)",
  paper: "var(--color-pink-50)",
  white: "#ffffff",
};

const EYE_OUTLINE = "M 6 50 Q 50 6 94 50 Q 50 94 6 50 Z";

type Props = {
  shape: DoodleShape;
  /** Primary fill (maps to the SVG's `var(--fill-0)` slot, and to the
   *  `eye` stroke + pupil). Default: `ink`. */
  color?: DoodleColor;
  /** Secondary stroke / detail layer (maps to `var(--stroke-0)`). When
   *  omitted, duo-coloured doodles fall back to their original Figma
   *  detail colour; single-layer doodles ignore it. */
  accent?: DoodleColor;
  /** Optional rotation in degrees. */
  rotate?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Decorative doodle dropped into section gutters — `pointer-events-none`,
 * `aria-hidden`. Asset-backed shapes are SVG illustrations from the
 * "Doodles" frame in the ZZ 2026 Figma file, inlined so each layer's
 * fill/stroke can be themed independently via `color` (primary) and
 * `accent` (secondary). Doodles that ship with built-in linear/radial
 * gradients (coil, lightning, star-burst, zzz, flame) keep those
 * gradients regardless of the props — the props only affect any
 * remaining `var(--fill-0)` / `var(--stroke-0)` slots in those shapes.
 *
 * Size with a single-axis utility (`h-44`, `lg:w-96`, …); the SVG's
 * intrinsic viewBox provides the aspect ratio.
 */
export function Doodle({
  shape,
  color = "ink",
  accent,
  rotate = 0,
  className,
  style,
}: Props) {
  const transform = `rotate(${String(rotate)}deg)`;

  if (shape === "eye") {
    const stroke = colorVar[color];
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className={cn("pointer-events-none z-10 block select-none", className)}
        style={{ transform, ...style }}
      >
        <path d={EYE_OUTLINE} fill="none" stroke={stroke} strokeWidth={6} />
        <circle cx={50} cy={50} r={16} fill={stroke} />
      </svg>
    );
  }

  const asset = DOODLE_SVGS[shape];
  const fillVar = colorVar[color];
  // When no accent is given, duo-colour SVGs use their baked-in default
  // (which is what `var(--stroke-0, default)` resolves to on its own).
  // Setting `--stroke-0: undefined` here means "don't override". React
  // drops `undefined` values from the style object.
  const strokeVar = accent !== undefined ? colorVar[accent] : undefined;
  return (
    <svg
      aria-hidden="true"
      viewBox={asset.viewBox}
      className={cn("pointer-events-none z-10 block select-none", className)}
      style={
        {
          "--fill-0": fillVar,
          "--stroke-0": strokeVar,
          transform,
          ...style,
        } as CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: asset.inner }}
    />
  );
}
