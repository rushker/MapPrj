// models/MapArea.js
import mongoose from 'mongoose';

const mapAreaSchema = new mongoose.Schema({
  mapId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Map', required: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  coordinates: { type: Array, default: [] },
  imageUrl:    { type: String, default: '' }, // optional image per area
}, { timestamps: true });

export default mongoose.model('MapArea', mapAreaSchema);

