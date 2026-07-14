const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const { createProduct, getAllProducts, deleteProduct } = require('../controllers/productController');
const validate = require('../middlewares/validate');
const { createProductSchema } = require('../validation/productValidation');
const { uploadProductImage } = require('../middlewares/uploadMiddleware');

router.post('/', 
    protect, 
    restrictTo('admin'), 
    uploadProductImage,
    validate(createProductSchema), 
    createProduct);
router.get('/', getAllProducts);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;
