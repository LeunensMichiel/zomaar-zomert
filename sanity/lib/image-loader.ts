import { type ImageLoaderProps } from "next/image";

/**
 * Next.js Image loader that builds Sanity CDN URLs with on-the-fly
 * resize + auto format. Apply via the `loader` prop on `<Image>` so
 * the browser hits `cdn.sanity.io` directly instead of routing image
 * bytes through `/_next/image` (which counts against Netlify bandwidth).
 *
 * Skips non-Sanity sources (e.g. local /public assets) by returning
 * the original URL untouched — those still go through Next's default
 * pipeline because `loader` is set per-image, not globally.
 */
export const sanityImageLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps) => {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
};
