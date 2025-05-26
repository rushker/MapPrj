// controllers/mediaController.js
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import { handleError } from '../utils/errorHandler.js';

const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).single('file');

export const uploadImage = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'mapprj',
    });

    res.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (err) {
    handleError(res, 'Image upload failed', err);
  }
};

export const deleteImage = async (req, res) => {
  const { publicId } = req.body;
  
  if (!publicId || typeof publicId !== 'string') {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid public ID format' 
    });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') throw new Error('Cloudinary deletion failed');
    res.json({ success: true });
  } catch (err) {
    handleError(res, 'Failed to delete image', err);
  }
};
