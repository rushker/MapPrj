// backend/controllers/mapAreaController.js
import MapArea from '../models/MapArea.js';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';

// Utility to extract Cloudinary public_id robustly
const extractPublicId = (url) => {
  try {
    // Remove query params, then strip off extension
    const pathname = new URL(url).pathname; // e.g. /map-images/abc123.jpg
    const withoutExt = pathname.replace(/\.[^/.]+$/, '');
    return withoutExt.startsWith('/') ? withoutExt.slice(1) : withoutExt;
  } catch (err) {
    console.warn('Failed to parse publicId from URL:', url, err.message);
    return null;
  }
};

// 1. CUT - Save a new map area (GeoJSON polygon)
export const cutMapArea = async (req, res) => {
  const { polygon } = req.body;
  console.log("Full request body:", req.body);
  
  if (!polygon) {
    return res.status(400).json({ error: 'Missing polygon data' });
  }

  // Validate the polygon structure
  if (typeof polygon !== 'object' || !polygon.type || polygon.type !== 'Polygon') {
    return res.status(400).json({ 
      error: `Invalid polygon format`,
      details: {
        expected: { type: 'Polygon', coordinates: 'Array' },
        received: polygon
      }
    });
  }

  if (!Array.isArray(polygon.coordinates) || !polygon.coordinates[0] || !Array.isArray(polygon.coordinates[0])) {
    return res.status(400).json({ 
      error: 'Invalid coordinates format',
      details: 'Expected array of coordinate arrays'
    });
  }

  try {
    const newArea = await MapArea.create({
      name: 'Untitled Area',
      polygon: {
        type: 'Polygon',
        coordinates: polygon.coordinates
      },
      isFinalized: false,
    });
    
    res.status(201).json({ 
      _id: newArea._id,
      id: newArea._id,
      message: 'Map area created successfully'
    });
    
  } catch (err) {
    console.error('Error in cutMapArea:', err);
    res.status(500).json({ 
      error: 'Failed to cut map area',
      details: err.message 
    });
  }
};

// 2. UPDATE - Add metadata, markers, finalize
export const updateMapArea = async (req, res) => {
  const { id } = req.params;
  const { name, markers, isFinalized } = req.body;

  try {
    const updated = await MapArea.findByIdAndUpdate(
      id,
      { name, markers, isFinalized },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Map area not found' });
    }
    console.log(`Updated MapArea ${id}`);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error in updateMapArea:', err.message);
    res.status(500).json({ error: 'Failed to update map area' });
  }
};

// 3. GET ONE for editing
export const getMapAreaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Add ID validation
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const area = await MapArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ error: 'Map area not found' });
    }
    res.status(200).json(area);
  } catch (err) {
    console.error('Error in getMapAreaById:', err.message);
    res.status(500).json({ error: 'Failed to fetch map area' });
  }
};

// 4. GET ALL for dashboard
export const getAllMapAreas = async (req, res) => {
  try {
    const areas = await MapArea.find().sort({ createdAt: -1 });
    res.status(200).json(areas);
  } catch (err) {
    console.error('Error in getAllMapAreas:', err.message);
    res.status(500).json({ error: 'Failed to fetch map areas' });
  }
};

// 5. DELETE with Cloudinary cleanup
export const deleteMapArea = async (req, res) => {
  const { id } = req.params;
  try {
    const area = await MapArea.findById(id);
    if (!area) {
      return res.status(404).json({ error: 'Map area not found' });
    }
    // Delete images in parallel
    await Promise.all(
      area.markers.map(async (m) => {
        if (m.imageUrl) {
          const publicId = extractPublicId(m.imageUrl);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      })
    );
    await area.remove();
    console.log(`Deleted MapArea ${id}`);
    res.status(200).json({ message: 'Map area deleted successfully' });
  } catch (err) {
    console.error('Error in deleteMapArea:', err.message);
    res.status(500).json({ error: 'Failed to delete map area' });
  }
};
