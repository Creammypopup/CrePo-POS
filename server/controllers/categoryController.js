// server/controllers/categoryController.js
const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    Get all categories for a user
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });
    res.status(200).json(categories);
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
    const { name, source } = req.body;

    if (!name || !source) {
        res.status(400);
        throw new Error('Please provide name and source for the category');
    }

    // Check if category already exists for this user
    const categoryExists = await Category.findOne({ user: req.user.id, name });
    if (categoryExists) {
        res.status(400);
        throw new Error(`Category "${name}" already exists.`);
    }

    const category = await Category.create({
        user: req.user.id,
        name,
        source,
    });

    res.status(201).json(category);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    // Make sure user owns the category
    if (category.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await category.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
};