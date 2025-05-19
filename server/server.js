import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import projectRoutes from './routes/projects.js';
import areaRoutes from './routes/areas.js';
import entityRoutes from './routes/entities.js';
import mediaRoutes from './routes/media.js';

dotenv.config();
connectDB();

const app = express();

// CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/areas', areaRoutes);
app.use('/api/areas/:areaId/entities', entityRoutes);
app.use('/api/media', mediaRoutes);

// Start server
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server running at ${BASE_URL}`);
});

