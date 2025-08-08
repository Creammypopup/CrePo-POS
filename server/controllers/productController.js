const Product = require('../models/Product.js');
const asyncHandler = require('../middleware/asyncHandler.js');

/**
 * @desc    Fetch all products
 * @route   GET /api/products
 * @access  Private
 */
const getProducts = asyncHandler(async (req, res) => {
  // .populate() จะดึงข้อมูลชื่อจาก collection ที่เกี่ยวข้องมาด้วย (Category และ Supplier)
  const products = await Product.find({})
    .populate('category', 'name')
    .populate('supplier', 'name');
  res.json(products);
});

/**
 * @desc    Fetch a single product by ID
 * @route   GET /api/products/:id
 * @access  Private
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .populate('supplier', 'name');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('ไม่พบสินค้า');
  }
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    ...req.body,
    user: req.user._id, // ผูกสินค้ากับผู้ใช้ที่สร้างโดยอัตโนมัติ
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // อัปเดตข้อมูลทั้งหมดที่ส่งมาจาก req.body อย่างมีประสิทธิภาพ
    Object.assign(product, req.body);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('ไม่พบสินค้า');
  }
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'ลบสินค้าเรียบร้อยแล้ว' });
  } else {
    res.status(404);
    throw new Error('ไม่พบสินค้า');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};