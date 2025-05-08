//server.js
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import mapAreaRoutes from './routes/mapAreaRoutes.js';
import mapRoutes     from './routes/mapRoutes.js';
import './config/cloudinary.js';

await connectDB();
const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false, limit: '2mb' }));

// CORS: Allow your Vercel domain
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}));

app.get('/', (req, res) => res.send('🗺️ Map API is running'));

// **Private** (unlinked) — Basemap & Edit pages
app.use('/api/map-areas', mapAreaRoutes);

// **Public** (Viewer)
app.use('/api/maps', mapRoutes);

// Global error handler…
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
