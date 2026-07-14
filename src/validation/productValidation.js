const Joi = require('joi');

const createProductSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'any.required': 'product title is required'
  }),
  description: Joi.string().min(10).max(1000).required().messages({
    'any.required': 'product description is required'
  }),
  price: Joi.number().positive().required().messages({
    'any.required': 'product price is required',
    'number.min': 'product price cannot be less than zero'
  }),
  brand: Joi.string().required().messages({
    'any.required': 'product brand is required'
  }),

  colors: Joi.array().items(Joi.string().required()).min(1).required().messages({
    'any.required': 'at least one color is required'
  }),
  sizes: Joi.array().items(Joi.string().required()).min(1).required().messages({
    'any.required': 'at least one size is required'
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'any.required': 'product stock quantity is required',
    'number.min': 'stock cannot be negative'
  }),

  image: Joi.any().optional().default('default-product.jpg'),
  
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'invalid category ID format',
    'any.required': 'category ID is required'
  })
});

module.exports = {
  createProductSchema
};