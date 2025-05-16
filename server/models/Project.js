// models/Project.js
import mongoose from 'mongoose';
import { AreaSchema } from './Area.js';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  areas: { type: [AreaSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);