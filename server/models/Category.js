// server/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
  source: {
    type: String,
    required: [true, 'Please specify a source (ทุน or กำไร)'],
    enum: ['ทุน', 'กำไร'],
    default: 'กำไร',
  },
}, {
  timestamps: true,
});

// Prevent duplicate category names for the same user
categorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);