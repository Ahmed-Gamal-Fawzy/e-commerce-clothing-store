const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middlewares/asyncHandler');

// calc total price
const calculateTotalPrice = (cart) => {
  cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// POST /api/cart

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity, color, size } = req.body;
  const userId = req.user.id; 

  // check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      status: 'fail',
      message: 'No product found with this ID'
    });
  }

  // check if the requested color is available for this product
  const isColorAvailable = product.colors.some(c => c.toLowerCase() === color.toLowerCase());
  if (!isColorAvailable) {
    return res.status(400).json({
      status: 'fail',
      message: `Selected color '${color}' is not available for this product. Available colors: ${product.colors.join(', ')}`
    });
  }

  // check if the requested size is available for this product
  const isSizeAvailable = product.sizes.some(s => s.toLowerCase() === size.toLowerCase());
  if (!isSizeAvailable) {
    return res.status(400).json({
      status: 'fail',
      message: `Selected size '${size}' is not available for this product. Available sizes: ${product.sizes.join(', ')}`
    });
  }

  // check if quantity is available in stock
  if (product.stock < quantity) {
    return res.status(400).json({
      status: 'fail',
      message: `Only ${product.stock} items available in stock`
    });
  }

  // check if cart exists
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  // check if product with same color and size exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.color === color && item.size === size
  );

  if (existingItemIndex > -1) {
    // the product exists with the same color and size -> increase quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // a new product or with different specifications -> add it as a new item
    cart.items.push({
      product: productId,
      quantity,
      color,
      size,
      price: product.price 
    });
  }

  // calc total price
  calculateTotalPrice(cart);
  await cart.save();

  res.status(201).json({
    status: 'success',
    message: 'Item added to cart successfully',
    data: cart
  });
});

// get the cart items
// GET /api/cart
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'title brand');

  if (!cart) {
    return res.status(200).json({
      status: 'success',
      message: 'Your cart is empty',
      data: { items: [], totalPrice: 0 }
    });
  }

  res.status(200).json({
    status: 'success',
    data: cart
  });
});


// remove item from cart
// DELETE /api/cart/:itemId
exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({ status: 'fail', message: 'Cart not found' });
  }

  // filter items to remove the required item
  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

  calculateTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    data: cart
  });
});