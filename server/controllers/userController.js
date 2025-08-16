const asyncHandler = require('../middleware/asyncHandler.js');
const User = require('../models/User.js');
const generateToken = require('../utils/generateToken.js');

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      permissions: user.permissions,
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public (หรืออาจจะ Private/Admin ในอนาคต)
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('ชื่อผู้ใช้นี้มีผู้ใช้งานในระบบแล้ว');
  }

  const user = await User.create({
    name,
    username,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      permissions: user.permissions,
    });
  } else {
    res.status(400);
    throw new Error('ข้อมูลผู้ใช้ไม่ถูกต้อง');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'ออกจากระบบเรียบร้อย' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      permissions: user.permissions,
    });
  } else {
    res.status(404);
    throw new Error('ไม่พบผู้ใช้งาน');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      permissions: updatedUser.permissions,
    });
  } else {
    res.status(404);
    throw new Error('ไม่พบผู้ใช้งาน');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('ไม่พบผู้ใช้งาน');
  }
});

// @desc    Update user by ID (by Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.permissions = req.body.permissions || user.permissions;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      permissions: updatedUser.permissions,
    });
  } else {
    res.status(404);
    throw new Error('ไม่พบผู้ใช้งาน');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'ลบผู้ใช้เรียบร้อย' });
  } else {
    res.status(404);
    throw new Error('ไม่พบผู้ใช้งาน');
  }
});

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};