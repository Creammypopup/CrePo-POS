const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Private (Admin)
const registerUser = asyncHandler(async (req, res) => {
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

    const user = await User.create({
        name,
        username,
        password,
        role,
    });

    if (user) {
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
  const { username, password } = req.body;
  const user = await User.findOne({ username }).populate('role');

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

// --- START OF EDIT: เพิ่มฟังก์ชันที่จำเป็น ---

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).populate('role', 'name'); // ดึงข้อมูล role มาด้วย
    res.status(200).json(users);
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;
    if (req.body.password) {
        user.password = req.body.password; // Mongoose 'pre-save' hook will hash it
    }

    const updatedUser = await user.save();
    // Populate role info before sending back
    await updatedUser.populate('role', 'name');

    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        role: updatedUser.role,
    });
});


// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Prevent admin from deleting themselves
    if(user._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot delete your own account');
    }

    await user.deleteOne();

    res.status(200).json({ id: req.params.id });
});

// --- END OF EDIT ---


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,     // <-- export
  updateUser,   // <-- export
  deleteUser,   // <-- export
};