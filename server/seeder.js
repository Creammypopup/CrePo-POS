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
const Category = require('./models/Category'); // <-- **เพิ่มบรรทัดนี้**

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('MongoDB Connected for Seeder...'.cyan);
    } catch (err) {
        console.error(`Error: ${err.message}`.red.bold);
        process.exit(1);
    }
};

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
        await Category.deleteMany(); // <-- **เพิ่มบรรทัดนี้**
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
                name: 'ผู้ดูแลระบบ', // ชื่อที่ใช้แสดงผล
                username: 'POP', // ชื่อผู้ใช้สำหรับเข้าระบบ
                password: await createPasswordHash('123456'), // รหัสผ่านคือ 123456
                role: adminRole._id
            }
        ]);
        const adminUser = users[0];
        console.log('Default Admin User Imported...'.green.inverse);

        // --- Create default categories for the admin user ---
        await Category.create([
            { user: adminUser._id, name: 'ค่าเดินทาง', source: 'กำไร' },
            { user: adminUser._id, name: 'ค่าอาหารและเครื่องดื่ม', source: 'กำไร' },
            { user: adminUser._id, name: 'ค่าวัตถุดิบ', source: 'ทุน' },
            { user: adminUser._id, name: 'เงินเดือน/ค่าจ้าง', source: 'กำไร' },
            { user: adminUser._id, name: 'ค่าเช่า', source: 'กำไร' },
            { user: adminUser._id, name: 'ค่าการตลาด', source: 'กำไร' },
            { user: adminUser._id, name: 'ค่าสาธารณูปโภค', source: 'กำไร' },
            { user: adminUser._id, name: 'อื่นๆ', source: 'กำไร' },
        ]);
        console.log('Default Categories Imported...'.green.inverse);


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
        await Customer.deleteMany();
        await Expense.deleteMany();
        await Sale.deleteMany();
        await Category.deleteMany(); // <-- **เพิ่มบรรทัดนี้**
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