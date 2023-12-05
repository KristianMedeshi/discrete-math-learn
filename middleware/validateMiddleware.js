module.exports = (validator) => async (req, res, next) => {
  const validated = await validator.validateAsync(req.body);
  req.body = validated;
  next();
};
