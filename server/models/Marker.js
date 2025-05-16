// models/Marker.js
import mongoose from 'mongoose';
import { MarkerTabSchema } from './MarkerTab.js';

export const MarkerSchema = new mongoose.Schema({
  type:      { type: String, required: true }, // areaId
  latlng: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  metadata: {
    name:        { type: String, trim: true },
    description: { type: String, trim: true }
  },
  markerTabs:  { type: [MarkerTabSchema], default: [] }
}, { _id: false });