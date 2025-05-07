// controllers/mapController.js
import MapData from '../models/MapData.js';
import cloudinary from '../config/cloudinary.js';

export const getMap = async (req, res) => {
  try {
    const map = await MapData.findById(req.params.id);
    if (!map) return res.status(404).json({ error: 'Map not found' });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch map' });
  }
};

export const saveMap = async (req, res) => {
  try {
    const { name, polygon, markers, isFinalized } = req.body;
    const newMap = new MapData({ name, polygon, markers, isFinalized });
    await newMap.save();
    res.status(201).json(newMap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save map' });
  }
};
export const updateMap = async (req, res) => {
  try {
    const { name, polygon, markers, isFinalized } = req.body;
    const updated = await MapData.findByIdAndUpdate(
      req.params.id,
      { name, polygon, markers, isFinalized },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Map not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update map' });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    const result = await cloudinary.uploader.upload(image, {
      folder: 'map-images',
    });
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed' });
  }
};

export const deleteMapData = async (req, res) => {
  try {
    const map = await MapData.findById(req.params.id);
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