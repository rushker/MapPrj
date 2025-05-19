// models/Area.js
import mongoose from 'mongoose';

const MarkerTabSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'MarkerTab title is required'],
    trim: true,
  },
  image: {
    type: String,
    validate: {
      validator: v => !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(v),
      message: props => `${props.value} is not a valid image URL!`,
    },
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
});

const MarkerSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: [true, 'Marker latitude required'],
    min: -90,
    max: 90,
  },
  lng: {
    type: Number,
    required: [true, 'Marker longitude required'],
    min: -180,
    max: 180,
  },
  title: {
    type: String,
    required: [true, 'Marker title required'],
    trim: true,
  },
  tabs: {
    type: [MarkerTabSchema],
    default: [],
  },
});

const SubPolygonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'SubPolygon name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  coordinates: {
    type: [[[Number]]], // Array of array of array of numbers (GeoJSON Polygon)
    required: [true, 'SubPolygon coordinates required'],
    validate: {
      validator: coords => Array.isArray(coords) && coords.length > 0,
      message: 'Coordinates must be a non-empty array',
    },
  },
});

const AreaSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Area name is required'],
    trim: true,
  },
  polygon: {
    type: {
      type: String,
      enum: ['Polygon'],
      default: 'Polygon',
    },
    coordinates: {
      type: [[[Number]]],
      required: [true, 'Polygon coordinates are required'],
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
  markers: {
    type: [MarkerSchema],
    default: [],
  },
  subPolygons: {
    type: [SubPolygonSchema],
    default: [],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Area', AreaSchema);

