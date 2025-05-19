// controllers/areaController.js
import Area from '../models/Area.js';
import { cloneAreaFromCut } from '../utils/cut/cloneAreaFromCut.js';

export const createArea = async (req, res) => {
  try {
    const newArea = new Area({ ...req.body, projectId: req.params.projectId });
    await newArea.save();
    res.status(201).json(newArea);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create area' });
  }
};

export const getAreaById = async (req, res) => {
  try {
    const area = await Area.findOne({ _id: req.params.areaId, projectId: req.projectId });
    if (!area) return res.status(404).json({ message: 'Area not found' });
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch area' });
  }
};

export const updateArea = async (req, res) => {
  try {
    const area = await Area.findOneAndUpdate(
      { _id: req.params.areaId, projectId: req.projectId },
      req.body,
      { new: true }
    );
    res.json(area);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update area' });
  }
};

export const updatePolygon = async (req, res) => {
  try {
    const area = await Area.findOne({ _id: req.params.areaId, projectId: req.projectId });
    if (!area) return res.status(404).json({ message: 'Area not found' });

    area.polygon = req.body.polygon;
    await area.save();
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update polygon' });
  }
};

export const deleteArea = async (req, res) => {
  try {
    await Area.findOneAndDelete({ _id: req.params.areaId, projectId: req.projectId });
    res.status(200).json({ message: 'Area deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete area' });
  }
};

export const publishArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.areaId);
    if (!area) return res.status(404).json({ message: 'Area not found' });

    area.isPublished = true;
    await area.save();
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: 'Failed to publish area' });
  }
};

export const cutAndCloneArea = async (req, res) => {
  try {
    const newArea = await cloneAreaFromCut(req.projectId, req.params.areaId, req.body);
    res.status(201).json(newArea);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cut area', error: err.message });
  }
};
