const Joi = require('joi');

// create user validation
exports.signupSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .trim(),

  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim(),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    })
});

// login user validation
exports.loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim(),

  password: Joi.string()
    .required()
});