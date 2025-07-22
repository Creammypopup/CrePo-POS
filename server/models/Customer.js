// D:\CrePo-POS\server\models\Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: true, // Email should be unique
    sparse: true // Allows null values to not violate unique constraint
  },
  address: {
    type: String,
    required: false,
  },
  // You can add more fields as needed, e.g., customer type, tax ID, etc.
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Customer', customerSchema);
