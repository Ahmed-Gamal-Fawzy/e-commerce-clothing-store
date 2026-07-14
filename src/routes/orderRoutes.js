const express = require('express');
const router = express.Router();

const { createOrder, getMyOrders, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');


// all routes needs authentication
router.use(protect);
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management (requires authentication)
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 */
// client routes: create order and get my orders
router.route('/')
  .post(createOrder)
  .get(getMyOrders);
/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated
 *       403:
 *         description: Forbidden, admin only
 */
// admin route: update order status (processing, shipped, etc)
router.patch('/:id/status', restrictTo('admin'), updateOrderStatus);
/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       404:
 *         description: Order not found
 */
// client route: cancel order
router.patch('/:id/cancel', cancelOrder);

module.exports = router;