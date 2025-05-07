// models/MarkerSchema.js
import mongoose from 'mongoose';

const MarkerSchema = new mongoose.Schema({
  latlng: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  name: { type: String, default: '' },
  type: { type: String, default: '' },
  number: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrl: { type: String }
}, { _id: false });

export default MarkerSchema;
