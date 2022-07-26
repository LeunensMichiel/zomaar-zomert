/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = withPlugins([[bundleAnalyzer]], nextConfig);
