// models/Area.js
import mongoose from 'mongoose';

const AreaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, default: 'Khu chưa đặt tên' },
  description: { type: String, default: '', trim: true },
  type: { type: String, trim: true, default: '' },

  strokeColor: {
    type: Object,
    default: { r: 51, g: 136, b: 255, a: 1 },
  },
  strokeOpacity: {
    type: Number,
    default: 1,
    min: 0,
    max: 1,
  },
  fillColor: {
    type: Object,
    default: { r: 255, g: 0, b: 0, a: 0.4 },
  },
  fillOpacity: {
    type: Number,
    default: 0.4,
    min: 0,
    max: 1,
  },

  opacity: { type: Number, default: 0.2, min: 0, max: 1 },
  lockedZoom: { type: Boolean, default: false },
  polygon: {
    type: {
      type: String,
      enum: ['Polygon'],
      default: 'Polygon',
    },
    coordinates: {
      type: [[[Number]]],
      default: [],
    },
  },
  minZoom: { type: Number, default: 10, min: 0, max: 24 },
  maxZoom: { type: Number, default: 18, min: 0, max: 24 },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });


// Index cho tìm kiếm theo tọa độ
AreaSchema.index({ polygon: '2dsphere' });

export default mongoose.model('Area', AreaSchema);
