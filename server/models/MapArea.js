// models/MapArea.js
import mongoose from 'mongoose';

const mapAreaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  coordinates: { type: Array, default: [] },
}, { timestamps: true });

export default mongoose.model('MapArea', mapAreaSchema);

