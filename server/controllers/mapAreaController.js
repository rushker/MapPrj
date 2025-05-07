// controllers/mapAreaController.js
import MapArea from '../models/MapArea.js';
import cloudinary from '../config/cloudinary.js';

export const createMapArea = async (req, res) => {
  try {
    const { name, polygon, markers } = req.body;
    const newMap = new MapArea({ name, polygon, markers, isFinalized: true });
    await newMap.save();
    res.status(201).json(newMap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create finalized map' });
  }
};

export const getMapArea = async (req, res) => {
  try {
    const map = await MapArea.findById(req.params.id);
    if (!map || !map.isFinalized) return res.status(404).json({ error: 'Map not found' });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch public map' });
  }
};

export const updateMapArea = async (req, res) => {
  try {
    const { name, polygon, markers } = req.body;
    const updated = await MapArea.findByIdAndUpdate(
      req.params.id,
      { name, polygon, markers },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Map not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update map area' });
  }
};

export const deleteMapArea = async (req, res) => {
  try {
    const map = await MapArea.findById(req.params.id);
    if (!map) return res.status(404).json({ error: 'Map not found' });

    for (const marker of map.markers) {
      if (marker.imageUrl) {
        const publicId = marker.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`map-images/${publicId}`);
      }
    }

    await map.deleteOne();
    res.json({ message: 'Map deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete map' });
  }
};
