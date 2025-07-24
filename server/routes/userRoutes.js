const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post('/', registerUser);

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
router.post('/login', loginUser);

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, getMe);

module.exports = router;
