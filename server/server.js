//server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import './config/cloudinary.js'; // Initialize Cloudinary
import mapRoutes from './routes/mapRoutes.js';
import mapAreaRoutes from './routes/mapAreaRoutes.js';

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Setup
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Health Check
app.get('/', (req, res) => {
  res.send('🗺️ Map Project API is running.');
});

// Routes
app.use('/api/maps', mapRoutes);
app.use('/api/map-areas', mapAreaRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
