const express = require('express');
const router = express.Router();

const { addToCart, getCart, removeItemFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { addToCartSchema } = require('../validation/cartValidation');

router.use(protect);
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management (requires authentication)
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64f1c2e5b3f1a2d3c4e5f6a7
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Validation error
 */
// get the cart items and add item to cart
// GET & POST /api/cart
router.route('/')
  .get(getCart)
  .post(validate(addToCartSchema), addToCart);
/**
 * @swagger
 * /api/cart/{itemId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cart item to remove
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Item not found
 */
// remove item from cart using the item ID
// DELETE /api/cart/:itemId
router.delete('/:itemId', removeItemFromCart);

module.exports = router;