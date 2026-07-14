const express = require('express');
const router = express.Router();

const { createOrder, getMyOrders, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');


// all routes needs authentication
router.use(protect);

// client routes: create order and get my orders
router.route('/')
  .post(createOrder)
  .get(getMyOrders);

// admin route: update order status (processing, shipped, etc)
router.patch('/:id/status', restrictTo('admin'), updateOrderStatus);

// client route: cancel order
router.patch('/:id/cancel', cancelOrder);

module.exports = router;