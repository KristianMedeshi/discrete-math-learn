module.exports = (req, res, next) => {
  req.body = Object.entries(req.body).reduce((acc, [key, value]) => {
    const keys = key.split('.');
    keys.reduce((nestedObj, nestedKey, index) => {
      if (!nestedObj[nestedKey]) {
        nestedObj[nestedKey] = {};
      }
      if (index === keys.length - 1) {
        nestedObj[nestedKey] = value;
      }
      return nestedObj[nestedKey];
    }, acc);
    return acc;
  }, {});
  next();
};
