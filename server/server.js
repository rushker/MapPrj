// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import mapRoutes from './routes/mapRoutes.js';
import mapAreaRoutes from './routes/mapAreaRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ======================
// 🌐 CORS Configuration
// ======================
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ======================
// 🧩 Core Middleware
// ======================
app.use(express.json());

// ======================
// 📦 Routes
// ======================
app.use('/api/maps', mapRoutes);
app.use('/api/map-areas', mapAreaRoutes);

// ======================
// ❌ Error Handling
// ======================
app.use(errorHandler);

// ======================
// 🚀 Server Start
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
