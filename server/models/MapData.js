// models/MapData.js
import mongoose from 'mongoose';
import MarkerSchema from './MarkerSchema.js';

const mapDataSchema = new mongoose.Schema({
  polygon: {
    type: Object, // Full GeoJSON Polygon
    required: true
  },
  markers: { type: [MarkerSchema], default: [] },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MapData = mongoose.model('MapData', mapDataSchema);
export default MapData;
