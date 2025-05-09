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

// 🌐 CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⛔️ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// 🧩 Middlewares
app.use(express.json());

// 📦 API Routes
app.use('/api/maps', mapRoutes);
app.use('/api/map-areas', mapAreaRoutes);

// ❌ Error Handling Middleware
app.use(errorHandler);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const vercelURL = process.env.VERCEL_URL || null;
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const hostInfo = vercelURL
    ? `${protocol}://${vercelURL}`
    : `${protocol}://localhost:${PORT}`;

  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
  console.log(`📍 API Endpoints:`);
  console.log(`   • ${hostInfo}/api/maps`);
  console.log(`   • ${hostInfo}/api/map-areas`);
});
