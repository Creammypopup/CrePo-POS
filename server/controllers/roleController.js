const Role = require('../models/Role');
const asyncHandler = require('../middleware/asyncHandler.js');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find({});
  res.status(200).json(roles);
});

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private/Admin
const createRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;

  if (!name || !permissions) {
    res.status(400);
    throw new Error('กรุณากรอกข้อมูลให้ครบ');
  }

  const roleExists = await Role.findOne({ name });
  if (roleExists) {
    res.status(400);
    throw new Error('มีตำแหน่งนี้อยู่แล้ว');
  }

  const role = await Role.create({
    name,
    permissions,
  });

  res.status(201).json(role);
});

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Private/Admin
const updateRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;
  const role = await Role.findById(req.params.id);
  if (role) {
    role.name = name || role.name;
    role.permissions = permissions || role.permissions;
    const updatedRole = await role.save();
    res.status(200).json(updatedRole);
  } else {
    res.status(404);
    throw new Error('ไม่พบตำแหน่งนี้');
  }
});

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (role) {
    await Role.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'ลบตำแหน่งเรียบร้อย' });
  } else {
    res.status(404);
    throw new Error('ไม่พบตำแหน่งนี้');
  }
});

module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};
