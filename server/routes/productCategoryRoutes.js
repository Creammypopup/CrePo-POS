const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/productCategoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

// router.use(protect);

router.route('/').get(getCategories).post(createCategory);
router.route('/:id').delete(deleteCategory);

module.exports = router;