import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Routes
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
// Correctly import the named 'router' export from calendarRoutes.js
import { router as calendarRoutes } from './routes/calendarRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import customerRoutes from './routes/customerRoutes.js';
// import saleRoutes from './routes/saleRoutes.js';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/calendar', calendarRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/sales', saleRoutes);


// --- Production Build Configuration ---
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}


// --- Custom Error Handling ---
// This must be BELOW all the API routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
