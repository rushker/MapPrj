//server.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import mapRoutes from './routes/mapRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use('/api/maps', mapRoutes);

// ⚠️ Always after routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
