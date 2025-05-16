// models/MarkerTab.js
import mongoose from 'mongoose';

export const MarkerTabSchema = new mongoose.Schema({
  title:       { type: String, trim: true },
  description: { type: String, trim: true },
  imageUrl:    { type: String, trim: true }
}, { _id: false });