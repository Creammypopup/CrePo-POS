const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Role = require('./models/Role');
const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Expense = require('./models/Expense');
const Sale = require('./models/Sale');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {});

// Hash password function
const createPasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const importData = async () => {
    try {
        // Clear existing data
        await Role.deleteMany();
        await User.deleteMany();
        console.log('Old data destroyed...'.red.inverse);

        // --- Create Roles ---
        const roles = await Role.create([
            { name: 'Admin', permissions: ['view_dashboard', 'manage_pos', 'view_receipts', 'manage_invoices', 'manage_quotations', 'manage_expenses', 'manage_products', 'manage_stock_adjustments', 'manage_purchase_orders', 'manage_contacts', 'view_reports', 'manage_accounting', 'view_calendar', 'manage_users', 'manage_roles', 'manage_settings'] },
            { name: 'Manager', permissions: ['view_dashboard', 'manage_pos', 'view_receipts', 'manage_invoices', 'manage_quotations', 'manage_expenses', 'manage_products', 'manage_stock_adjustments', 'manage_purchase_orders', 'manage_contacts', 'view_reports', 'view_calendar'] },
            { name: 'Employee', permissions: ['view_dashboard', 'manage_pos', 'view_receipts', 'manage_expenses', 'view_calendar'] }
        ]);
        const adminRole = roles[0];
        console.log('Roles Imported...'.green.inverse);

        // --- Create a default Admin User ---
        const users = await User.create([
            {
                name: 'Admin User', // ชื่อที่ใช้แสดงผล
                username: 'admin', // ชื่อผู้ใช้สำหรับเข้าระบบ
                email: 'admin@example.com',
                password: await createPasswordHash('123456'), // รหัสผ่านคือ 123456
                role: adminRole._id
            }
        ]);
        console.log('Default Admin User Imported...'.green.inverse);

        console.log('Data Imported!'.cyan.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Role.deleteMany();
        await User.deleteMany();
        await Product.deleteMany();
        await Customer.deleteMany();
        await Expense.deleteMany();
        await Sale.deleteMany();
        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
