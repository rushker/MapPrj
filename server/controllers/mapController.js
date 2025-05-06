// controllers/mapController.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import MapData from '../models/MapData.js';

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

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'map-images'
    });

    fs.unlinkSync(file.path); // Clean up temp file
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
};
