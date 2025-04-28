//server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import './config/cloudinary.js'; // Configures Cloudinary on import
import mapRoutes from './routes/mapRoutes.js';
import areaRoutes from './routes/areaRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();


const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API Routes
app.use('/api/maps', mapRoutes);
app.use('/api/areas', areaRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});