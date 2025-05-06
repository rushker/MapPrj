// controllers/mapController.js
import MapData from '../models/MapData.js';
import { uploader } from '../config/cloudinary.js';

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
  try {
    const file = req.file;
    const result = await uploader.upload(file.path, {
      folder: 'map-project'
    });
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed' });
  }
};
