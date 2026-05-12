import "server-only";

import { cn } from "@lib/utils";
import { type CSSProperties } from "react";

import { DOODLE_SVGS } from "./doodle-svgs";

export type DoodleShape =
  | "eye"
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
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid meet"
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
        <circle cx={50} cy={50} r={10} fill="var(--color-gray-900)" />
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
  // Safari collapses the SVG to 0 width when the parent is absolutely
  // positioned with only height set and the SVG has no intrinsic
  // dimensions. Emitting width/height attrs from the viewBox gives it
  // an explicit aspect ratio so `h-full w-full` resolves correctly.
  const [, , vbW, vbH] = asset.viewBox.split(/\s+/).map(Number);

  return (
    <svg
      aria-hidden="true"
      viewBox={asset.viewBox}
      width={vbW}
      height={vbH}
      preserveAspectRatio="xMidYMid meet"
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
