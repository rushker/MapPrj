// models/MapArea.js
import mongoose from 'mongoose';
import { MarkerSchema } from './MarkerSchema.js';

const MapAreaSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, default: 'Untitled Area' },
  polygon: {
    type: { type: String, enum: ['Polygon'], required: true },
    coordinates: {
      type: [[[Number]]], // [[[lng, lat], ...]]
      required: true
    }
  },
  markers:     { type: [MarkerSchema], default: [] },
  isFinalized: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Create 2d sphere index for geo queries
MapAreaSchema.index({ polygon: '2d sphere' });

export default mongoose.model('MapArea', MapAreaSchema);
