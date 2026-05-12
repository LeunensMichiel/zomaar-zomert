import { type ReactNode } from "react";

/**
 * Static gradient backdrop for the kinetic menu. A single drifting blob
 * sits over a hot-sunset gradient base, with a paper-grain overlay
 * biting texture into the whole thing. The blob and starburst animate
 * via CSS keyframes; the panel container in `navbar.tsx` owns the fade.
 */
export function MenuBackground({ starBurst }: { starBurst?: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="from-brand-900 via-brand-500 absolute inset-0 bg-linear-to-br to-pink-400" />

      <div className="bg-brand-700 animate-menu-blob-d absolute -bottom-32 -left-40 h-[55vh] w-[55vh] rounded-full blur-2xl" />

      {starBurst && (
        <div className="absolute top-1/2 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2">
          <div className="animate-doodle-spin-slow h-full w-full opacity-50 mix-blend-soft-light blur-xs">
            {starBurst}
          </div>
        </div>
      )}

      {/* Pre-rasterised noise tile — browser caches once after first
          paint. Replaces an inline feTurbulence filter that re-ran per
          frame on mobile compositors. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage: "url(/assets/menu-noise.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
}
