// controllers/mapController.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs/promises';
import MapData from '../models/MapData.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const getMapData = async (req, res) => {
  try {
    const map = await MapData.findById(req.params.id);
    if (!map) return res.status(404).json({ error: 'Map not found' });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch map' });
  }
};

export const updateMapData = async (req, res) => {
  try {
    const { polygon, markers } = req.body;
    const map = await MapData.findByIdAndUpdate(
      req.params.id,
      { polygon, markers },
      { new: true, runValidators: true }
    );
    if (!map) return res.status(404).json({ error: 'Map not found' });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update map' });
  }
};

export const uploadImage = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  // Validate type and size
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  if (file.size > MAX_FILE_SIZE) {
    return res.status(400).json({ error: 'File too large (max 5MB)' });
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'map-images'
    });

    // Clean up temp file
    try {
      await fs.unlink(file.path);
    } catch (e) {
      console.warn('Temp file already removed or inaccessible');
    }

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    res.status(500).json({
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Image upload failed'
    });
  }
};
export const deleteMap = async (req, res) => {
  try {
    const map = await MapArea.findById(req.params.id);
    if (!map) return res.status(404).json({ error: 'Map not found' });

    // Delete images from Cloudinary
    for (const marker of map.markers) {
      if (marker.imageUrl) {
        const publicId = marker.imageUrl.split('/').pop().split('.')[0]; // get public ID
        await cloudinary.uploader.destroy(`map-images/${publicId}`);
      }
    }

    await map.deleteOne();
    res.json({ message: 'Map deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete map' });
  }
};


