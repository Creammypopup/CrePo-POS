// server/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected
router.use(protect);

router.route('/')
    .get(getCategories)
    .post(createCategory);

router.route('/:id')
    .delete(deleteCategory);

module.exports = router;