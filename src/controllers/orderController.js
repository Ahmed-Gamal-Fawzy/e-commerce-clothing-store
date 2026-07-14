const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middlewares/asyncHandler');


// 1. Create a new order
// POST /api/orders
exports.createOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { shippingAddress, phone, paymentMethod } = req.body;

  // get the cart items from the database
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Your cart is empty. Add items before checking out.'
    });
  }

  // check if the quantity is available in stock
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({
        status: 'fail',
        message: `Sorry, the product "${product ? product.title : 'Unknown'}" is out of stock or doesn't have enough quantity.`
      });
    }
  }

  // decrease the stock from the database
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity } 
    });
  }

  // create the order in the database
  const order = await Order.create({
    user: userId,
    items: cart.items,
    totalPrice: cart.totalPrice,
    shippingAddress,
    phone,
    paymentMethod
  });

  // empty the cart
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    status: 'success',
    data: order
  });
});

// 2. display the current user's orders (history of orders)
// GET /api/orders
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders
  });
});

// 3. update order status (for admin only to change the status from pending to shipped for example)
// PATCH /api/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ status: 'fail', message: 'No order found with this ID' });
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    status: 'success',
    data: order
  });
});

// 4. cancel order and restocking to stock
// PATCH /api/orders/:id/cancel
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({
      status: 'fail',
      message: 'No order found with this ID'
    });
  }

  // if user is not admin and the order is not by him
  if (userRole !== 'admin' && order.user.toString() !== userId) {
    return res.status(403).json({
      status: 'fail',
      message: 'You do not have permission to cancel this order.'
    });
  }

  // check if the order can be cancelled
  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({
      status: 'fail',
      message: `Cannot cancel order because it is already ${order.status}`
    });
  }

  // restocking: add the items back to stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }

  // update order status to cancelled
  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order cancelled successfully and stock has been updated.',
    data: order
  });
});