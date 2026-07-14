const Category = require('../models/Category');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ message: 'this category already exists' });
  }

  const newCategory = await Category.create({ name, description });
  
  res.status(201).json({
    status: 'success',
    data: newCategory
  });
});

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const categories = await Category.find().skip(skip).limit(limit);
  const totalCategories = await Category.countDocuments();

  res.status(200).json({
    status: 'success',
    page: page,
    limit: limit,
    total_pages: Math.ceil(totalCategories / limit),
    total_results: totalCategories,
    current_results: categories.length,
    data: categories
  });
});