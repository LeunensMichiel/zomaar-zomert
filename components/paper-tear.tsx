import "server-only";

import { cn } from "@lib/utils";

import { type Tear, type TearColor } from "./paper-tear-types";
import { TEAR_PATHS } from "./tear-paths";

export { type TearColor };

const colorHex: Record<TearColor, string> = {
  "pink-50": "#fff1f7",
  "pink-300": "#ff9bb6",
  "brand-500": "#de350b",
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
   * Color of the painted silhouette (the "ink" side of the tear).
   * For `edge="bottom"` pass the next section's color; for `edge="top"`
   * the previous section's color.
   */
  color: TearColor;
  /**
   * Optional second color filling the area *outside* the silhouette.
   * When set, the tear becomes a fully opaque two-tone block — useful
   * when the parent's background isn't the color you want on the other
   * side of the wave, or when you want to swap which side reads as
   * primary by flipping the two values.
   *
   * Leave undefined for the previous behavior (transparent outside the
   * silhouette so the parent shows through).
   */
  bgColor?: TearColor;
  className?: string;
};

export function PaperTear({
  edge,
  tear = 1,
  color,
  bgColor,
  className,
}: Props) {
  const vb = TEAR_VIEWBOX[tear];
  const paths = TEAR_PATHS[tear];
  const fill = colorHex[color];
  const bg = bgColor ? colorHex[bgColor] : undefined;

  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox={`${String(vb.x)} ${String(vb.y)} ${String(vb.w)} ${String(vb.h)}`}
      className={cn(
        "pointer-events-none relative z-0 block h-auto w-full",
        edge === "top" ? "-translate-y-px" : "translate-y-px",
        className,
      )}
      style={edge === "top" ? { transform: "scaleY(-1)" } : undefined}
    >
      {bg && <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill={bg} />}
      {paths.map((d, i) => (
        <path key={i} d={d} fill={fill} />
      ))}
    </svg>
  );
}
