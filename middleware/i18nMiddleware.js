const accepts = require('accepts');
const i18n = require('../i18n');

module.exports = (req, res, next) => {
  const accept = accepts(req);
  const locale = accept.language(i18n.getLocales());
  i18n.setLocale(locale);
  next();
};
