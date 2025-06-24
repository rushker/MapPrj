//models/locationSchema.js
import mongoose from 'mongoose';
// Subschema cho marker
const locationSchema = new mongoose.Schema({
 displayName: { type: String, required: true },         // Ví dụ: "123 Lý Thường Kiệt, Quận 10, TP.HCM"
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  address: {
    road: String,
    suburb: String,
    city: String,
    state: String,
    postcode: String,
    country: String,
    country_code: String,
  },
}, { _id: false });

export default locationSchema;
