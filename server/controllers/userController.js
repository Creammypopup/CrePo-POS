const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, roleName } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  // Find if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Find role by name, or default to 'user'
  let userRole = await Role.findOne({ name: roleName || 'User' });
  if (!userRole) {
    userRole = await Role.create({ name: 'User', permissions: [] });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: userRole._id,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: userRole.name,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  // --- เปลี่ยนจาก email เป็น name ---
  const { name, password } = req.body;

  // --- ค้นหาผู้ใช้ด้วย name แทน email ---
  const user = await User.findOne({ name }).populate('role');

  // Check user and passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role ? user.role.name : 'No role assigned',
      permissions: user.role ? user.role.permissions : [],
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('role');
    if (user) {
        res.status(200).json({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role ? user.role.name : 'No role assigned',
            permissions: user.role ? user.role.permissions : [],
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
