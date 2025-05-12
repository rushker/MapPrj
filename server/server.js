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
const FRONTEND_URL = process.env.ALLOWED_ORIGINS || 'https://map-prj.vercel.app';

app.listen(PORT, () => {
  console.log('\n✅ Server is up and running!');
  console.log(`🛠  Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   ↳ ${FRONTEND_URL}/basemap`);
  console.log(`   ↳ ${FRONTEND_URL}/edit`);
  console.log(`   ↳ ${FRONTEND_URL}`);
});


