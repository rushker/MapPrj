import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cloudinary from './config/cloudinary.js'; // Already configured instance
import mapRoutes from './routes/mapRoutes.js'; 

dotenv.config();
connectDB(); // Ensure the database is connected


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/maps', mapRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
