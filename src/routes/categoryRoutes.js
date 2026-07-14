const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories } = require('../controllers/categoryController');
const validate = require('../middlewares/validate');
const { createCategorySchema } = require('../validation/categoryValidation');


router.post('/',validate(createCategorySchema), createCategory);
router.get('/', getAllCategories);

module.exports = router;