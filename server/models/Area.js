// models/Area.js
import mongoose from 'mongoose';

const AreaSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Khu chưa đặt tên',  // Default placeholder name
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
      type: [[[Number]]],
      default: [],  // Allow empty, user will draw later
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

AreaSchema.index({ projectId: 1 });           // Index for queries
AreaSchema.index({ polygon: '2dsphere' });     // Geospatial index

export default mongoose.model('Area', AreaSchema);
