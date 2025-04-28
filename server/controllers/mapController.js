// server/controllers/mapController.js
import Map from '../models/Map.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Create a new base map file (pdf, png, jpg)
// @route   POST /api/maps
// @access  Admin
export const createMap = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Map file is required' });
    const { title, description, bounds } = req.body;

    const result = await uploadToCloudinary(
      req.file.buffer,
      'maps',
      `map_${Date.now()}`
    );

    const map = await Map.create({
      title,
      description,
      fileUrl: result.secure_url,
      bounds: JSON.parse(bounds || '[]')
    });

    res.status(201).json(map);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all maps
// @route   GET /api/maps
// @access  Public
export const getMaps = async (req, res, next) => {
  try {
    const maps = await Map.find();
    res.status(200).json(maps);
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single map by ID
// @route   GET /api/maps/:id
// @access  Public
export const getMapById = async (req, res, next) => {
  try {
    const map = await Map.findById(req.params.id);
    if (!map) return res.status(404).json({ message: 'Map not found' });
    res.json(map);
  } catch (err) {
    next(err);
  }
};

// @desc    Update an existing map
// @route   PUT /api/maps/:id
// @access  Admin
export const updateMap = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.bounds) updates.bounds = JSON.parse(updates.bounds);
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'maps',
        `map_${req.params.id}_${Date.now()}`
      );
      updates.fileUrl = result.secure_url;
    }

    const map = await Map.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!map) return res.status(404).json({ message: 'Map not found' });
    res.json(map);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a map
// @route   DELETE /api/maps/:id
// @access  Admin
export const deleteMap = async (req, res, next) => {
  try {
    const map = await Map.findByIdAndDelete(req.params.id);
    if (!map) return res.status(404).json({ message: 'Map not found' });
    res.json({ message: 'Map deleted' });
  } catch (err) {
    next(err);
  }
};
