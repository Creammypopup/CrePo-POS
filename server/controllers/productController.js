const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  // เราจะใช้ข้อมูลจาก req.body ที่ส่งมาจาก client
  const { name, image, description, brand, category, price, countInStock } = req.body;

  const product = new Product({
    name,
    price,
    user: req.user._id, // user id มาจาก middleware 'protect'
    image: image || '/images/sample.jpg', // ใส่รูปภาพ default ถ้าไม่มี
    brand,
    category,
    countInStock,
    description,
  });

  try {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'ข้อมูลสินค้าไม่ถูกต้อง', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'ไม่พบสินค้านี้' });
    }
  } catch (error) {
    res.status(400).json({ message: 'ข้อมูลสินค้าไม่ถูกต้อง', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // ใน Mongoose v6+ .remove() ถูกเอาออกไปแล้ว ให้ใช้ .deleteOne() หรือ .findByIdAndDelete()
            await Product.deleteOne({ _id: req.params.id });
            res.json({ message: 'สินค้าถูกลบแล้ว' });
        } else {
            res.status(404).json({ message: 'ไม่พบสินค้านี้' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};