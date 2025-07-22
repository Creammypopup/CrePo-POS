// D:\CrePo-POS\server\controllers\customerController.js
const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Public (for now, will add auth later)
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Public (for now)
exports.createCustomer = async (req, res) => {
  const { name, phone, email, address } = req.body;

  // Basic validation
  if (!name) {
    return res.status(400).json({ message: 'Customer name is required.' });
  }

  try {
    const newCustomer = new Customer({
      name,
      phone,
      email,
      address,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ message: 'Email already exists. Please use a unique email.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Public (for now)
exports.updateCustomer = async (req, res) => {
  const { id } = req.params; // Customer ID from URL parameter
  const { name, phone, email, address } = req.body;

  try {
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.name = name || customer.name;
    customer.phone = phone !== undefined ? phone : customer.phone;
    customer.email = email !== undefined ? email : customer.email;
    customer.address = address !== undefined ? address : customer.address;

    const updatedCustomer = await customer.save();
    res.status(200).json(updatedCustomer);
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ message: 'Email already exists. Please use a unique email.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Public (for now)
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params; // Customer ID from URL parameter

  try {
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
