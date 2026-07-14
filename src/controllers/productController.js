const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc Create a new product
// @route POST /api/products
// @access Public
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { title, description, price, brand, colors, sizes, stock, category } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return res.status(404).json({
      status: 'fail',
      message: 'No category found with this ID'
    });
  }

  let imagePath;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  const newProduct = await Product.create({
    title,
    description,
    price,
    brand,
    colors,
    sizes,
    stock,
    category,
    image: imagePath
  });

  res.status(201).json({
    status: 'success',
    data: newProduct
  });
});

// @desc Get all products
// @route GET /api/products
// @access Public
// Get all products with filtering, search, sorting, and pagination
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  // 1) Copying and normalizing the query (handling both flat 'price[gte]' and nested 'price: { gte }' styles)
  const queryObj = {};
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];

  Object.keys(req.query).forEach(key => {
    if (excludedFields.includes(key)) return;

    // Check if key is formatted as field[operator] (e.g., price[gte])
    const regMatch = key.match(/^(\w+)\[(\w+)\]$/);
    if (regMatch) {
      const [, field, operator] = regMatch;
      if (!queryObj[field]) queryObj[field] = {};
      queryObj[field][operator] = req.query[key];
    } else {
      queryObj[key] = req.query[key];
    }
  });

  // 2) advanced filtering (prices or ratings)
  Object.keys(queryObj).forEach(key => {
    if (typeof queryObj[key] === 'object' && queryObj[key] !== null) {
      Object.keys(queryObj[key]).forEach(operator => {
        // Remove trailing slash if present (e.g., "1/" from URL typos)
        if (typeof queryObj[key][operator] === 'string') {
          queryObj[key][operator] = queryObj[key][operator].replace(/\/$/, '');
        }
        // If the value is a number, convert it to a real number
        if (queryObj[key][operator] !== '' && !isNaN(queryObj[key][operator])) {
          queryObj[key][operator] = Number(queryObj[key][operator]);
        }
      });
      
    } else {
      // Remove trailing slash if present
      if (typeof queryObj[key] === 'string') {
        queryObj[key] = queryObj[key].replace(/\/$/, '');
      }
      // Convert to number if it is a number
      if (queryObj[key] !== '' && !isNaN(queryObj[key])) {
        queryObj[key] = Number(queryObj[key]);
      }
    }
  });

  // 3) convert symbols to mongodb syntax using replace
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
  let query = Product.find(JSON.parse(queryStr));

  // 4) text search by name or brand
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i'); // 'i' means Case-insensitive
    query = query.find({
      $or: [
        { title: searchRegex },
        { brand: searchRegex },
        { description: searchRegex }
      ]
    });
  }

  // 5) sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 6) pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const totalProducts = await Product.countDocuments(JSON.parse(queryStr));
  const products = await query.populate('category', 'name');

  res.status(200).json({
    status: 'success',
    results: products.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalResults: totalProducts
    },
    data: products
  });
});


// @desc Delete a product
// @route DELETE /api/products/:id
// @access Public
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return res.status(404).json({
      status: 'fail',
      message: 'No product found with this ID'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully'
  });
});
