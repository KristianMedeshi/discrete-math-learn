const Joi = require('joi');

const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const passwordMessage = 'Password must be at least 8 characters long and contain at least one digit, one lowercase, and one uppercase letter.';

module.exports.signUp = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),

  password: Joi.string()
    .pattern(passwordPattern)
    .message(passwordMessage)
    .required(),

  name: Joi.object({
    first: Joi.string().required(),
    last: Joi.string().required(),
  }),

  cardNumber: Joi.string()
    .pattern(/^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/),

  cardCvv: Joi.number()
    .integer()
    .min(100)
    .max(9999),

  cardExpiry: Joi.string()
    .pattern(/^(0[1-9]|1[0-2]) \/ \d{2}$/),
}).unknown(false);

module.exports.signIn = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),

  password: Joi.string()
    .pattern(passwordPattern)
    .message(passwordMessage)
    .required(),
}).unknown(false);

module.exports.updateMyInfo = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 }),

  firstName: Joi.string().required(),

  lastName: Joi.string().required(),

  currentPassword: Joi.string()
    .when('newPassword', { is: Joi.exist(), then: Joi.required() })
    .pattern(passwordPattern)
    .message(passwordMessage),

  newPassword: Joi.string()
    .pattern(passwordPattern)
    .message(passwordMessage),

  cardNumber: Joi.string()
    .pattern(/^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/),

  cardCvv: Joi.number()
    .integer()
    .min(100)
    .max(9999),

  cardExpiry: Joi.string()
    .pattern(/^(0[1-9]|1[0-2]) \/ \d{2}$/),

  image: Joi.object({
    data: Joi.binary().required(),
    filename: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
    size: Joi.number().max(5242880).required(),
  }),
}).allow(false);
