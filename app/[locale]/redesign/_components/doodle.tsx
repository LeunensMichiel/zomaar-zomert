import { cn } from "@lib/utils";
import { type CSSProperties } from "react";

/**
 * Per-render counter so each `<Doodle>` instance gets unique SVG `id`s
 * for its `<defs>` (halftone pattern, grain filter). Fine in a server
 * component — the module is per-request and only one render happens at
 * a time within a request.
 */
let _doodleCounter = 0;
const nextDoodleId = (): string => `zd${String(++_doodleCounter)}`;

export type DoodleShape =
  // Single-color shapes
  | "dot"
  | "donut"
  | "ring"
  | "plus"
  | "cross"
  | "squiggle"
  | "wave"
  | "asterisk"
  | "blob"
  | "eye"
  | "star4"
  | "star8"
  | "diamond"
  | "triangle"
  | "halftone"
  | "bars"
  | "burst"
  | "spiral"
  | "lightning"
  | "flame"
  | "arrow"
  | "peace"
  | "note"
  | "radio-waves"
  // Multi-color / textured shapes (use `accent`)
  | "halftone-circle"
  | "halftone-blob"
  | "halftone-star"
  | "split-circle"
  | "concentric"
  | "eye-iris"
  | "sun-rays"
  | "wave-pair"
  | "striped-rect"
  | "striped-circle"
  | "burst-dot"
  | "flower"
  | "smile"
  | "checkered"
  | "tag";

export type DoodleColor =
  | "brand"
  | "yellow"
  | "blue"
  | "pink"
  | "ink"
  | "paper"
  | "white";

const colorHex: Record<DoodleColor, string> = {
  brand: "#de350b",
  yellow: "#ffb600",
  blue: "#3b84db",
  pink: "#ff8faa",
  ink: "#1a1a1a",
  paper: "#fff1f7",
  white: "#ffffff",
};

type Props = {
  shape: DoodleShape;
  /** Primary fill color. */
  color?: DoodleColor;
  /** Secondary color used by multi-color shapes (halftone overlay,
   *  split fill, iris, rays, stripe accent…). Falls back to `ink`. */
  accent?: DoodleColor;
  /** Adds a printed "grain" overlay via SVG `feTurbulence`. Cheap; the
   *  filter is scoped to the SVG instance so it doesn't leak. */
  grain?: boolean;
  /** Optional rotation in degrees. */
  rotate?: number;
  className?: string;
  style?: CSSProperties;
};

const STAR4_PATH =
  "M 50 4 L 60 40 L 96 50 L 60 60 L 50 96 L 40 60 L 4 50 L 40 40 Z";
const STAR8_PATH =
  "M50 4 L57 35 L85 14 L65 43 L96 50 L65 57 L85 86 L57 65 L50 96 L43 65 L15 86 L35 57 L4 50 L35 43 L15 14 L43 35 Z";
const BLOB_PATH =
  "M52 8 C72 6 92 22 88 46 C94 66 78 90 56 90 C30 92 10 76 12 52 C8 28 30 10 52 8 Z";
const EYE_OUTLINE = "M 6 50 Q 50 6 94 50 Q 50 94 6 50 Z";

/**
 * Tiny inline-SVG decorative shape — the building block for the redesign's
 * sticker-pack maximalism. Drop several into section margins / gutters with
 * absolute positioning. Always `pointer-events-none` and `aria-hidden`.
 *
 * Multi-color variants (`halftone-*`, `split-circle`, `eye-iris`, `sun-rays`,
 * `concentric`, `striped-rect`, `wave-pair`, `burst-dot`) take both `color`
 * and `accent`. `grain` adds risograph-style noise via an `feTurbulence`
 * filter.
 */
export function Doodle({
  shape,
  color = "ink",
  accent = "ink",
  grain = false,
  rotate = 0,
  className,
  style,
}: Props) {
  const id = nextDoodleId();
  const halftoneId = `${id}-halftone`;
  const grainId = `${id}-grain`;
  const fill = colorHex[color];
  const accentFill = colorHex[accent];
  const grainFilter = grain ? `url(#${grainId})` : undefined;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={cn("pointer-events-none block select-none", className)}
      style={{
        transform: `rotate(${String(rotate)}deg)`,
        ...style,
      }}
    >
      <defs>
        {/* Halftone dot pattern in the accent color, tiled across the
            whole viewBox. Use as `fill="url(#halftoneId)"`. */}
        <pattern
          id={halftoneId}
          x={0}
          y={0}
          width={6}
          height={6}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={3} cy={3} r={1.4} fill={accentFill} />
        </pattern>
        {/* Grain filter — fractal noise tinted dark, masked to the source
            shape, then merged on top of it. Adds a subtle riso/print feel. */}
        <filter id={grainId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2.4"
            numOctaves={2}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"
            result="grain"
          />
          <feComposite
            in="grain"
            in2="SourceGraphic"
            operator="in"
            result="masked-grain"
          />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="masked-grain" />
          </feMerge>
        </filter>
      </defs>
      <g filter={grainFilter}>
        {renderShape(shape, fill, accentFill, halftoneId)}
      </g>
    </svg>
  );
}

function renderShape(
  shape: DoodleShape,
  fill: string,
  accent: string,
  halftoneId: string,
) {
  switch (shape) {
    /* ---------- single-color shapes ---------- */
    case "dot":
      return <circle cx={50} cy={50} r={36} fill={fill} />;
    case "donut":
      return (
        <circle
          cx={50}
          cy={50}
          r={32}
          fill="none"
          stroke={fill}
          strokeWidth={14}
        />
      );
    case "ring":
      return (
        <circle
          cx={50}
          cy={50}
          r={38}
          fill="none"
          stroke={fill}
          strokeWidth={6}
        />
      );
    case "plus":
      return (
        <g fill={fill}>
          <rect x={42} y={8} width={16} height={84} />
          <rect x={8} y={42} width={84} height={16} />
        </g>
      );
    case "cross":
      return (
        <g fill="none" stroke={fill} strokeWidth={14} strokeLinecap="round">
          <line x1={18} y1={18} x2={82} y2={82} />
          <line x1={82} y1={18} x2={18} y2={82} />
        </g>
      );
    case "squiggle":
      return (
        <path
          d="M 6 50 Q 22 18 38 50 T 70 50 T 96 50"
          fill="none"
          stroke={fill}
          strokeWidth={11}
          strokeLinecap="round"
        />
      );
    case "wave":
      return (
        <path
          d="M 6 50 Q 28 28 50 50 T 96 50"
          fill="none"
          stroke={fill}
          strokeWidth={13}
          strokeLinecap="round"
        />
      );
    case "asterisk":
      return (
        <g stroke={fill} strokeWidth={12} strokeLinecap="round">
          <line x1={50} y1={8} x2={50} y2={92} />
          <line x1={8} y1={50} x2={92} y2={50} />
          <line x1={20} y1={20} x2={80} y2={80} />
          <line x1={80} y1={20} x2={20} y2={80} />
        </g>
      );
    case "blob":
      return <path d={BLOB_PATH} fill={fill} />;
    case "eye":
      return (
        <g>
          <path
            d={EYE_OUTLINE}
            fill="none"
            stroke={fill}
            strokeWidth={6}
          />
          <circle cx={50} cy={50} r={16} fill={fill} />
        </g>
      );
    case "star4":
      return <path d={STAR4_PATH} fill={fill} />;
    case "star8":
      return <path d={STAR8_PATH} fill={fill} />;
    case "diamond":
      return <path d="M50 4 L96 50 L50 96 L4 50 Z" fill={fill} />;
    case "triangle":
      return <path d="M50 6 L94 90 L6 90 Z" fill={fill} />;
    case "halftone":
      return (
        <g fill={fill}>
          {Array.from({ length: 5 }).flatMap((_, r) =>
            Array.from({ length: 5 }).map((_, c) => (
              <circle
                key={`${String(r)}-${String(c)}`}
                cx={12 + c * 19}
                cy={12 + r * 19}
                r={4.5}
              />
            )),
          )}
        </g>
      );
    case "bars":
      return (
        <g fill={fill}>
          <rect x={8} y={20} width={16} height={60} />
          <rect x={32} y={8} width={16} height={84} />
          <rect x={56} y={28} width={16} height={44} />
          <rect x={80} y={14} width={12} height={72} />
        </g>
      );
    case "burst":
      return (
        <g stroke={fill} strokeWidth={8} strokeLinecap="round">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 12;
            const x1 = 50 + Math.cos(a) * 18;
            const y1 = 50 + Math.sin(a) * 18;
            const x2 = 50 + Math.cos(a) * 44;
            const y2 = 50 + Math.sin(a) * 44;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
      );
    case "spiral":
      return (
        <path
          d="M 50 50 m -2 0 a 2 2 0 1 1 4 0 a 8 8 0 1 1 -16 0 a 16 16 0 1 1 32 0 a 24 24 0 1 1 -48 0 a 32 32 0 1 1 64 0"
          fill="none"
          stroke={fill}
          strokeWidth={6}
          strokeLinecap="round"
        />
      );
    case "lightning":
      return (
        <path
          d="M62 4 L26 50 L46 50 L34 96 L78 42 L52 42 L66 4 Z"
          fill={fill}
        />
      );
    case "flame":
      return (
        <path
          d="M50 6 C42 24 32 36 38 56 C26 62 22 78 32 90 C44 96 60 96 70 90 C80 78 76 62 64 56 C70 36 60 24 50 6 Z"
          fill={fill}
        />
      );
    case "arrow":
      return (
        <g fill={fill}>
          <rect x={10} y={42} width={56} height={16} />
          <path d="M60 24 L96 50 L60 76 Z" />
        </g>
      );
    case "peace":
      return (
        <g
          fill="none"
          stroke={fill}
          strokeWidth={8}
          strokeLinecap="round"
        >
          <circle cx={50} cy={50} r={38} />
          <line x1={50} y1={12} x2={50} y2={88} />
          <line x1={50} y1={50} x2={24} y2={76} />
          <line x1={50} y1={50} x2={76} y2={76} />
        </g>
      );
    case "note":
      // Simplified eighth note — note head + stem + flag.
      return (
        <g fill={fill}>
          <ellipse
            cx={32}
            cy={75}
            rx={18}
            ry={12}
            transform="rotate(-18 32 75)"
          />
          <rect x={47} y={18} width={7} height={58} />
          <path
            d="M53 18 Q 88 28 80 56"
            fill="none"
            stroke={fill}
            strokeWidth={7}
            strokeLinecap="round"
          />
        </g>
      );
    case "radio-waves":
      return (
        <g
          fill="none"
          stroke={fill}
          strokeWidth={6}
          strokeLinecap="round"
        >
          <path d="M30 70 Q50 38 70 70" />
          <path d="M18 80 Q50 24 82 80" />
          <path d="M6 90 Q50 12 94 90" />
        </g>
      );

    /* ---------- multi-color / textured shapes ---------- */
    case "halftone-circle":
      return (
        <g>
          <circle cx={50} cy={50} r={40} fill={fill} />
          <circle cx={50} cy={50} r={40} fill={`url(#${halftoneId})`} />
        </g>
      );
    case "halftone-blob":
      return (
        <g>
          <path d={BLOB_PATH} fill={fill} />
          <path d={BLOB_PATH} fill={`url(#${halftoneId})`} />
        </g>
      );
    case "halftone-star":
      return (
        <g>
          <path d={STAR8_PATH} fill={fill} />
          <path d={STAR8_PATH} fill={`url(#${halftoneId})`} />
        </g>
      );
    case "split-circle":
      // Yin-yang-ish split — left half primary, right half accent.
      return (
        <g>
          <path d="M 50 8 A 42 42 0 0 0 50 92 Z" fill={fill} />
          <path d="M 50 8 A 42 42 0 0 1 50 92 Z" fill={accent} />
        </g>
      );
    case "concentric":
      return (
        <g>
          <circle cx={50} cy={50} r={44} fill={fill} />
          <circle cx={50} cy={50} r={32} fill={accent} />
          <circle cx={50} cy={50} r={20} fill={fill} />
          <circle cx={50} cy={50} r={8} fill={accent} />
        </g>
      );
    case "eye-iris":
      return (
        <g>
          <path d={EYE_OUTLINE} fill="#ffffff" />
          <path
            d={EYE_OUTLINE}
            fill="none"
            stroke={fill}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <circle cx={50} cy={50} r={18} fill={accent} />
          <circle cx={50} cy={50} r={8} fill="#1a1a1a" />
          {/* highlight */}
          <circle cx={45} cy={45} r={3} fill="#ffffff" />
        </g>
      );
    case "sun-rays":
      return (
        <g>
          <g stroke={accent} strokeWidth={7} strokeLinecap="round">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI * 2) / 12;
              const x1 = 50 + Math.cos(a) * 28;
              const y1 = 50 + Math.sin(a) * 28;
              const x2 = 50 + Math.cos(a) * 46;
              const y2 = 50 + Math.sin(a) * 46;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
          <circle cx={50} cy={50} r={22} fill={fill} />
        </g>
      );
    case "wave-pair":
      return (
        <g fill="none" strokeLinecap="round" strokeWidth={9}>
          <path
            d="M 6 36 Q 28 16 50 36 T 96 36"
            stroke={fill}
          />
          <path
            d="M 6 64 Q 28 84 50 64 T 96 64"
            stroke={accent}
          />
        </g>
      );
    case "striped-rect":
      return (
        <g>
          <rect x={6} y={6} width={88} height={88} fill={fill} />
          <g fill={accent}>
            {Array.from({ length: 5 }).map((_, i) => (
              <rect
                key={i}
                x={6}
                y={10 + i * 18}
                width={88}
                height={8}
              />
            ))}
          </g>
        </g>
      );
    case "burst-dot":
      return (
        <g>
          <g stroke={fill} strokeWidth={8} strokeLinecap="round">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI * 2) / 12;
              const x1 = 50 + Math.cos(a) * 22;
              const y1 = 50 + Math.sin(a) * 22;
              const x2 = 50 + Math.cos(a) * 46;
              const y2 = 50 + Math.sin(a) * 46;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
          <circle cx={50} cy={50} r={16} fill={accent} />
        </g>
      );
    case "striped-circle":
      return (
        <g>
          <circle cx={50} cy={50} r={40} fill={fill} />
          <g fill={accent}>
            {[18, 36, 54, 72].map((y) => (
              <rect key={y} x={10} y={y} width={80} height={6} />
            ))}
          </g>
        </g>
      );
    case "flower":
      return (
        <g>
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 6 - Math.PI / 2;
            const cx = 50 + Math.cos(a) * 24;
            const cy = 50 + Math.sin(a) * 24;
            return <circle key={i} cx={cx} cy={cy} r={20} fill={fill} />;
          })}
          <circle cx={50} cy={50} r={14} fill={accent} />
        </g>
      );
    case "smile":
      return (
        <g>
          <circle cx={50} cy={50} r={40} fill={fill} />
          <circle cx={36} cy={42} r={5} fill="#1a1a1a" />
          <circle cx={64} cy={42} r={5} fill="#1a1a1a" />
          <path
            d="M30 60 Q 50 80 70 60"
            fill="none"
            stroke={accent}
            strokeWidth={6}
            strokeLinecap="round"
          />
        </g>
      );
    case "checkered":
      return (
        <g>
          <rect x={6} y={6} width={88} height={88} fill={fill} />
          <g fill={accent}>
            {[0, 1, 2, 3].flatMap((r) =>
              [0, 1, 2, 3]
                .filter((c) => (r + c) % 2 === 0)
                .map((c) => (
                  <rect
                    key={`${String(r)}-${String(c)}`}
                    x={6 + c * 22}
                    y={6 + r * 22}
                    width={22}
                    height={22}
                  />
                )),
            )}
          </g>
        </g>
      );
    case "tag":
      // Sticker-tag silhouette with a small accent-color hole.
      return (
        <g>
          <path
            d="M14 30 L50 8 L86 30 L86 84 L14 84 Z"
            fill={fill}
          />
          <circle cx={50} cy={28} r={5} fill={accent} />
        </g>
      );
  }
}
