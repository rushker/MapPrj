// server/controllers/mapController.js
import MapArea from '../models/MapArea.js';

// Upload area
export const uploadArea = async (req, res) => {
  try {
    const { name, description, coordinates } = req.body;
    const imageUrl = req.file?.path || null;

    let parsedCoordinates = [];
    try {
      parsedCoordinates = JSON.parse(coordinates);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid coordinates format' });
    }

    const newArea = new MapArea({
      name,
      description,
      coordinates: parsedCoordinates,
      imageUrl,
    });

    await newArea.save();
    res.status(201).json(newArea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get areas
export const getAreas = async (req, res) => {
  try {
    const areas = await MapArea.find();
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
