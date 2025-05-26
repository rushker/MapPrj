// models/Entity.js
import mongoose from 'mongoose';

const entitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Entity name is required'],
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['marker', 'polygon', 'unknown'],
    default: 'unknown',
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point', 'Polygon'],
      required: true,
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (value) {
          if (this.geometry.type === 'Point') {
            return Array.isArray(value) && value.length === 2 && value.every(Number.isFinite);
          }
          if (this.geometry.type === 'Polygon') {
            return Array.isArray(value) && value.length > 0;
          }
          return false;
        },
        message: 'Invalid geometry coordinates',
      },
    },
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: arr =>
        arr.every(url => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url)),
      message: 'One or more image URLs are invalid',
    },
  },
  areaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    required: [true, 'Area ID is required'],
  },
}, {
  timestamps: true,
});
entitySchema.index({ geometry: '2dsphere' }); 
export default mongoose.model('Entity', entitySchema);
