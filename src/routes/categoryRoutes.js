const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories } = require('../controllers/categoryController');
const validate = require('../middlewares/validate');
const { createCategorySchema } = require('../validation/categoryValidation');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Product category management
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Men's Clothing
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 */
router.post('/',validate(createCategorySchema), createCategory);
router.get('/', getAllCategories);

module.exports = router;