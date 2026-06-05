import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Turn a Sanity hotspot (x/y as 0–1 fractions) into a CSS
// object-position so `object-cover` crops around the focal point
// instead of the image center. Undefined when no hotspot is set.
export function hotspotPosition(
  hotspot?: { x: number; y: number } | null,
): string | undefined {
  if (!hotspot) return undefined;
  return `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`;
}
