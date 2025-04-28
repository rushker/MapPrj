// server/controllers/areaController.js
import MapArea from '../models/MapArea.js';

// @desc    Create a new Area (polygon or marker)
// @route   POST /api/areas
// @access  Admin
export const createArea = async (req, res, next) => {
  try {
    const { mapId, name, description, coordinates, info } = req.body;
    const parsedCoords = JSON.parse(coordinates || '[]');
    const parsedInfo = info ? JSON.parse(info) : {};

    const newArea = await MapArea.create({
      mapId,
      name,
      description,
      coordinates: parsedCoords,
      info: parsedInfo,
      imageUrl: req.file?.path || ''
    });

    res.status(201).json(newArea);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all Areas for a given Map
// @route   GET /api/areas?mapId=xxx
// @access  Public
export const getAreas = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.mapId) filter.mapId = req.query.mapId;
    const areas = await MapArea.find(filter);
    res.json(areas);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single Area by ID
// @route   GET /api/areas/:id
// @access  Public
export const getAreaById = async (req, res, next) => {
  try {
    const area = await MapArea.findById(req.params.id);
    if (!area) return res.status(404).json({ message: 'Area not found' });
    res.json(area);
  } catch (err) {
    next(err);
  }
};

// @desc    Update an existing Area
// @route   PUT /api/areas/:id
// @access  Admin
export const updateArea = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.coordinates) updates.coordinates = JSON.parse(updates.coordinates);
    if (updates.info) updates.info = JSON.parse(updates.info);
    if (req.file) updates.imageUrl = req.file.path;

    const area = await MapArea.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!area) return res.status(404).json({ message: 'Area not found' });
    res.json(area);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete an Area
// @route   DELETE /api/areas/:id
// @access  Admin
export const deleteArea = async (req, res, next) => {
  try {
    const area = await MapArea.findByIdAndDelete(req.params.id);
    if (!area) return res.status(404).json({ message: 'Area not found' });
    res.json({ message: 'Area deleted' });
  } catch (err) {
    next(err);
  }
};



