const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const { createProduct, getAllProducts, deleteProduct } = require('../controllers/productController');
const validate = require('../middlewares/validate');
const { createProductSchema } = require('../validation/productValidation');
const { uploadProductImage } = require('../middlewares/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cotton T-Shirt
 *               price:
 *                 type: number
 *                 example: 250
 *               category:
 *                 type: string
 *                 example: 64f1c2e5b3f1a2d3c4e5f6a7
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       403:
 *         description: Forbidden, admin only
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.post('/', 
    protect, 
    restrictTo('admin'), 
    uploadProductImage,
    validate(createProductSchema), 
    createProduct);
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;
