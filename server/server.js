const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

// Import routes
const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const supplierRoutes = require('./routes/supplierRoutes.js');
const expenseRoutes = require('./routes/expenseRoutes.js');
const roleRoutes = require('./routes/roleRoutes.js');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- Middlewares ---

// Enable CORS - Allows requests from your frontend
app.use(cors());

// Set security headers for protection against common vulnerabilities
app.use(helmet());

// Body parser for JSON
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/roles', roleRoutes);

// --- Error Handling Middleware (must be the last middleware) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);