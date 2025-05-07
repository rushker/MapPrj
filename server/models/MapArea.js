    // models/MapArea.js
import mongoose from 'mongoose';
import MarkerSchema from './MarkerSchema.js';

const PolygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Feature'],
    required: true,
    default: 'Feature'
  },
  geometry: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]], // GeoJSON coordinates
      required: true
    }
  },
  properties: {
    type: Object,
    default: {}
  }
}, { _id: false });

const MapAreaSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Untitled Area' },
  polygon: { type: PolygonSchema, required: true },
  markers: { type: [MarkerSchema], default: [] },
  isFinalized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MapArea', MapAreaSchema);
