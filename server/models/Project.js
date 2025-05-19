// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  areas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area'
    }
  ]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
