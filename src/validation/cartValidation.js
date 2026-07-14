const Joi = require('joi');


exports.addToCartSchema = Joi.object({
  productId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/) 
    .required()
    .messages({
      'string.pattern.base': 'Invalid Product ID format'
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .required(),

  color: Joi.string()
    .required()
    .trim(),

  size: Joi.string()
    .required()
    .trim()
});