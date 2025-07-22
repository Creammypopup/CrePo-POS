// D:\CrePo-POS\server\controllers\saleController.js

const Sale = require('../models/Sale');
const Product = require('../models/Product'); // ต้องใช้ Product model เพื่ออัปเดตสต็อก

// @desc    Get all sales
// @route   GET /api/sales
// @access  Public
const getSales = async (req, res) => {
  try {
    // Populate customer และ product details
    const sales = await Sale.find({})
      .populate('customer', 'name contact') // ดึงเฉพาะ name และ contact ของ customer
      .populate('products.product', 'name price'); // ดึงเฉพาะ name และ price ของ product ในรายการ
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single sale by ID
// @route   GET /api/sales/:id
// @access  Public
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer', 'name contact')
      .populate('products.product', 'name price');
    if (sale) {
      res.status(200).json(sale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new sale
// @route   POST /api/sales
// @access  Public
const createSale = async (req, res) => {
  const { customerId, products } = req.body; // products เป็น array ของ { productId, quantity }

  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'At least one product is required for a sale' });
  }

  let totalAmount = 0;
  const productsForSale = [];

  try {
    // ตรวจสอบสินค้าและคำนวณราคารวม
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` });
      }

      productsForSale.push({
        product: product._id,
        quantity: item.quantity,
        priceAtSale: product.price, // บันทึกราคา ณ เวลาที่ขาย
      });
      totalAmount += product.price * item.quantity;

      // ลดสต็อกสินค้า
      product.stock -= item.quantity;
      await product.save();
    }

    const sale = new Sale({
      customer: customerId || null, // หากไม่มี customerId ให้เป็น null
      products: productsForSale,
      totalAmount: totalAmount,
    });

    const createdSale = await sale.save();
    res.status(201).json(createdSale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a sale (อาจไม่จำเป็นต้องใช้บ่อยในการใช้งานจริง)
// @route   DELETE /api/sales/:id
// @access  Public
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (sale) {
      // คืนสต็อกสินค้ากลับก่อนลบรายการขาย
      for (const item of sale.products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
      await sale.deleteOne();
      res.status(200).json({ message: 'Sale removed and stock restored' });
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSales,
  getSaleById,
  createSale,
  deleteSale,
};
