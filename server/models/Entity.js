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
    trim: true,
    default: 'unknown',
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point', 'Polygon'],
      required: [true, 'Geometry type is required'],
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Geometry coordinates required'],
      validate: {
        validator: function(value) {
          if (this.geometry.type === 'Point') {
            return Array.isArray(value) && value.length === 2 && value.every(c => typeof c === 'number');
          }
          if (this.geometry.type === 'Polygon') {
            return Array.isArray(value) && value.length > 0;
          }
          return false;
        },
        message: 'Invalid coordinates for geometry',
      }
    },
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: arr => arr.every(url => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url)),
      message: 'One or more image URLs are invalid',
    }
  },
  parentAreaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    required: [true, 'Parent Area ID is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Entity', entitySchema);

