// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextTranslate = require('next-translate-plugin');

module.exports = nextTranslate({
  i18n: {
    // These are all the locales you want to support in your application
    locales: ['en', 'fr', 'nl'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'nl',
  },
});
