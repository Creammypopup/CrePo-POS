// server/controllers/stockController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

// @desc    Adjust stock for a product or variant
// @route   POST /api/stock/adjust
// @access  Private
const adjustStock = asyncHandler(async (req, res) => {
    const { productId, sizeId, adjustment, notes } = req.body;
    
    if (!productId || adjustment === undefined) {
        res.status(400);
        throw new Error('กรุณาระบุสินค้าและจำนวนที่ต้องการปรับ');
    }

    const product = await Product.findById(productId);
    if (!product || product.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('ไม่พบสินค้า');
    }

    const adjValue = Number(adjustment);
    if (isNaN(adjValue)) {
        res.status(400);
        throw new Error('จำนวนที่ปรับต้องเป็นตัวเลข');
    }

    if (sizeId) {
        // Adjusting a specific variant/size
        const size = product.sizes.id(sizeId);
        if (!size) {
            res.status(404);
            throw new Error('ไม่พบขนาดสินค้าย่อย');
        }
        size.stock += adjValue;
    } else {
        // Adjusting a standard product
        product.stock += adjValue;
    }

    await product.save();

    // Create stock movement record
    await StockMovement.create({
        user: req.user.id,
        product: productId,
        sizeId: sizeId || null,
        type: adjValue > 0 ? 'adjustment-add' : 'adjustment-remove',
        quantity: adjValue,
        notes,
    });
    
    res.status(200).json(product);
});


// @desc    Get stock history for a product
// @route   GET /api/stock/history/:productId
// @access  Private
const getStockHistory = asyncHandler(async (req, res) => {
    const history = await StockMovement.find({ user: req.user.id, product: req.params.productId })
        .sort({ createdAt: -1 });
    res.json(history);
});


module.exports = {
    adjustStock,
    getStockHistory,
};