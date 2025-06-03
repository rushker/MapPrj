//server/controller/areaController.js
import Area from '../models/Area.js';
import { handleError, handleNotFound } from '../utils/errorHandler.js';

/* ─────────────────────── READ ─────────────────────── */

// Lấy toàn bộ Khu A
export const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.json({ success: true, data: areas });
  } catch (err) {
    handleError(res, 'Failed to fetch areas', err);
  }
};

// Lấy chi tiết 1 Khu A
export const getAreaById = async (req, res) => {
  try {
    const { areaId } = req.params;
    const area = await Area.findById(areaId);
    if (!area) return handleNotFound(res, 'Area', areaId);
    res.json({ success: true, data: area });
  } catch (err) {
    handleError(res, 'Failed to fetch area', err);
  }
};

/* ─────────────────────── CREATE ─────────────────────── */

export const createArea = async (req, res) => {
  try {
    const newArea = new Area(req.body);
    await newArea.save();
    res.status(201).json({ success: true, data: newArea });
  } catch (err) {
    handleError(res, 'Failed to create area', err, 400);
  }
};

/* ─────────────────────── UPDATE ─────────────────────── */

export const updateArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    const area = await Area.findByIdAndUpdate(areaId, req.body, { new: true });
    if (!area) return handleNotFound(res, 'Area', areaId);
    res.json({ success: true, data: area });
  } catch (err) {
    handleError(res, 'Failed to update area', err, 400);
  }
};

// Cập nhật polygon
export const updatePolygon = async (req, res) => {
  try {
    const { areaId } = req.params;
    const area = await Area.findById(areaId);
    if (!area) return handleNotFound(res, 'Area', areaId);

    const geoJsonPolygon = req.body.polygon.map(ring =>
      ring.map(([lat, lng]) => [lng, lat])
    );

    area.polygon = {
      type: 'Polygon',
      coordinates: [geoJsonPolygon],
    };
    await area.save();
    res.json({ success: true, data: area });
  } catch (err) {
    handleError(res, 'Failed to update polygon', err);
  }
};

// Đánh dấu đã publish
export const publishArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    const area = await Area.findById(areaId);
    if (!area) return handleNotFound(res, 'Area', areaId);

    area.isPublished = true;
    await area.save();
    res.json({ success: true, data: area });
  } catch (err) {
    handleError(res, 'Failed to publish area', err);
  }
};

/* ─────────────────────── DELETE ─────────────────────── */

export const deleteArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    const deleted = await Area.findByIdAndDelete(areaId);
    if (!deleted) return handleNotFound(res, 'Area', areaId);
    res.json({ success: true, message: 'Area deleted' });
  } catch (err) {
    handleError(res, 'Failed to delete area', err);
  }
};


/* ────────────────────────────── SEARCH ────────────────────────────── */

export const searchAreas = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter q is required' });
    }

    const regex = new RegExp(q, 'i');

    const areas = await Area.find({
      $or: [
        { name: regex },
        { tags: { $in: [regex] } }, // nếu tags có tồn tại
      ],
    });

    res.json({ success: true, data: areas });
  } catch (err) {
    handleError(res, 'Failed to search areas', err);
  }
};

