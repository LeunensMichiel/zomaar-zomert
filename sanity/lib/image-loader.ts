/**
 * Global Next.js Image loader, wired in next.config.js via
 * `images.loader: 'custom'` + `images.loaderFile`. Next.js imports
 * this directly — passing it as a prop would fail across the
 * server/client boundary.
 *
 * - Sanity URLs get on-the-fly resize + auto format so browsers fetch
 *   from cdn.sanity.io and skip the /_next/image Netlify hop.
 * - Anything else (local /public assets) passes through untouched.
 */
type LoaderArgs = { src: string; width: number; quality?: number };

export default function sanityImageLoader({
  src,
  width,
  quality,
}: LoaderArgs): string {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
}
