const Joi = require('joi');

module.exports.signUp = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),

  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .message('Password must be at least 8 characters long and contain at least one digit, one lowercase, and one uppercase letter.')
    .required(),

  name: Joi.object({
    first: Joi.string().required(),
    last: Joi.string().required(),
  }),

  card: Joi.object({
    number: Joi.string()
      .pattern(/^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/),

    cvv: Joi.number()
      .integer()
      .min(100)
      .max(9999),

    expiry: Joi.string()
      .pattern(/^(0[1-9]|1[0-2]) \/ \d{2}$/),
  }),
}).unknown(false);

module.exports.signIn = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),

  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .message('Password must be at least 8 characters long and contain at least one digit, one lowercase, and one uppercase letter.')
    .required(),
}).unknown(false);

module.exports.updateMyInfo = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 }),

  name: Joi.object({
    first: Joi.string(),
    last: Joi.string(),
  }),

  currentPassword: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .message('Password must be at least 8 characters long and contain at least one digit, one lowercase, and one uppercase letter.'),

  newPassword: Joi.when('currentPassword', {
    is: Joi.exist(),
    then: Joi.string()
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .message('Password must be at least 8 characters long and contain at least one digit, one lowercase, and one uppercase letter.')
      .required(),
    otherwise: Joi.forbidden(),
  }),

  image: Joi.object({
    data: Joi.binary().required(),
    filename: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
    size: Joi.number().max(5242880).required(),
  }),
}).allow(false);
