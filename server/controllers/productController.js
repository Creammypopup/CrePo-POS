const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (needs authentication)
 */
const createProduct = asyncHandler(async (req, res) => {
  // ดึงข้อมูลจาก request body ที่ส่งมาจาก client
  const { name, description, category, baseUnit, productType, sizes, primarySupplier } = req.body;

  // ตรวจสอบข้อมูลเบื้องต้น
  if (!name || !category || !baseUnit) {
    res.status(400);
    throw new Error('กรุณากรอกข้อมูลที่จำเป็น: ชื่อ, หมวดหมู่, และหน่วยนับหลัก');
  }

  // สร้างสินค้าใหม่ใน database
  const product = await Product.create({
    user: req.user.id, // เราจะเพิ่ม req.user เข้ามาใน middleware ของการยืนยันตัวตนทีหลัง
    name,
    description,
    category,
    baseUnit,
    productType,
    sizes,
    primarySupplier,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error('ข้อมูลสินค้าไม่ถูกต้อง');
  }
});

/**
 * @desc    Get all products for a user
 * @route   GET /api/products
 * @access  Private
 */
const getProducts = asyncHandler(async (req, res) => {
  // สามารถเพิ่มการค้นหาและแบ่งหน้าได้ในภายหลัง
  const products = await Product.find({ user: req.user.id })
    .populate('category', 'name')
    .populate('primarySupplier', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(products);
});

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Private
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .populate('primarySupplier', 'name');

  if (!product) {
    res.status(404);
    throw new Error('ไม่พบสินค้า');
  }

  // ตรวจสอบว่าสินค้าเป็นของผู้ใช้ที่ล็อกอินอยู่
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('ไม่ได้รับอนุญาตให้เข้าถึงข้อมูลนี้');
  }

  res.status(200).json(product);
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('ไม่พบสินค้า');
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('ไม่ได้รับอนุญาตให้แก้ไขข้อมูลนี้');
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category', 'name').populate('primarySupplier', 'name');

  res.status(200).json(updatedProduct);
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('ไม่พบสินค้า');
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('ไม่ได้รับอนุญาตให้ลบข้อมูลนี้');
  }

  // ข้อควรระวัง: ในระบบจริง เราอาจไม่ควรลบสินค้าที่มีประวัติการขาย
  // แต่อาจจะเปลี่ยนสถานะเป็น 'archived' แทน
  await product.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'ลบสินค้าเรียบร้อยแล้ว' });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};