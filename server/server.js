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
const allowedOrigins = [
  ...new Set([ // Remove duplicates
    ...process.env.ALLOWED_ORIGINS?.split(',').map(url => url.trim()) || [],
    'https://map-prj.vercel.app',
    'https://map-24rqknbxa-rushkers-projects.vercel.app'
  ].filter(Boolean))
];

app.use(cors({
  origin: (origin, callback) => {
    const isAllowed = !origin || allowedOrigins.some(allowed => 
      origin === allowed || 
      origin.startsWith(allowed) ||
      origin.includes(allowed.replace(/https?:\/\//, ''))
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⛔️ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// 🧩 Middlewares
app.use(express.json({ limit: '10mb' })); // For GeoJSON data

// 📦 API Routes
app.use('/api/maps', mapRoutes);
app.use('/api/map-areas', mapAreaRoutes);

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy' }));

// ❌ Error Handling Middleware
app.use(errorHandler);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
const baseFrontendUrl = allowedOrigins[0] || 'https://map-prj.vercel.app';

app.listen(PORT, () => {
  console.log('\n=== Server Startup Information ===');
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Port: ${PORT}`);
  console.log(`🌍 Base URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
  
  console.log('\n=== Frontend Pages on Vercel ===');
  console.log(`🖥️  Homepage: ${baseFrontendUrl}`);
  console.log(`🗺️ Basemap: ${baseFrontendUrl}/basemap`);
  console.log(`✏️ Editor: ${baseFrontendUrl}/edit`);
  console.log(`👨‍💻 Admin: ${baseFrontendUrl}/admin`);
  
  console.log('\n=== API Endpoints ===');
  console.log(`📍 /api/maps`);
  console.log(`📍 /api/map-areas`);
  console.log('\n🔒 Allowed Origins:');
  allowedOrigins.forEach(origin => console.log(`- ${origin}`));
});
