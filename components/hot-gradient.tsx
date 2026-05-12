import { cn } from "@lib/utils";

/**
 * The "hot-sunset" brand gradient — `brand-900 → brand-500 → pink-400`,
 * positioned `absolute inset-0`. Used as a saturated base under the
 * navbar menu, and as an opacity-reduced tint under the hero and
 * footer overlays. Compose intensity via `className` (e.g.
 * `opacity-50`, `opacity-25`).
 */
export function HotGradient({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "from-brand-900 via-brand-500 absolute inset-0 bg-linear-to-br to-pink-400",
        className,
      )}
    />
  );
}
