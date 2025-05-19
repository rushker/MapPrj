// server.js (chính)
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
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Route theo phân vùng
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/areas', areaRoutes);
app.use('/api/areas/:areaId/entities', entityRoutes);
app.use('/api/media', mediaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
