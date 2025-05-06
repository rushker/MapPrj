// models/MapData.js
import mongoose from 'mongoose';

const markerSchema = new mongoose.Schema({
  coordinates: {
    type: [Number], // [lng, lat]
    required: true
  },
  name: String,
  type: String,
  number: String,
  description: String,
  imageUrl: String
});

const mapDataSchema = new mongoose.Schema({
  polygon: {
    type: Object, // Store full GeoJSON Polygon
    required: true
  },
  markers: [markerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MapData = mongoose.model('MapData', mapDataSchema);
export default MapData;
