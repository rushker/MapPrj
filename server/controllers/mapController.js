// controllers/mapController.js
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

export const uploadImage = (req, res) => {
  const file = req.file;
  if (!file || !file.path) return res.status(400).json({ error: 'No file uploaded or invalid file path' });

  res.json({ imageUrl: file.path }); // ✅ Cloudinary URL
};
