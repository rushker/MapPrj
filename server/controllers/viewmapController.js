// controllers/viewmapController.js
import Project from '../models/Project.js';
import turf from '@turf/turf';
import mongoose from 'mongoose';

const isValidId = id => mongoose.Types.ObjectId.isValid(id);

// Get published area data for view
export const getViewMap = async (req, res) => {
  const { projectId, areaId } = req.params;
  if (!isValidId(projectId)) return res.status(400).json({ error: 'Invalid projectId' });

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const area = project.areas.find(a => a.areaId === areaId && a.isPublished);
    if (!area) return res.status(404).json({ error: 'Published area not found' });

    // Optionally generate mask polygon
    const world = turf.bboxPolygon([-180, -90, 180, 90]);
    const maskGeo = turf.difference(world, area.polygon);

    res.status(200).json({ area, mask: maskGeo });
  } catch (err) {
    console.error('getViewMap error:', err);
    res.status(500).json({ error: 'Failed to fetch view map' });
  }
};

// Publish area for view
export const publishArea = async (req, res) => {
  const { projectId, areaId } = req.params;
  if (!isValidId(projectId)) return res.status(400).json({ error: 'Invalid projectId' });

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const area = project.areas.find(a => a.areaId === areaId);
    if (!area) return res.status(404).json({ error: 'Area not found' });

    area.isPublished = true;
    await project.save();
    res.status(200).json({ message: 'Area published' });
  } catch (err) {
    console.error('publishArea error:', err);
    res.status(500).json({ error: 'Failed to publish area' });
  }
};
