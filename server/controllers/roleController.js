const Role = require('../models/Role');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private/Admin
const createRole = async (req, res) => {
  const { name, permissions } = req.body;

  if (!name || !permissions) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  try {
    const roleExists = await Role.findOne({ name });
    if (roleExists) {
      return res.status(400).json({ message: 'มีตำแหน่งนี้อยู่แล้ว' });
    }

    const role = await Role.create({
      name,
      permissions,
    });

    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Private/Admin
const updateRole = async (req, res) => {
    const { name, permissions } = req.body;
    try {
        const role = await Role.findById(req.params.id);
        if(role) {
            role.name = name || role.name;
            role.permissions = permissions || role.permissions;
            const updatedRole = await role.save();
            res.status(200).json(updatedRole);
        } else {
            res.status(404).json({ message: 'ไม่พบตำแหน่งนี้' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if(role) {
            await Role.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'ลบตำแหน่งเรียบร้อย' });
        } else {
            res.status(404).json({ message: 'ไม่พบตำแหน่งนี้' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};
