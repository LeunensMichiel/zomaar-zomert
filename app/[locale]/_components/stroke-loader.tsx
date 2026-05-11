import { cn } from "@lib/utils";

const STROKE_PATH =
  "M63.2093 43.0917L137.51 40.5994L52.1302 111.359L232.573 41.2719L46.9445 163.596L220.386 74.8238L23.2239 225.272L425.018 16.0246L10.2916 303.448L325.238 140.553L157.491 258.867L269.449 247.26";

export function StrokeLoader({ className }: { className?: string }) {
  return (
    <div className={cn("animate-doodle-paint-stroke-loop", className)}>
      <svg
        viewBox="0 0 435.309 319.496"
        fill="none"
        className="h-auto w-full"
        aria-label="Loading"
        role="status"
      >
        <defs>
          <linearGradient
            id="stroke-loader-gradient"
            x1="333.494"
            y1="292.474"
            x2="298.472"
            y2="52.2879"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFB600" />
            <stop offset="1" stopColor="#FF7BAC" />
          </linearGradient>
        </defs>
        <path
          d={STROKE_PATH}
          stroke="url(#stroke-loader-gradient)"
          strokeWidth="36.1349"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
