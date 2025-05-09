// server/config/db.js
import mongoose from 'mongoose';

export const getMap = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid map ID format.' });
    }

    const map = await MapData.findById(id);
    if (!map) return res.status(404).json({ message: 'Map not found.' });

    res.json(map);
  } catch (error) {
    console.error('Error in getMap:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


export default connectDB;
