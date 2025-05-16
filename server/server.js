// server.js
import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import connectDB from './config/db.js';
import cloudinary from './config/cloudinary.js';
import projectRoutes from './routes/projectRoutes.js';
import areaRoutes from './routes/areaRoutes.js';
import viewmapRoutes from './routes/viewmapRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Connect to MongoDB
connectDB();

const app = express();

// CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/areas', areaRoutes);
app.use('/api/projects/:projectId/view', viewmapRoutes);
// Handle CORS errors more gracefully
app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200
  })
);
// Health check
app.get('/health', (_req, res) => res.status(200).json({ status: 'healthy' }));

// Error handler
app.use(errorHandler);

export default app;

// Start server if not in test env
if (config.nodeEnv !== 'test') {
  app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  });
}
