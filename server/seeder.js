const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Role = require('./models/Role');
const Product = require('./models/Product');
const Category = require('./models/Category');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('MongoDB Connected for Seeder...'.cyan);
    } catch (err) {
        console.error(`Error: ${err.message}`.red.bold);
        process.exit(1);
    }
};

const createPasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const importData = async () => {
    try {
        // Clear existing data
        await Role.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany(); // Clear old products
        console.log('Old data destroyed...'.red.inverse);

        // Create Roles
        const roles = await Role.create([
            { name: 'Admin', permissions: ['view_dashboard', 'manage_pos', 'view_receipts', 'manage_invoices', 'manage_quotations', 'manage_expenses', 'manage_products', 'manage_stock_adjustments', 'manage_purchase_orders', 'manage_contacts', 'view_reports', 'manage_accounting', 'view_calendar', 'manage_users', 'manage_roles', 'manage_settings'] },
            { name: 'Manager', permissions: ['view_dashboard', 'manage_pos', 'view_receipts', 'manage_invoices', 'manage_quotations', 'manage_expenses', 'manage_products', 'manage_stock_adjustments', 'manage_purchase_orders', 'manage_contacts', 'view_reports', 'view_calendar'] },
            { name: 'Employee', permissions: ['view_dashboard', 'manage_pos', 'view_receipts', 'manage_expenses', 'view_calendar'] }
        ]);
        const adminRole = roles[0];
        console.log('Roles Imported...'.green.inverse);

        // Create a default Admin User
        const users = await User.create([
            {
                name: 'ผู้ดูแลระบบ',
                username: 'POP',
                password: await createPasswordHash('123456'),
                role: adminRole._id,
                permissions: adminRole.permissions
            }
        ]);
        const adminUser = users[0];
        console.log('Default Admin User Imported...'.green.inverse);

        // Create default categories for the admin user
        await Category.create([
            { user: adminUser._id, name: 'ค่าเดินทาง', source: 'กำไร' },
            { user: adminUser._id, name: 'ค่าอาหารและเครื่องดื่ม', source: 'กำไร' },
            { user: adminUser._id, name: 'ค่าวัตถุดิบ', source: 'ทุน' },
            { user: adminUser._id, name: 'เงินเดือน/ค่าจ้าง', source: 'กำไร' },
        ]);
        console.log('Default Categories Imported...'.green.inverse);

        // Create Sample Products
        await Product.create([
            { user: adminUser._id, name: 'ปูน TPI แดง', category: 'ปูนและวัสดุก่อ', cost: 120, price: 150, stock: 50, mainUnit: 'ถุง', stockAlert: 10 },
            { user: adminUser._id, name: 'สีทาบ้าน TOA (ขาว)', category: 'สีและเคมีภัณฑ์', cost: 850, price: 990, stock: 20, mainUnit: 'ถัง', stockAlert: 5 },
            { user: adminUser._id, name: 'ท่อ PVC 4 นิ้ว', category: 'เครื่องมือช่าง', cost: 65, price: 80, stock: 100, mainUnit: 'เส้น' },
            { user: adminUser._id, name: 'ถุงมือผ้า', category: 'เครื่องมือช่าง', productType: 'gift', cost: 5, price: 10, stock: 200, mainUnit: 'คู่' }
        ]);
        console.log('Sample Products Imported...'.blue.inverse);


        console.log('Data Imported!'.cyan.inverse);
        process.exit();
    } catch (err) {
        console.error(`${err}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Role.deleteMany();
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(`${err}`.red.inverse);
        process.exit(1);
    }
};

const runSeeder = async () => {
    await connectDB();
    if (process.argv[2] === '-d') {
        await destroyData();
    } else {
        await importData();
    }
};

runSeeder();