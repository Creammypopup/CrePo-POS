import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  // รับค่า username และ password จาก request
  const { username, password } = req.body;

  // ค้นหาผู้ใช้ด้วย username ในฐานข้อมูล
  const user = await User.findOne({ username });

  // ตรวจสอบว่ามีผู้ใช้และรหัสผ่านตรงกันหรือไม่
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, role } = req.body;

  if (!name || !username || !email || !password) {
    res.status(400);
    throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  const userExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error('อีเมลนี้มีผู้ใช้งานแล้ว');
  }

  if (usernameExists) {
    res.status(400);
    throw new Error('ชื่อผู้ใช้งานนี้มีผู้ใช้งานแล้ว');
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
    role: role || 'user', // Default role
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('ข้อมูลผู้ใช้ไม่ถูกต้อง');
  }
});


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('ไม่พบข้อมูลผู้ใช้');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).populate('role', 'name');
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'ลบผู้ใช้เรียบร้อยแล้ว' });
  } else {
    res.status(404);
    throw new Error('ไม่พบข้อมูลผู้ใช้');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate('role');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('ไม่พบข้อมูลผู้ใช้');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    user.isAdmin = req.body.isAdmin;
    user.role = req.body.role || user.role;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      isAdmin: updatedUser.isAdmin,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('ไม่พบข้อมูลผู้ใช้');
  }
});


export {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
