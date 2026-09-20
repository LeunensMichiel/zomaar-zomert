import "server-only";

import { cn } from "@lib/utils";

import { type Tear, type TearColor } from "./paper-tear-types";
import { TEAR_PATHS } from "./tear-paths";

export { type TearColor };

export const colorHex: Record<TearColor, string> = {
  "pink-50": "#fff1f7",
  "pink-300": "#ff9bb6",
  "brand-500": "#de350b",
  "brand-900": "#591404",
  "blue-500": "#3b84db",
  "blue-900": "#193d6b",
  "yellow-400": "#ffb600",
  "gray-900": "#1a1a1a",
  white: "#ffffff",
};

/**
 * Per-tear ink bounding box, measured by rasterizing each SVG and reading
 * the alpha channel. The original `tear-N.svg` files all declare a
 * `viewBox="0 0 11339 1418"` but the painted shapes only occupy part of
 * that 1418-unit-tall canvas — tear-3 paints the top ~810 units and
 * leaves ~610 empty below; tear-4 paints the bottom ~520 and leaves the
 * top empty; etc. Rendering the SVG at its file viewBox produces a box
 * far taller than the visible content. We re-render each tear with the
 * cropped viewBox so the component's box actually matches what you see.
 */
const TEAR_VIEWBOX: Record<
  Tear,
  { x: number; y: number; w: number; h: number }
> = {
  1: { x: 0, y: 110, w: 11339, h: 1298 },
  2: { x: 0, y: 260, w: 11339, h: 1148 },
  3: { x: 0, y: 0, w: 11339, h: 799 },
  4: { x: 0, y: 889, w: 11339, h: 519 },
  5: { x: 0, y: 0, w: 11339, h: 519 },
  6: { x: 0, y: 779, w: 11339, h: 629 },
  7: { x: 0, y: 599, w: 11339, h: 809 },
};

type Props = {
  edge: "top" | "bottom";
  tear?: Tear;
  /**
   * Colour of the painted silhouette (the "ink" side of the tear).
   * For `edge="bottom"` pass the next section's colour; for `edge="top"`
   * the previous section's colour. Everything outside the silhouette is
   * transparent so the parent shows through.
   */
  color: TearColor;
  /**
   * By default the tear is an absolute overlay pinned to `edge` of its
   * `relative` parent, so section content scrolls underneath the ink.
   * Set this for spacer strips with nothing to overlap; the tear then
   * takes up its own height in flow.
   */
  inFlow?: boolean;
  /**
   * CSS custom property that overrides the ink colour when set (e.g. the
   * footer tear, which takes the last section's colour from the page).
   * `color` stays as the fallback.
   */
  fillVar?: string;
  className?: string;
};

export function PaperTear({
  edge,
  tear = 1,
  color,
  inFlow = false,
  fillVar,
  className,
}: Props) {
  const vb = TEAR_VIEWBOX[tear];
  const paths = TEAR_PATHS[tear];
  const fill = fillVar
    ? `var(${fillVar}, ${colorHex[color]})`
    : colorHex[color];

  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox={`${String(vb.x)} ${String(vb.y)} ${String(vb.w)} ${String(vb.h)}`}
      className={cn(
        "pointer-events-none block h-auto w-full",
        inFlow
          ? "relative z-0"
          : cn(
              "absolute inset-x-0 z-30",
              edge === "top" ? "top-0" : "bottom-0",
            ),
        edge === "top" ? "-translate-y-px" : "translate-y-px",
        className,
      )}
      style={edge === "top" ? { transform: "scaleY(-1)" } : undefined}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} fill={fill} />
      ))}
    </svg>
  );
}
