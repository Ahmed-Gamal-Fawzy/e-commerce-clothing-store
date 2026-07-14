const express = require('express');
const router = express.Router();

const { addToCart, getCart, removeItemFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { addToCartSchema } = require('../validation/cartValidation');

router.use(protect);

// get the cart items and add item to cart
// GET & POST /api/cart
router.route('/')
  .get(getCart)
  .post(validate(addToCartSchema), addToCart);

// remove item from cart using the item ID
// DELETE /api/cart/:itemId
router.delete('/:itemId', removeItemFromCart);

module.exports = router;