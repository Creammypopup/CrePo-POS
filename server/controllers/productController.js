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
  const { name, price, category } = req.body;
  if (!name || name.trim() === '') {
    res.status(400);
    throw new Error('กรุณากรอกชื่อสินค้า');
  }
  if (price === undefined || isNaN(price)) {
    res.status(400);
    throw new Error('กรุณากรอกราคาสินค้าให้ถูกต้อง');
  }
  const product = new Product({
    ...req.body,
    user: req.user._id,
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
    if (req.body.name !== undefined && req.body.name.trim() === '') {
      res.status(400);
      throw new Error('ชื่อสินค้าห้ามว่าง');
    }
    if (req.body.price !== undefined && isNaN(req.body.price)) {
      res.status(400);
      throw new Error('ราคาสินค้าต้องเป็นตัวเลข');
    }
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