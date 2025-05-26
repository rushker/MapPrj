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
      required: true,
      validate: {
        validator: coords => Array.isArray(coords) && coords.length > 0,
        message: 'Polygon coordinates must be a non-empty array',
      },
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
AreaSchema.index({ projectId: 1 }); // Index cho query theo project
AreaSchema.index({ polygon: '2dsphere' }); // Geospatial index cho polygon

export default mongoose.model('Area', AreaSchema);
