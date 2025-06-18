import Area from '../models/Area.js';
import mongoose from 'mongoose';

export const checkAreaExists = async (req, res, next) => {
  try {
    const { areaId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(areaId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid area ID format'
      });
    }

    const areaExists = await Area.exists({ _id: areaId });
    if (!areaExists) {
      return res.status(404).json({
        success: false,
        message: 'Area not found'
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error while verifying area',
      error: err.message
    });
  }
};