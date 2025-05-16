// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import config from './index.js';

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudApiKey,
  api_secret: config.cloudApiSecret,
});

console.log('Cloudinary configured successfully');
export default cloudinary;