// server/app.js
const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const cors = require('cors');
const notificationService = require('./services/notificationService');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Routes ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/proxy', require('./routes/proxyRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/product-categories', require('./routes/productCategoryRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/pawns', require('./routes/pawnRoutes'));
app.use('/api/shifts', require('./routes/shiftRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/purchase-orders', require('./routes/purchaseOrderRoutes')); // <-- ADD THIS LINE

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'dist', 'index.html'));
  });
} else {
    app.get('/', (req, res) => {
        res.status(200).json({ message: 'Welcome to the CrePo POS API' });
    });
}

app.use(errorHandler);
notificationService.start();

app.listen(port, () => console.log(`Server is running with 3D power on Port ${port}`));