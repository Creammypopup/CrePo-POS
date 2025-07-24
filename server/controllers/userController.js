const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Private (Admin)
const registerUser = asyncHandler(async (req, res) => {
    // Correctly destructure username from req.body
    const { name, username, password, role } = req.body;

    if (!name || !username || !password || !role) {
        res.status(400);
        throw new Error('Please include all fields: name, username, password, role');
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(400);
        throw new Error('Username already exists');
    }

    // Password will be hashed by the pre-save hook in User.js
    const user = await User.create({
        name,
        username,
        password,
        role,
    });

    if (user) {
        // Don't send token on registration from admin panel
        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            role: user.role,
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
  // --- START OF EDIT ---
  const { username, password } = req.body;

  // Find user by username
  const user = await User.findOne({ username }).populate('role');
  // --- END OF EDIT ---

  // Check user and passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username, 
      role: user.role ? user.role.name : 'No role assigned',
      permissions: user.role ? user.role.permissions : [],
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  }
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    // req.user is populated with role from the 'protect' middleware
    const user = req.user;
    if (user) {
        res.status(200).json({
            id: user._id,
            username: user.username,
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