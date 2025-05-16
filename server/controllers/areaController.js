// controllers/areaController.js
import Project from '../models/Project.js';
import mongoose from 'mongoose';

// Utility to validate ObjectId
const isValidId = id => mongoose.Types.ObjectId.isValid(id);

// Add a new area to project
export const createArea = async (req, res) => {
  const { projectId } = req.params;
  const { polygon, title } = req.body;
  if (!isValidId(projectId)) return res.status(400).json({ error: 'Invalid projectId' });

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const areaId = new mongoose.Types.ObjectId().toString();
    const newArea = { areaId, title, polygon, subPolygons: [], markers: [], isPublished: false };

    project.areas.push(newArea);
    await project.save();
    res.status(201).json(newArea);
  } catch (err) {
    console.error('createArea error:', err);
    res.status(500).json({ error: 'Failed to create area' });
  }
};

// Update area metadata or entities
export const updateArea = async (req, res) => {
  const { projectId, areaId } = req.params;
  const updates = req.body; // expect { title?, polygon?, subPolygons?, markers?, isPublished? }

  if (!isValidId(projectId)) return res.status(400).json({ error: 'Invalid projectId' });

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const area = project.areas.id(areaId);
    if (!area) return res.status(404).json({ error: 'Area not found' });

    Object.assign(area, updates);
    await project.save();
    res.status(200).json(area);
  } catch (err) {
    console.error('updateArea error:', err);
    res.status(500).json({ error: 'Failed to update area' });
  }
};

// Delete an area
export const deleteArea = async (req, res) => {
  const { projectId, areaId } = req.params;
  if (!isValidId(projectId)) return res.status(400).json({ error: 'Invalid projectId' });

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const area = project.areas.id(areaId);
    if (!area) return res.status(404).json({ error: 'Area not found' });

    area.remove();
    await project.save();
    res.status(200).json({ message: 'Area deleted' });
  } catch (err) {
    console.error('deleteArea error:', err);
    res.status(500).json({ error: 'Failed to delete area' });
  }
};