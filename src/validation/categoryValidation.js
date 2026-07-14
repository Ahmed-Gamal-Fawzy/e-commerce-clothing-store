const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'category name cannot be empty',
    'string.min': 'category name should have at least 3 characters',
    'any.required': 'category name is a required field'
  }),
  description: Joi.string().max(200).allow('') 
});

module.exports = {
  createCategorySchema
};