// models/Area.js
import mongoose from 'mongoose';

const AreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Khu chưa đặt tên', // Placeholder mặc định
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  opacity: {
    type: Number,
    default: 0.2,
    min: 0,
    max: 1,
  },
  lockedZoom: {
    type: Boolean,
    default: false,
  },
  polygon: {
    type: {
      type: String,
      enum: ['Polygon'],
      default: 'Polygon',
    },
    coordinates: {
      type: [[[Number]]], // Multi-ring polygon
      default: [], // User sẽ vẽ sau
    },
  },
  minZoom: {
    type: Number,
    default: 10,
    min: 0,
    max: 24,
  },
  maxZoom: {
    type: Number,
    default: 18,
    min: 0,
    max: 24,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index cho tìm kiếm theo tọa độ
AreaSchema.index({ polygon: '2dsphere' });

export default mongoose.model('Area', AreaSchema);
