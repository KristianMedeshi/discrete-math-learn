const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'ua'],
  directory: `${__dirname}/translations`,
  defaultLocale: 'en',
  objectNotation: true,
});

module.exports = i18n;
