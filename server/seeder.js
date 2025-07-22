const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Role = require('./models/Role');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Clear existing data
    await Role.deleteMany();
    await User.deleteMany();

    // 2. Create all permissions list
    const allPermissions = [
        'dashboard-view', 'pos-access', 'sales-docs-view', 'quotations-manage',
        'invoices-manage', 'receipts-manage', 'purchase-docs-view', 'expenses-manage',
        'purchase-orders-manage', 'accounting-view', 'chart-of-accounts-manage',
        'journal-manage', 'products-view', 'products-manage', 'stock-adjustments-manage',
        'contacts-manage', 'reports-view', 'settings-access', 'users-manage',
        'roles-manage', 'theme-settings-manage', 'general-settings-manage'
    ];

    // 3. Create the main 'admin' role with all permissions
    const adminRole = await Role.create({
      name: 'admin',
      permissions: allPermissions,
    });

    // 4. Create the 'cashier' role with limited permissions
    await Role.create({
        name: 'cashier',
        permissions: ['pos-access'],
    });

    // 5. Create the Super Admin user ('Pop')
    await User.create({
      name: 'ชยาภรณ์ ทัศนบรรจง',
      username: 'Pop',
      password: 'Pop.za310', // Note: This will be hashed automatically by the model later
      role: adminRole._id,
    });

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    // ... (logic to destroy data if needed)
}

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
