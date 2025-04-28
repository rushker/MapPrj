//server/ultis cloudinary.js
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

/**
 * @param {Buffer} buffer  - file buffer from multer
 * @param {string} folder  - Cloudinary folder name
 * @param {string} publicId - optional public ID
 * @returns {Promise<object>} - Cloudinary upload response
 */
export function uploadToCloudinary(buffer, folder, publicId = undefined) {
  return new Promise((resolve, reject) => {
    const opts = { folder, resource_type: 'auto' };
    if (publicId) opts.public_id = publicId;

    const uploadStream = cloudinary.uploader.upload_stream(
      opts,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}
