const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');
const { PERMISSIONS } = require('../utils/permissions.js');

router.use(protect);

router.route('/')
  .get(authorize(PERMISSIONS.CATEGORIES_VIEW), getCategories)
  .post(authorize(PERMISSIONS.CATEGORIES_MANAGE), createCategory);

router.route('/:id')
  .get(authorize(PERMISSIONS.CATEGORIES_VIEW), getCategoryById)
  .put(authorize(PERMISSIONS.CATEGORIES_MANAGE), updateCategory)
  .delete(authorize(PERMISSIONS.CATEGORIES_MANAGE), deleteCategory);

module.exports = router;