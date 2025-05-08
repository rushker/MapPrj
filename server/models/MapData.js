// models/MapData.js
import mongoose from 'mongoose';
import { MarkerSchema } from './MarkerSchema.js';

const MapDataSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  polygon: {
    type: { type: String, enum: ['Polygon'], required: true },
    coordinates: {
      type: [[[Number]]], // [[[lng, lat], ...]]
      required: true
    }
  },
  markers:     { type: [MarkerSchema], default: [] }
}, {
  timestamps: true
});

MapDataSchema.index({ polygon: '2d sphere' });

export default mongoose.model('MapData', MapDataSchema);
