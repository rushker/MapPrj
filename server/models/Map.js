import mongoose from 'mongoose';

const mapSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  fileUrl:     { type: String, required: true },    // PDF/PNG/JPG
  bounds:      { type: Array, default: [] },        // e.g. [[0,0],[1000,1000]]
}, { timestamps: true });

export default mongoose.model('Map', mapSchema);
