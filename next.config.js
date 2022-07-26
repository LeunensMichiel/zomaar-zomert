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

module.exports = nextConfig;
