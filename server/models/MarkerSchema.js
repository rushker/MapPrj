// models/MarkerSchema.js
import mongoose from 'mongoose';

export const MarkerSchema = new mongoose.Schema({
  latlng: {
    type: { type: String, default: 'Point', enum: ['Point'] },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
      validate: {
        validator: arr => arr.length === 2,
        message: "Coordinates must be [lng, lat]"
      }
    }
  },
  name:        { type: String, trim: true, default: '' },
  type:        { type: String, trim: true, default: '' },
  number:      { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  imageUrl:    { type: String, trim: true }
}, { _id: false });

export default MarkerSchema;
