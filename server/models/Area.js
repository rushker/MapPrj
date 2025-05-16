// models/Area.js
import mongoose from 'mongoose';
import { MarkerSchema } from './Marker.js';

export const AreaSchema = new mongoose.Schema({
  areaId:       { type: String, required: true },
  title:        { type: String, required: true, trim: true },
  polygon: {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], required: true }
  },
  subPolygons: { type: [ { 
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], required: true },
    metadata: {
      name: { type: String, trim: true },
      description: { type: String, trim: true }
    }
  } ], default: [] },
  markers:    { type: [MarkerSchema], default: [] },
  isPublished: { type: Boolean, default: false }
}, { _id: false });