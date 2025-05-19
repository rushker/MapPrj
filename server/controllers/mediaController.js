// controllers/mediaController.js
import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'mapprj',
    });
    res.json({ url: uploadResponse.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
};
