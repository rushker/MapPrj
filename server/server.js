//server.js
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

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/areas', areaRoutes);
app.use('/api/areas/:areaId/entities', entityRoutes);
app.use('/api/media', mediaRoutes);

// Middleware xử lý route không tồn tại (404)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    // Có thể thêm stack khi đang dev:
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server running at ${BASE_URL}`);
});
