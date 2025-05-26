// controllers/areaController.js
import Area from '../models/Area.js';
import { cloneAreaFromCut } from '../utils/cut/cloneAreaFromCut.js';
import Project from '../models/Project.js';
/* Helper Responses */
const handleNotFound = (res, entity = 'Area') =>
  res.status(404).json({ success: false, message: `${entity} not found` });

const handleError = (res, message, error, code = 500) => {
  console.error(message, error);
  return res.status(code).json({ success: false, message });
};

/* ────────────────────────────── READ ────────────────────────────── */

export const getAreasByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const areas = await Area.find({ projectId });
    res.json({ success: true, data: areas });
  } catch (err) {
    handleError(res, 'Failed to fetch areas', err);
  }
};

export const getAreaById = async (req, res) => {
  try {
    const { projectId, areaId } = req.params;
    const area = await Area.findOne({ _id: areaId, projectId });
    if (!area) return handleNotFound(res, 'Area');
    res.json({ success: true, data: area });
  } catch (err) {
    handleError(res, 'Failed to fetch area', err);
  }
};

/* ────────────────────────────── CREATE ────────────────────────────── */

export const createArea = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return handleNotFound(res, 'Project');

    const newArea = new Area({ ...req.body, projectId });
    await newArea.save();

    // ✅ Sử dụng atomic update để tránh race condition
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { areas: newArea._id } },
      { new: true, useFindAndModify: false } // Thêm option này
    );
    
    if (!updatedProject) {
      // Rollback area nếu update project thất bại
      await Area.deleteOne({ _id: newArea._id });
      return handleError(res, 'Failed to update project', null, 500);
    }

    res.status(201).json({ success: true, data: newArea });
  } catch (err) {
    // Xóa area nếu có lỗi sau khi tạo
    if (newArea?._id) await Area.deleteOne({ _id: newArea._id });
    handleError(res, 'Failed to create area', err, 400);
  }
};

/* ────────────────────────────── UPDATE ────────────────────────────── */

export const updateArea = async (req, res) => {
  try {
    const { projectId, areaId } = req.params;
    const area = await Area.findOneAndUpdate(
      { _id: areaId, projectId },
      req.body,
      { new: true }
    );
    if (!area) return handleNotFound(res, 'Area');
    res.json({ success: true, data: area });
  } catch (err) {
    handleError(res, 'Failed to update area', err, 400);
  }
};

export const updatePolygon = async (req, res) => {
  try {
    const { projectId, areaId } = req.params;
    const area = await Area.findOne({ _id: areaId, projectId });
    if (!area) return handleNotFound(res, 'Area');

    // Chuyển đổi từ Leaflet [lat, lng] sang GeoJSON [lng, lat]
    const geoJsonPolygon = req.body.polygon.map(ring =>
      ring.map(([lat, lng]) => [lng, lat])
    );

    area.polygon = {
      type: 'Polygon',
      coordinates: [geoJsonPolygon] // Đảm bảo cấu trúc 3 chiều
    };
    await area.save();
    res.json({ success: true, data: area });
  } catch (err) {
    handleError(res, 'Failed to update polygon', err);
  }
};

export const publishArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    const area = await Area.findById(areaId);
    if (!area) return handleNotFound(res);

    area.isPublished = true;
    await area.save();
    res.json({ success: true, data: area });
  } catch (err) {
    handleError(res, 'Failed to publish area', err);
  }
};

/* ────────────────────────────── DELETE ────────────────────────────── */

export const deleteArea = async (req, res) => {
  try {
    const { projectId, areaId } = req.params;
    const deleted = await Area.findOneAndDelete({ _id: areaId, projectId });
    if (!deleted) return handleNotFound(res);
    res.json({ success: true, message: 'Area deleted' });
  } catch (err) {
    handleError(res, 'Failed to delete area', err);
  }
};

/* ────────────────────────────── CUT/CLONE ────────────────────────────── */

export const cutAndCloneArea = async (req, res) => {
  try {
    const { projectId, areaId } = req.params;
    const newEntity = await cloneAreaFromCut(projectId, areaId, req.body);
    res.status(201).json({ success: true, data: newEntity });
  } catch (err) {
    handleError(res, 'Failed to cut area', err);
  }
};

/* ────────────────────────────── SEARCH ────────────────────────────── */

export const searchAreas = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { q } = req.query;
    const regex = new RegExp(q, 'i');
    const areas = await Area.find({
      projectId,
      $or: [
        { name: regex },
        { tags: { $in: [regex] } }, // optional if `tags` field exists
      ],
    });
    res.json({ success: true, data: areas });
  } catch (err) {
    handleError(res, 'Failed to search areas', err);
  }
};
