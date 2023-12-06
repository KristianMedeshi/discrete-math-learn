module.exports = (req, res, next) => {
  Object.assign(req.body, JSON.parse(req.body.jsonData));
  delete req.body.jsonData;
  next();
};
