// server/models/ProductCategory.js
const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
  },
}, {
  timestamps: true,
});

productCategorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('ProductCategory', productCategorySchema);