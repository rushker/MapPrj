// models/MapArea.js
import mongoose from 'mongoose';

const MarkerSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  name: String,
  type: String,
  imageUrl: String,
});

const MapAreaSchema = new mongoose.Schema({
  name: { type: String, default: 'Untitled Area' },
  polygon: { type: Object, required: true }, // GeoJSON Polygon
  markers: [MarkerSchema], // editable later
  createdAt: { type: Date, default: Date.now },
  isFinalized: { type: Boolean, default: false }, // true = uploaded to public viewer
});

export default mongoose.model('MapArea', MapAreaSchema);
