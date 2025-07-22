const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// This function handles user registration with special logic for the first admin.
const registerUser = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    if (!name || !username || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
    }

    const userCount = await User.countDocuments();
    let userRole;

    if (userCount === 0) {
      // Logic for the very first user.
      userRole = await Role.findOne({ name: 'admin' });
      if (!userRole) {
        // Hardcode all permissions directly on the server. This is safe and reliable.
        const allPermissions = [
            'dashboard-view', 'pos-access', 'sales-docs-view', 'quotations-manage',
            'invoices-manage', 'receipts-manage', 'purchase-docs-view', 'expenses-manage',
            'purchase-orders-manage', 'accounting-view', 'chart-of-accounts-manage',
            'journal-manage', 'products-view', 'products-manage', 'stock-adjustments-manage',
            'contacts-manage', 'reports-view', 'settings-access', 'users-manage',
            'roles-manage', 'theme-settings-manage', 'general-settings-manage'
        ];
        userRole = await Role.create({ name: 'admin', permissions: allPermissions });
      }
    } else {
        // Logic for subsequent users created by an admin.
        const { role } = req.body; // Expecting role ID
        if (!role) {
            return res.status(400).json({ message: 'ไม่ได้ระบุตำแหน่งสำหรับผู้ใช้ใหม่' });
        }
        userRole = await Role.findById(role);
        if (!userRole) {
            return res.status(404).json({ message: 'ไม่พบตำแหน่งที่ระบุ' });
        }
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      role: userRole._id,
    });

    const populatedUser = await User.findById(user._id).populate('role');
    res.status(201).json(populatedUser);

  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดบน Server', error: error.message });
  }
};

// --- START OF DEFINITIVE FIX: Added all missing functions ---
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).populate('role');
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดบน Server', error: error.message });
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).populate('role', 'name');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.role = req.body.role || user.role;
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }
            const updatedUser = await user.save();
            const populatedUser = await User.findById(updatedUser._id).populate('role', 'name');
            res.status(200).json(populatedUser);
        } else {
            res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await User.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'ลบผู้ใช้งานเรียบร้อย' });
        } else {
            res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// --- END OF DEFINITIVE FIX ---

module.exports = { 
    registerUser, 
    loginUser, 
    getMe,
    getUsers,
    updateUser,
    deleteUser
};
