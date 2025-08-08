const Category = require('../models/Category.js');
const asyncHandler = require('../middleware/asyncHandler.js');

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) return res.json(category);
  res.status(404);
  throw new Error('ไม่พบหมวดหมู่');
});

// @desc    Create a category
// @route   POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = new Category({ name, description, user: req.user._id });
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('ไม่พบหมวดหมู่');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await Category.deleteOne({ _id: category._id });
    res.status(200).json({ message: 'ลบหมวดหมู่เรียบร้อยแล้ว' });
  } else {
    res.status(404);
    throw new Error('ไม่พบหมวดหมู่');
  }
});

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };