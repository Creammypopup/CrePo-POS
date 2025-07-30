const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Private (Admin)
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, password, role } = req.body; // เอา email ออก

  if (!name || !username || !password || !role) { // เอา email ออกจาก validation
    res.status(400);
    throw new Error("Please include all fields");
  }

  const userExists = await User.findOne({ username }); // ค้นหาจาก username อย่างเดียว

  if (userExists) {
    res.status(400);
    throw new Error("มีชื่อผู้ใช้นี้อยู่แล้ว");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    username,
    password: hashedPassword,
    role, // role ที่ส่งมาจาก frontend
  });

  if (user) {
    // ไม่ต้องส่ง token กลับไป เพราะเป็นการสร้างโดย Admin
    const populatedUser = await User.findById(user._id).populate('role').select('-password');
    res.status(201).json(populatedUser);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).populate('role');

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  }
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    name: req.user.name,
    username: req.user.username,
    role: req.user.role,
  };
  res.status(200).json(user);
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate("role").select("-password");
  res.status(200).json(users);
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const { name, username, role, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.role = role || user.role;

    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('role').select('-password');

    res.status(200).json(populatedUser);
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    await user.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'User removed' });
});

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUser,
  deleteUser,
};