import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Required for app/global-not-found.tsx — the project's root layout
    // sits under a top-level dynamic segment ([locale]), so a regular
    // app/not-found.tsx ends up nested inside [locale]/layout.tsx
    // during SPA navigation and causes hydration mismatches from the
    // duplicated html/body. globalNotFound bypasses the layout chain.
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
