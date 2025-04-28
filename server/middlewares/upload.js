// server/middleware/upload.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { PassThrough } from 'stream';

// Set up multer memory storage
const storage = multer.memoryStorage();

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpe?g|png|gif/;
  const isAllowed = allowedTypes.test(file.mimetype.toLowerCase());
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Set up multer with file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Function to upload image to Cloudinary
const uploadToCloudinary = async (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Automatically detect file type
        public_id: filename, // Optional: Set a custom public ID
        folder: 'myFolder', // Optional: Set a custom folder in Cloudinary
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );

    const bufferStream = new PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(stream);
  });
};

export { upload, uploadToCloudinary };
