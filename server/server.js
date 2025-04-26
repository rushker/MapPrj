// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import configureCloudinary from './config/cloudinary.js';
import mapRoutes from './routes/mapRoutes.js';
import errorHandler from './middlewares/errorHandler.js'; // <-- đúng folder 'middlewares'

dotenv.config();

const app = express();

// Connect services
await configureCloudinary();
await connectDB();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));
app.use('/api/maps', mapRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Listening on port ${PORT}`);
});
