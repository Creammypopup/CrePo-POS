const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/productCategoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.route('/').get(authorize(PERMISSIONS.PRODUCTS_VIEW), getCategories).post(authorize(PERMISSIONS.PRODUCTS_MANAGE), createCategory);
router.route('/:id').delete(authorize(PERMISSIONS.PRODUCTS_MANAGE), deleteCategory);

module.exports = router;