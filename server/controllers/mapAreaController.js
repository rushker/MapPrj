import MapArea from '../models/MapArea.js';

export const createMapArea = async (req, res) => {
    try {
      const { name, polygon, markers } = req.body;
  
      if (!polygon || !Array.isArray(markers)) {
        return res.status(400).json({ error: 'Polygon and markers are required' });
      }
  
      const newArea = new MapArea({ name, polygon, markers, isFinalized: true });
      await newArea.save();
      res.status(201).json(newArea);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save finalized map' });
    }
  };

export const getMapArea = async (req, res) => {
  try {
    const mapArea = await MapArea.findById(req.params.id);
    if (!mapArea || !mapArea.isFinalized) {
      return res.status(404).json({ error: 'Map not found or not finalized' });
    }
    res.json(mapArea);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch map area' });
  }
};
