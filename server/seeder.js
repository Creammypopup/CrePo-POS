const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Role = require('./models/Role');
const Product = require('./models/Product');
const ProductCategory = require('./models/ProductCategory');
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

const importData = async () => {
    try {
        await Role.deleteMany();
        await User.deleteMany();
        await ProductCategory.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        console.log('Old data destroyed...'.red.inverse);

        const roles = await Role.create([
            { name: 'Admin', permissions: ['view_dashboard', 'manage_pos', 'view_receipts', 'manage_invoices', 'manage_quotations', 'manage_expenses', 'manage_products', 'manage_stock_adjustments', 'manage_purchase_orders', 'manage_contacts', 'view_reports', 'manage_accounting', 'view_calendar', 'manage_users', 'manage_roles', 'manage_settings'] },
            { name: 'Manager', permissions: ['view_dashboard', 'manage_pos', 'view_receipts', 'manage_invoices', 'manage_quotations', 'manage_expenses', 'manage_products', 'manage_stock_adjustments', 'manage_purchase_orders', 'manage_contacts', 'view_reports', 'view_calendar'] },
            { name: 'Employee', permissions: ['view_dashboard', 'manage_pos', 'view_receipts', 'manage_expenses', 'view_calendar'] }
        ]);
        const adminRole = roles[0];
        console.log('Roles Imported...'.green.inverse);

        // CORRECT WAY: Pass plain password and let the model hook handle hashing.
        const users = await User.create([
            {
                name: 'ผู้ดูแลระบบ',
                username: 'POP',
                password: '123456', // Plain text password
                role: adminRole._id,
            }
        ]);
        const adminUser = users[0];
        console.log('Default Admin User Imported...'.green.inverse);

        const prodCats = await ProductCategory.create([
            { user: adminUser._id, name: 'ปูนและวัสดุก่อ' },
            { user: adminUser._id, name: 'สีและเคมีภัณฑ์' },
            { user: adminUser._id, name: 'เครื่องมือช่าง' }
        ]);
        const [cementCat, paintCat, toolsCat] = prodCats;
        console.log('Product Categories Imported...'.green.inverse);

        await Product.create([
            {
                name: 'ปูน TPI แดง', productType: 'standard', category: cementCat._id,
                costPerStockUnit: 120, stockQuantity: 50, stockUnit: 'ถุง', reorderPoint: 10,
                sellingUnits: [{ name: 'ถุง', price: 150, stockConversionFactor: 1 }]
            },
            {
                name: 'สีทาบ้าน TOA (ขาว)', productType: 'standard', category: paintCat._id,
                costPerStockUnit: 850, stockQuantity: 20, stockUnit: 'ถัง', reorderPoint: 5,
                sellingUnits: [{ name: 'ถัง', price: 990, stockConversionFactor: 1 }]
            },
            {
                name: 'ท่อ PVC 4 นิ้ว', productType: 'standard', category: toolsCat._id,
                costPerStockUnit: 65, stockQuantity: 100, stockUnit: 'เส้น', reorderPoint: 0,
                sellingUnits: [{ name: 'เส้น', price: 80, stockConversionFactor: 1 }]
            },
            {
                name: 'ถุงมือผ้า', productType: 'standard', category: toolsCat._id,
                costPerStockUnit: 5, stockQuantity: 200, stockUnit: 'คู่', reorderPoint: 0,
                sellingUnits: [{ name: 'คู่', price: 10, stockConversionFactor: 1 }]
            }
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
        await ProductCategory.deleteMany();
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
