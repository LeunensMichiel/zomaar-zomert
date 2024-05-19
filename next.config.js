import nextTranslate from 'next-translate-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const translatedConfig = nextTranslate({
  i18n: {
    // These are all the locales you want to support in your application
    locales: ['en', 'fr', 'nl'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'nl',
  },
  ...nextConfig,
});

export default translatedConfig;
