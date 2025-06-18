// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import apiRoutes from './routes/index.js';
import { ROUTES } from './utils/routes.js'; // Giữ lại nếu cần cho redirect

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// API routes (sử dụng router tổng từ index.js)
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API route not found',
    availableRoutes: Object.keys(ROUTES).map(key => ROUTES[key])
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
  ✅ Listening on port ${PORT}
  🌐 Allowed origins: ${process.env.ALLOWED_ORIGINS || 'all'}
  `);
});