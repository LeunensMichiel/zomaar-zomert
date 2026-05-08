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
 * gradient styles. Solids resolve to a CSS variable. Gradients are
 * injected into the SVG as inline `<linearGradient>` / `<radialGradient>`
 * defs and referenced via `url(#...)` — CSS gradients can't be used as
 * SVG paint servers, so we mint the def per render with a unique id.
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
  | "white"
  // Gradients — match the four named styles in app/globals.css.
  | "linear-red"
  | "linear-sunset"
  | "radial-red"
  | "80s-gum";

const colorVar: Record<
  Exclude<
    DoodleColor,
    "linear-red" | "linear-sunset" | "radial-red" | "80s-gum"
  >,
  string
> = {
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

type GradientName = "linear-red" | "linear-sunset" | "radial-red" | "80s-gum";

const isGradient = (c: DoodleColor): c is GradientName =>
  c === "linear-red" ||
  c === "linear-sunset" ||
  c === "radial-red" ||
  c === "80s-gum";

const gradientDef = (name: GradientName, id: string) => {
  switch (name) {
    case "linear-red":
      return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF1D25"/><stop offset="100%" stop-color="#961702"/></linearGradient>`;
    case "linear-sunset":
      return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFB600"/><stop offset="100%" stop-color="#FF7BAC"/></linearGradient>`;
    case "radial-red":
      return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FF7BAC"/><stop offset="100%" stop-color="#DE350B"/></radialGradient>`;
    case "80s-gum":
      return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="3%" stop-color="#3B84DB"/><stop offset="61%" stop-color="#FF8FAA"/></linearGradient>`;
  }
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

let doodleIdCounter = 0;
const nextDoodleId = () => `dg-${String(++doodleIdCounter)}`;

const resolveFill = (color: DoodleColor, id: string) =>
  isGradient(color) ? `url(#${id})` : colorVar[color];

/**
 * Decorative doodle dropped into section gutters — `pointer-events-none`,
 * `aria-hidden`. Asset-backed shapes are SVG illustrations from the
 * "Doodles" frame in the ZZ 2026 Figma file, inlined so each layer's
 * fill/stroke can be themed independently via `color` (primary) and
 * `accent` (secondary). Both can be solid palette tokens or one of the
 * four named gradients (`linear-red`, `linear-sunset`, `radial-red`,
 * `80s-gum`). Doodles that ship with built-in Figma gradients (coil,
 * lightning, star-burst, zzz, flame) keep those baked-in gradients on
 * any path that isn't bound to `var(--fill-0)` / `var(--stroke-0)`.
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
  const fillId = isGradient(color) ? nextDoodleId() : "";
  const strokeId = accent && isGradient(accent) ? nextDoodleId() : "";
  const fillVar = resolveFill(color, fillId);
  const strokeVar =
    accent !== undefined ? resolveFill(accent, strokeId) : undefined;

  if (shape === "eye") {
    // Three-layer eye: outline stroke (color), white-of-eye fill (paper),
    // pupil fill (accent if set, else color). Without a fill on the
    // outline path, the eye-white area is transparent and the eye reads
    // flat — losing the sticker-pack feel.
    const eyeDefs = [
      isGradient(color) ? gradientDef(color, fillId) : "",
      accent && isGradient(accent) ? gradientDef(accent, strokeId) : "",
    ]
      .filter(Boolean)
      .join("");
    const pupilFill = strokeVar ?? fillVar;
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className={cn("pointer-events-none z-10 block select-none", className)}
        style={{ transform, ...style }}
      >
        {eyeDefs && <defs dangerouslySetInnerHTML={{ __html: eyeDefs }} />}
        <path
          d={EYE_OUTLINE}
          fill="var(--color-pink-50)"
          stroke={fillVar}
          strokeWidth={6}
        />
        <circle cx={50} cy={50} r={16} fill={pupilFill} />
      </svg>
    );
  }

  const asset = DOODLE_SVGS[shape];
  const defs = [
    isGradient(color) ? gradientDef(color, fillId) : "",
    accent && isGradient(accent) ? gradientDef(accent, strokeId) : "",
  ]
    .filter(Boolean)
    .join("");
  const inner = defs ? `<defs>${defs}</defs>${asset.inner}` : asset.inner;

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
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
