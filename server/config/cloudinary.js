// server/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

export default function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  // Test configuration
  cloudinary.api.ping()
    .then(() => console.log('Cloudinary connected'))
    .catch(err => console.error('Cloudinary connection failed:', err));

  return cloudinary;
}