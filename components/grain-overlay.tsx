import { cn } from "@lib/utils";

/**
 * Paper-grain noise tile — `menu-noise.svg` repeated at 256 px, with
 * `mix-blend-overlay`. Drops on top of any saturated atmosphere
 * (gradient + blobs) to add risograph print texture. Used by the
 * navbar menu, hero, and footer overlays. `className` accepts the
 * usual overrides (opacity, blend swap, …).
 */
export function GrainOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 mix-blend-overlay",
        className,
      )}
      style={{
        backgroundImage: "url(/assets/menu-noise.svg)",
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}
